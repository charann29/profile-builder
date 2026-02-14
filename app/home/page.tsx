import React from 'react';
import Hero from './_components/Hero';
import Features from './_components/Features';
import HowItWorks from './_components/HowItWorks';
import FAQ from './_components/FAQ';
import Footer from './_components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'AI Personal Profile Generator | Build Your Professional Brand',
    description: 'Turn your LinkedIn profile into a stunning professional one-pager in seconds with our AI Personal Profile Generator.',
};

export default function MarketingPage() {
    return (
        <main className="min-h-screen bg-white">
            <Hero />
            <Features />
            <HowItWorks />
            <FAQ />
            <Footer />
        </main>
    );
}
