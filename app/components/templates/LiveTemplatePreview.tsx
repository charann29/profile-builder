'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getTemplateMeta } from '@/app/lib/templates-registry';

interface LiveTemplatePreviewProps {
    templateId: string;
}

export default function LiveTemplatePreview({ templateId }: LiveTemplatePreviewProps) {
    const [html, setHtml] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement>(null);
    const [style, setStyle] = useState<React.CSSProperties>({ transform: 'scale(0.3)' });

    const meta = getTemplateMeta(templateId);
    const width = meta?.dimensions?.width || 794;
    const height = meta?.dimensions?.height || 1123;

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const res = await fetch(`/api/template/${templateId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.html) {
                        const Handlebars = (await import('handlebars')).default;
                        const template = Handlebars.compile(data.html);
                        const dummyData = {
                            fullName: "Alex Morgan",
                            tagline: "Product Designer",
                            aboutMe: "Creative thinker building digital experiences. I create clean, robust code.",
                            contact: { emailShow: true, emailPrimary: "alex@example.com", phoneShow: true, phonePrimary: "+1 234 567 890" }
                        };
                        setHtml(template(dummyData));
                    }
                }
            } catch (error) {
                console.error(`Failed to load preview for ${templateId}`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [templateId]);

    // Scaling Logic: Cover Mode
    useEffect(() => {
        const calculateScale = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;

            if (containerWidth === 0 || containerHeight === 0) return;

            // Calculate ratios
            const ratioContainer = containerWidth / containerHeight;
            const ratioTemplate = width / height;

            let newScale;
            // If container is wider than template (relative to aspect), scale by width
            // If container is taller, scale by height
            // To COVER: Use Math.max
            const scaleWid = containerWidth / width;
            const scaleHei = containerHeight / height;
            newScale = Math.max(scaleWid, scaleHei);

            // Center alignment logic
            // We want to center the content within the container
            // Since we transform-origin top-left, we need to translate.

            const scaledWidth = width * newScale;
            const scaledHeight = height * newScale;

            const xOffset = (containerWidth - scaledWidth) / 2;
            const yOffset = (containerHeight - scaledHeight) / 2; // Center vertically too? or Top?
            // Usually top is better for documents, but "fully filled" implies center crop often.
            // Let's go with Top Center for documents so header is visible, unless it cuts off too much?
            // "Fixed size fully filled" -> Thumbnail behavior. 
            // Let's use Top Center. 

            setStyle({
                transform: `translate(${xOffset}px, 0px) scale(${newScale})`, // Top-Center
            });
        };

        const observer = new ResizeObserver(calculateScale);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        calculateScale();
        window.addEventListener('resize', calculateScale);

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', calculateScale);
        };
    }, [width, height]);

    if (loading) return <div className="w-full h-full bg-slate-50 animate-pulse" />;
    if (!html) return <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-xs">Unavailable</div>;

    return (
        <div ref={containerRef} className="w-full h-full relative overflow-hidden bg-slate-200 select-none">
            <div
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: style.transform,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0
                }}
            >
                <iframe
                    srcDoc={html}
                    className="w-full h-full border-none pointer-events-none"
                    sandbox="allow-scripts"
                    tabIndex={-1}
                    title={`Preview of ${templateId}`}
                />
            </div>
            {/* Block interaction */}
            <div className="absolute inset-0 z-10" />
        </div>
    );
}
