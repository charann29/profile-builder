import React from 'react';
import { Sparkles, Building2, CheckCircle, TrendingUp, Presentation, LineChart, FileText, FileSignature, Receipt, BookOpen, Users, Briefcase, Calculator } from 'lucide-react';

export const agentsData = [
    {
        id: "incorporation",
        title: "AI Legal Entity Incorporation",
        badge: "Live Now",
        icon: <Building2 className="w-8 h-8 text-red-500" />,
        description: "Choose the appropriate legal entity in less than 60 seconds with the same expertise a CA would provide. From domain name searches to logo suggestions, our AI handles the entire incorporation seamlessly.",
        link: "https://startup.oneasy.ai/",
        features: ["Instant Entity Suggestion", "Domain & Trade Name Search", "End-to-End Filing"],
        example: "User: What kind of legal entity has to be incorporated for my new startup?\nAI: Don't worry! I've chosen the OnEasy legal AI incorporation path. I analyzed your answers in a few minutes and will assist in getting the incorporation done super fast."
    },
    {
        id: "business-model",
        title: "Business Model AI Agent",
        badge: "Core Tools",
        icon: <Presentation className="w-8 h-8 text-red-500" />,
        description: "Validate your ideas instantly. Generate comprehensive competitor analysis, go-to-market strategy, and market sizing to establish your core business model, ready to export as a master document.",
        link: "#",
        features: ["Idea Validation", "Competitor Analysis", "GTM Strategy"],
        example: "User: I need a GTM strategy, competitor analysis, and pitch deck for my coffee brand.\nAI: Validate your idea instantly! Here is your generated master business model document outlining your market positioning."
    },
    {
        id: "financial-model",
        title: "Financial Model AI Agent",
        badge: "Core Tools",
        icon: <LineChart className="w-8 h-8 text-red-500" />,
        description: "Want to know how to price your product? Want to know how to build the PL for your business? Want to know how much your company will be valued on an estimated basis? Get everything generated without any complex jargon.",
        link: "#",
        features: ["Pricing Strategy", "P&L Generation", "Estimated Valuation"],
        example: "User: Want to know how to price your product and build the PL for your business?\nAI: Based on your input, here's how much your company will be valued on an estimated basis. Your 100% compliant financial model is ready."
    },
    {
        id: "business-scaler",
        title: "Business Scaler AI Coach",
        badge: "Growth",
        icon: <TrendingUp className="w-8 h-8 text-red-500" />,
        description: "Scale your SMB to structured heights. Act as your AI coach to structure business operations, help with goal setting, identify core business functions, and set up your automation.",
        link: "#",
        features: ["Business Structuring", "Goal Setting", "Operations Automation"],
        example: "User: How do I structure my growing business operations?\nAI: I'm your AI Coach. Let's start with goal setting and identifying your core business functions. Then we'll introduce automation to scale your operations."
    },
    {
        id: "proposal-builder",
        title: "AI Proposal Builder",
        badge: "Sales",
        icon: <FileText className="w-8 h-8 text-red-500" />,
        description: "Prepare and send business proposals to your clients in under 2 minutes to close deals faster. Upload your website, tell us about your product, select a template, and send it immediately.",
        link: "#",
        features: ["2-Minute Generation", "URL & Product Based", "Premium Templates"],
        example: "User: I've uploaded my website URL and product details. I need a proposal to send to my client.\nAI: Generating from your selected template... Your personalized proposal is ready to send in under 2 minutes!"
    },
    {
        id: "document-writer",
        title: "AI Document Writer",
        badge: "Pay per use",
        icon: <FileSignature className="w-8 h-8 text-red-500" />,
        description: "Draft essential business documents such as offer letters, partnership deeds, and rental agreements. Talk to the AI, and download legally vetted documents for as low as Rs 9 per document.",
        link: "#",
        features: ["Conversational Drafting", "Legally Vetted Templates", "Rs 9 / Download"],
        example: "User: I need an offer letter and a partnership deed.\nAI: Select your templates and let's talk. I'll draft these legally vetted documents for you, available to download for just Rs 9 each."
    },
    {
        id: "invoice-generator",
        title: "AI Invoice Generator",
        badge: "Operations",
        icon: <Receipt className="w-8 h-8 text-red-500" />,
        description: "Talk to it like you talk to your accountant. Tell the AI what to bill, and it creates the invoice. Pick a template and send it across to your client with the click of a button.",
        link: "#",
        features: ["Conversational Invoicing", "Template Selection", "One-Click Send"],
        example: "User: Hey accountant, create an invoice for John for the new consulting project.\nAI: Listening to your request... Generating invoice in your chosen template. Ready to send across to your client with a click of a button!"
    },
    {
        id: "document-summary",
        title: "AI Document Summary",
        badge: "Insights",
        icon: <BookOpen className="w-8 h-8 text-red-500" />,
        description: "Upload any massive PDF or contract and instantly get a summary, key insights, and an analysis of the potential areas of understanding and issues.",
        link: "#",
        features: ["Instant Summaries", "Key Insights Extraction", "Issue Spotting"],
        example: "User: Can you analyze this 50-page vendor contract I uploaded?\nAI: Here is your summary and key insights. I've also highlighted potential areas of understanding the issues for you."
    },
    {
        id: "finance-professionals",
        title: "Finance Professionals AI",
        badge: "Productivity",
        icon: <Briefcase className="w-8 h-8 text-red-500" />,
        description: "Automate the regular tasks of a CA Article. Sort raw documents, identify missing documents, and organize files rapidly to let finance professionals focus on what matters.",
        link: "#",
        features: ["Document Sorting", "Missing Info Detection", "Task Automation"],
        example: "User: I have a bunch of raw client files that need sorting.\nAI: Acting as your CA Article... Sorting documents and identifying missing documents instantly."
    },
    {
        id: "tax-filer",
        title: "Income Tax Return Filer",
        badge: "Compliance",
        icon: <Calculator className="w-8 h-8 text-red-500" />,
        description: "For finance professionals and business owners. In simple steps, upload your bank statement, the AI analyzes credits and debits, and gives you the exact updates needed to file your returns.",
        link: "#",
        features: ["Bank Statement Analysis", "Credit/Debit Parsing", "Return Prep"],
        example: "User: I need to file my income tax return. Here's my bank statement.\nAI: Analyzing your credits and debits... Your update is ready to help you file the return in simple steps."
    },
];
