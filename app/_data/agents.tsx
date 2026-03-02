import React from 'react';
import { ArrowRight, Sparkles, Building2, CheckCircle, TrendingUp, Presentation, LineChart, FileText, FileSignature, Receipt, BookOpen, Users } from 'lucide-react';

export const agentsData = [
    {
        id: "incorporation",
        title: "AI Legal Entity Incorporation",
        badge: "Live Now",
        icon: <Building2 className="w-8 h-8 text-red-500" />,
        description: "Launch your startup in 60 seconds. Our AI asks you key questions, suggests the perfect legal structure (LLC, C-Corp, etc.), helps you find a domain, and handles the actual incorporation.",
        link: "https://startup.oneasy.ai/",
        features: ["Instant Entity Suggestion", "Domain & Trade Name Search", "End-to-End Filing"],
        example: "User: I want to build a SaaS app for dentists. What entity do I need?\nAI: Based on your goals and plan to raise VC money, a Delaware C-Corp is your best option. Let's reserve ‘DentistSaaS' as your trade name. Ready to file?"
    },
    {
        id: "business-model",
        title: "Business Model AI",
        badge: "Core Tools",
        icon: <Presentation className="w-8 h-8 text-red-500" />,
        description: "Validate your idea instantly. Generate comprehensive competitor analysis, go-to-market strategies, and market sizing. Export a master business model document.",
        link: "#",
        features: ["Idea Validation", "Competitor Analysis", "GTM Strategy Generation"],
        example: "User: I need a GTM strategy for my new coffee brand.\nAI: Here is a multi-channel go-to-market strategy including D2C focus, initial local partnerships, and target audience penetration metrics."
    },
    {
        id: "financial-model",
        title: "Financial Model & Valuation AI",
        badge: "Core Tools",
        icon: <LineChart className="w-8 h-8 text-red-500" />,
        description: "How much should you price your product? How do you build a P&L? Get your unit economics, financial projections, and an estimated company valuation automatically.",
        link: "#",
        features: ["Unit Economics Breakdown", "P&L Generation", "Estimated Valuation"],
        example: "User: How much should I price my subscription?\nAI: Based on your CAC of $40 and desired payback period of 3 months, a monthly price of $15 yields optimal LTV:CAC ratios."
    },
    {
        id: "business-scaler",
        title: "Business Scaler AI Coach",
        badge: "Growth",
        icon: <TrendingUp className="w-8 h-8 text-red-500" />,
        description: "Take your SMB to structured heights. An AI coach that helps you with goal setting, daily operations, identifying core business functions, and setting up automation.",
        link: "#",
        features: ["Goal Tracking", "Operations Automation", "Structure Planning"],
        example: "Identify operational bottlenecks and receive a step-by-step roadmap to automate client onboarding."
    },
    {
        id: "proposal-builder",
        title: "AI Proposal Builder",
        badge: "Sales",
        icon: <FileText className="w-8 h-8 text-red-500" />,
        description: "Close deals faster. Upload your website URL and product info, select a premium template, and generate a tailored, winning business proposal in under 2 minutes.",
        link: "#",
        features: ["URL-Based Generation", "Premium Templates", "Instant Export"],
        example: "Upload your agency website. AI drafts a personalized $10k retainer proposal for your new lead tailored to their industry."
    },
    {
        id: "document-writer",
        title: "AI Legal Document Writer",
        badge: "Pay per use",
        icon: <FileSignature className="w-8 h-8 text-red-500" />,
        description: "Draft legally vetted offer letters, partnership deeds, rental agreements, and more. Talk to the AI to customize it, and download for as low as Rs 9/document.",
        link: "#",
        features: ["Conversational Editing", "Legally Vetted Templates", "Affordable Downloads"],
        example: "User: Write a standard offer letter for a Senior Dev.\nAI: Drafted. Do you want to add a 6-month cliff for the equity grant?"
    },
    {
        id: "invoice-generator",
        title: "AI Voice Invoice Generator",
        badge: "Operations",
        icon: <Receipt className="w-8 h-8 text-red-500" />,
        description: "Talk to it like your accountant. Tell the AI what you billed for, and it formulates a professional invoice in your chosen template ready to send.",
        link: "#",
        features: ["Voice-to-Invoice", "Smart Line Items", "Template Selection"],
        example: "User: Create an invoice for John for 10 hours of consulting and a $50 software expense.\nAI: Generated. Standard Net-30 terms applied."
    },
    {
        id: "document-summary",
        title: "AI Document Analyzer",
        badge: "Insights",
        icon: <BookOpen className="w-8 h-8 text-red-500" />,
        description: "Upload any massive PDF or contract. Instantly get a summary, key insights, and a list of potential problem areas or red flags.",
        link: "#",
        features: ["Massive PDF Support", "Red Flag Detection", "Executive Summaries"],
        example: "Upload a 50-page vendor contract. AI flags an unusual termination clause on page 42."
    },
    {
        id: "tax-filer",
        title: "AI Income Tax Filer",
        badge: "Compliance",
        icon: <Users className="w-8 h-8 text-red-500" />,
        description: "For professionals and business owners. Upload bank statements; the AI analyzes credits and debits to streamline your entire tax return filing process.",
        link: "#",
        features: ["Statement Analysis", "Credit/Debit Parsing", "Return Prep"],
        example: "Upload your HDFC bank PDF. AI categorizes 1000 transactions and highlights potential write-offs."
    },
];
