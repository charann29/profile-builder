'use server';

import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { createOpenAI } from '@ai-sdk/openai';
import { createGatewayProvider } from '@ai-sdk/gateway';
import { ProfileData } from './schema';
import { buildSystemPrompt, detectCurrentSection, computeSectionProgress } from './ai-prompt';

// Configuration from environment variables
const AI_PROVIDER = process.env.AI_PROVIDER || 'groq';
const AI_MODEL = process.env.AI_MODEL || ''; // Leave empty to use provider specific defaults

// Provider-specific names/models
const VERCEL_MODEL = (process.env.vercel_AI_MODEL || 'gemini-1.5-flash').trim();
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Provider-specific API keys
const groqKey = (process.env.NEXT_PUBLIC_GROQ_API_KEY || '').trim();
const googleKey = (process.env.GOOGLE_GENERATIVE_AI_API_KEY || '').trim();
const vercelKey = (process.env.vercel_AI_API_KEY || '').trim();
const openaiKey = (process.env.OPENAI_API_KEY || '').trim();

// Initialize providers
const groq = createGroq({ apiKey: groqKey });
const google = createGoogleGenerativeAI({ apiKey: googleKey });
const openai = createOpenAI({ apiKey: openaiKey });
const vercelGateway = createGatewayProvider({
    apiKey: vercelKey,
});

/**
 * Get the appropriate model based on AI_PROVIDER and AI_MODEL env vars
 */
const getModel = () => {
    switch (AI_PROVIDER.toLowerCase()) {
        case 'vercel': {
            const modelName = AI_MODEL || VERCEL_MODEL;
            // Vercel Gateway expects provider/model format
            const fullModelName = modelName.includes('/')
                ? modelName
                : (modelName.includes('gemini') ? `google/${modelName}` : `openai/${modelName}`);
            return vercelGateway(fullModelName);
        }
        case 'google':
            return google(AI_MODEL || 'gemini-1.5-flash');
        case 'openai':
            return openai(AI_MODEL || 'gpt-4o');
        case 'groq':
        default:
            return groq(AI_MODEL || GROQ_MODEL);
    }
};

// ─── LinkedIn Profile Extraction ──────────────────────────────────────────────
export const extractProfileFromLinkedIn = async (linkedInJson: unknown): Promise<Partial<ProfileData>> => {
    const prompt = `You are an expert profile builder. Extract information from the following LinkedIn JSON data and map it to a professional profile structure.

Structure to fill (JSON only):
- fullName: Display name
- tagline: LinkedIn headline
- profilePhoto: pictureUrl if available
- aboutMe: summary field content
- expertiseAreas: up to 5, derived from content/skills
- topHighlights: 3 key achievement lines from headline/bio (look for numbers, metrics, titles)
- professionalTitle: Professional qualifications
- positions: [{ title, company, location, duration, description, logo }]
- education: [{ schoolName, degreeName, fieldOfStudy, duration }]
- skills: array of skill strings
- socialLinks: { linkedin, website }
- brands: [{ name, role, duration }] — from positions/companies

JSON Data:
${JSON.stringify(linkedInJson)}

Return ONLY a valid JSON object matching the profile structure. Include only fields you can extract.`;

    try {
        const result = streamText({
            model: getModel(),
            messages: [{ role: 'user', content: prompt }],
        });

        const fullText = await result.text;
        if (fullText) {
            const cleanText = fullText.replace(/```json\n?|\n?```/g, '');
            return JSON.parse(cleanText);
        }
    } catch (error) {
        console.error('Error extracting LinkedIn profile:', error);
    }
    return {};
};

// ─── Chat Response Types ──────────────────────────────────────────────────────
export interface AiChatResult {
    text: string;
    updatedData?: Partial<ProfileData>;
    suggestedReplies?: string[];
    sectionProgress?: Record<string, number>;
}

// ─── Interactive AI Chat ──────────────────────────────────────────────────────
export const getAiChatResponse = async (
    messages: { text: string; sender: 'user' | 'bot' }[],
    currentProfileData: Partial<ProfileData>
): Promise<AiChatResult> => {
    const currentSection = detectCurrentSection(currentProfileData);
    const systemPrompt = buildSystemPrompt(currentProfileData, currentSection);

    const chatHistory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: 'system', content: systemPrompt },
    ];

    const recentMessages = messages.slice(-10);
    for (const msg of recentMessages) {
        chatHistory.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
        });
    }

    try {
        const result = streamText({
            model: getModel(),
            messages: chatHistory as any,
            temperature: 0.7,
        });

        const fullText = await result.text;

        if (fullText) {
            const cleanText = fullText.replace(/```json\n?|\n?```/g, '');
            let parsed;
            try {
                parsed = JSON.parse(cleanText);
            } catch (e) {
                return { text: fullText };
            }

            const progress = computeSectionProgress({
                ...currentProfileData,
                ...(parsed.updatedData || {}),
            });

            return {
                text: parsed.text || "I didn't quite catch that. Could you try rephrasing?",
                updatedData: parsed.updatedData || undefined,
                suggestedReplies: parsed.suggestedReplies || [],
                sectionProgress: progress,
            };
        }
    } catch (error) {
        console.error('Error getting AI chat response:', error);
    }

    return {
        text: "I'm having a moment — could you try that again?",
        suggestedReplies: ["Let's continue", "Start over"],
    };
};
