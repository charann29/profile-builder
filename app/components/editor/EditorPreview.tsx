'use client';

import React, { useEffect, useRef, useState } from 'react';
import Handlebars from 'handlebars';

interface EditorPreviewProps {
    html: string;
    data: any;
    onHtmlChange: (newHtml: string) => void;
    width?: number; // Base width (e.g., 794 for A4)
    height?: number; // Base height (e.g., 1123 for A4)
}

export default function EditorPreview({ html, data, onHtmlChange, width = 794, height = 1123 }: EditorPreviewProps) {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [compiledHtml, setCompiledHtml] = useState('');
    const lastEmittedHtml = useRef('');

    // Compile template when HTML or data changes
    useEffect(() => {
        try {
            if (!html) return;

            // If the incoming HTML matches what we just emitted from the iframe, 
            // skip re-compilation to prevent re-rendering and losing focus.
            if (html === lastEmittedHtml.current) {
                return;
            }

            const template = Handlebars.compile(html);
            const result = template(data);
            setCompiledHtml(result);
        } catch (e) {
            console.error("Handlebars compilation error:", e);
        }
    }, [html, data]);

    // Update iframe content
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (!doc) return;

        doc.open();
        doc.write(compiledHtml);
        doc.close();

        // Add visual editor script to the iframe
        const script = doc.createElement('script');
        script.textContent = `
            document.body.addEventListener('click', (e) => {
                const target = e.target;
                if (target.innerText && !target.hasAttribute('contenteditable')) {
                     if(target.children.length === 0) {
                        target.setAttribute('contenteditable', 'true');
                        target.focus();
                     }
                }
            });

            document.body.addEventListener('input', (e) => {
                 window.parent.postMessage({ type: 'HTML_UPDATE', html: document.documentElement.outerHTML }, '*');
            });
            
             // Disable links in editor to prevent navigation
            document.querySelectorAll('a').forEach(a => {
                a.addEventListener('click', (e) => e.preventDefault());
            });

            window.addEventListener('message', async (event) => {
                const { type, format, fileName } = event.data;
                if (type === 'GENERATE_DOWNLOAD') {
                    try {
                        // 1. Handle external stylesheets (Google Fonts etc) to avoid SecurityError
                        // NUCLEAR OPTION: Fetch all styles, then wipe HEAD to ensure no cross-origin sheets remain.
                        const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
                        let combinedCss = '';
                        
                        await Promise.all(links.map(async (link) => {
                             try {
                                 if (link.href && link.href.startsWith('http')) {
                                     const res = await fetch(link.href);
                                     if(res.ok) {
                                         combinedCss += await res.text();
                                         combinedCss += '\\n';
                                     }
                                 }
                             } catch(e) {
                                 console.warn("Failed to fetch style", link.href, e);
                             }
                        }));
                        
                        // Also get existing style tags
                        document.querySelectorAll('style').forEach(s => {
                            combinedCss += s.textContent + '\\n';
                        });

                        // Wipe Head
                        document.head.innerHTML = '';
                        
                        // Re-inject combined safe CSS
                        const style = document.createElement('style');
                        style.textContent = combinedCss;
                        document.head.appendChild(style);
                        
                        // 2. Clear any selection/focus to avoid cursor in cursor
                        if (document.activeElement instanceof HTMLElement) {
                            document.activeElement.blur();
                        }

                        const element = document.body;
                        const pixelRatio = 2; // High res

                        if (format === 'png' || format === 'pdf') {
                            // Ensure htmlToImage is loaded
                            if (!window.htmlToImage) {
                                throw new Error("Image generation library not loaded");
                            }
                            
                            // skipFonts: true prevents reading cssRules from cross-origin sheets (avoids SecurityError)
                            // We already inlined the CSS text manually above, which gives us the @font-face rules.
                            // While we aren't base64-ing the WOFF files, this avoids the crash.
                            const dataUrl = await window.htmlToImage.toPng(element, { 
                                quality: 1.0, 
                                pixelRatio: 2,
                                skipFonts: true,
                                skipOnError: true // Ignore failed images (CORS)
                            });
                            window.parent.postMessage({ type: 'DOWNLOAD_READY', format, dataUrl, fileName }, '*');
                        }
                    } catch (err) {
                        console.error("Generation failed inside iframe", err);
                        window.parent.postMessage({ type: 'DOWNLOAD_ERROR', error: err.toString() }, '*');
                    }
                }
            });
        `;
        doc.body.appendChild(script);

        // Inject html-to-image from CDN
        const htiScript = doc.createElement('script');
        htiScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/html-to-image/1.11.11/html-to-image.min.js';
        htiScript.onload = () => console.log("html-to-image loaded in iframe");
        doc.head.appendChild(htiScript);

    }, [compiledHtml]);

    // Listen for messages from iframe
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data.type === 'HTML_UPDATE') {
                // cache the value we are about to send up
                lastEmittedHtml.current = event.data.html;
                onHtmlChange(event.data.html);
            }
        };
        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [onHtmlChange]);

    // Scaling logic
    const containerRef = useRef<HTMLDivElement>(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const calculateScale = () => {
            if (!containerRef.current) return;
            const containerWidth = containerRef.current.clientWidth;
            const containerHeight = containerRef.current.clientHeight;

            // Add padding (48px = 24px each side/top/bottom) to create "canvas" feel
            const paddingX = 48;
            const paddingY = 48;

            const availableWidth = containerWidth - paddingX;
            // We mainly care about width fit, but check height if it's very tall? 
            // Standard behavior is usually "Fit Width" for doc editors.

            const scaleX = availableWidth / width;

            // Limit max scale to avoid pixelation, allowing zoom up to 120% if space permits
            const newScale = Math.min(scaleX, 1.2);
            setScale(newScale);
        };

        const observer = new ResizeObserver(calculateScale);
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        calculateScale();
        window.addEventListener('resize', calculateScale); // Fallback

        return () => {
            observer.disconnect();
            window.removeEventListener('resize', calculateScale);
        };
    }, [width, height]);

    return (
        <div ref={containerRef} className="w-full h-full bg-slate-200/50 flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden pt-8 pb-12">
            <div
                className="bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] ring-1 ring-slate-900/5 origin-top transition-transform duration-200 ease-out shrink-0"
                style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    transform: `scale(${scale})`,
                    // The scaled element occupies scale * height visual space. 
                    // We need to adjust margin bottom to reduce whitespace if scale < 1, 
                    // or ensure scroll space if scale > 1 (though we capped at 1.2).
                    // Actually, with Flex column and shrink-0, we just need to set the marginBottom relative to the scaled size difference.
                    marginBottom: `${(height * scale) - height}px`,
                    // We might need a small top margin to ensure it's not sticking to top if zoomed in?
                    // The parent pt-8 handles the top spec.
                }}
            >
                <iframe
                    ref={iframeRef}
                    id="template-preview-iframe"
                    className="w-full h-full block"
                    title="Template Preview"
                    sandbox="allow-scripts allow-same-origin"
                />
            </div>
        </div>
    );
}
