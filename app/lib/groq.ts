'use server';

import { streamText } from 'ai';
import { createGroq } from '@ai-sdk/groq';
import { ProfileData } from './schema';
import { buildSystemPrompt, detectCurrentSection, computeSectionProgress } from './ai-prompt';

const apiKey = (process.env.NEXT_PUBLIC_GROQ_API_KEY || '').trim();
const modelName = 'llama-3.3-70b-versatile';

if (!apiKey) {
    console.error('AI API Key (NEXT_PUBLIC_GROQ_API_KEY) is missing!');
}

// Create a custom Groq provider instance with the API key
const groq = createGroq({
    apiKey,
});


// Helper to ensure model name is correctly formatted for Groq provider
const getModel = (name: string) => {
    // If the name comes in with a prefix like 'groq/llama...', strip it for cleanliness,
    // though the provider might handle it.
    const cleanName = name.replace(/^groq\//, '');
    return groq(cleanName || modelName);
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
            model: getModel(modelName),
            messages: [{ role: 'user', content: prompt }],
        });

        const fullText = await result.text;
        if (fullText) {
            // Cleanup markdown code blocks if present
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

    // Build proper chat history with roles
    const chatHistory: { role: 'system' | 'user' | 'assistant'; content: string }[] = [
        { role: 'system', content: systemPrompt },
    ];

    // Include last 10 messages for context
    const recentMessages = messages.slice(-10);
    for (const msg of recentMessages) {
        chatHistory.push({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text,
        });
    }

    try {
        const result = streamText({
            model: getModel(modelName),
            messages: chatHistory as any,
            temperature: 0.7,
        });

        const fullText = await result.text; // Await the full stream

        if (fullText) {
            // Vercel SDK might return pure text. We need to parse JSON if the prompt asked for it. 
            // The system prompt DOES ask for JSON.
            const cleanText = fullText.replace(/```json\n?|\n?```/g, '');
            let parsed;
            try {
                parsed = JSON.parse(cleanText);
            } catch (e) {
                // If strictly text, just return content
                return { text: fullText };
            }

            // Compute updated progress
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
