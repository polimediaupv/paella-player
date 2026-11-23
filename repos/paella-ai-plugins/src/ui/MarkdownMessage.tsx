import { useEffect, useState } from 'preact/hooks';

interface MarkdownRendererModule {
    Markdown: any;
    remarkGfm: any;
}

let rendererPromise: Promise<MarkdownRendererModule> | null = null;

function loadMarkdownRenderer(): Promise<MarkdownRendererModule> {
    if (rendererPromise === null) {
        // react-markdown and remark-gfm are heavy and only needed to render
        // AI responses, so they are loaded on demand to keep them out of the
        // initial bundle. The module promise is cached between instances.
        rendererPromise = Promise.all([
            import('react-markdown'),
            import('remark-gfm'),
        ]).then(([markdown, gfm]) => ({
            Markdown: markdown.default,
            remarkGfm: gfm.default,
        }));
    }
    return rendererPromise;
}


interface MarkdownMessageProps {
    text: string;
}

export function MarkdownMessage({ text }: MarkdownMessageProps) {
    const [renderer, setRenderer] = useState<MarkdownRendererModule | null>(null);

    useEffect(() => {
        let mounted = true;
        loadMarkdownRenderer().then((mod) => {
            if (mounted) {
                setRenderer(mod);
            }
        });
        return () => { mounted = false; };
    }, []);

    if (renderer === null) {
        // Fallback: show the raw text while the renderer chunk is loading.
        return <div className="markdown-view">{text}</div>;
    }

    const { Markdown, remarkGfm } = renderer;
    return (
        <Markdown remarkPlugins={[remarkGfm]}>
            {text}
        </Markdown>
    );
}
