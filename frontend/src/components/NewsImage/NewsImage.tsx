import { useEffect, useRef, useState } from "react";

type Props = {
    src: string;
    alt: string;
    loading?: "eager" | "lazy";
    className?: string;
};

function ImageContent({ src, alt, loading, className = "" }: Props) {
    const imageRef = useRef<HTMLImageElement>(null);
    const [phase, setPhase] = useState<"loading" | "static" | "decoded" | "ready" | "error">(
        () => typeof HTMLImageElement !== "undefined" && typeof HTMLImageElement.prototype.decode === "function" ? "loading" : "static"
    );
    const [ratio, setRatio] = useState("3 / 2");

    useEffect(() => {
        const image = imageRef.current;
        if (!image) return;
        let active = true;
        let decoding = false;
        const fail = () => { if (active) setPhase("error"); };
        const reveal = async () => {
            if (decoding) return;
            decoding = true;
            try {
                if (typeof image.decode === "function") await image.decode();
                if (!active) return;
                if (!image.naturalWidth || !image.naturalHeight) { fail(); return; }
                setRatio(`${image.naturalWidth} / ${image.naturalHeight}`);
                setPhase(typeof image.decode === "function" ? "decoded" : "ready");
            } catch { fail(); }
        };
        image.addEventListener("load", reveal);
        image.addEventListener("error", fail);
        if (image.complete) {
            if (image.naturalWidth) void reveal();
            else fail();
        }
        return () => {
            active = false;
            image.removeEventListener("load", reveal);
            image.removeEventListener("error", fail);
        };
    }, []);

    useEffect(() => {
        if (phase !== "decoded") return;
        let secondFrame = 0;
        // Keep the underlay through a rendering opportunity after revealing the decoded image.
        const firstFrame = requestAnimationFrame(() => {
            secondFrame = requestAnimationFrame(() => setPhase("ready"));
        });
        return () => { cancelAnimationFrame(firstFrame); cancelAnimationFrame(secondFrame); };
    }, [phase]);

    return (
        <span className={`news-image ${className}`} data-state={phase} style={{ aspectRatio: ratio }} role={phase === "error" ? "img" : undefined} aria-label={phase === "error" ? alt || "Imagem indisponível" : undefined}>
            {(phase === "loading" || phase === "decoded") && <span className="image-shimmer" aria-hidden="true" />}
            <img ref={imageRef} src={src} alt={alt} loading={loading} decoding="async" />
        </span>
    );
}

export default function NewsImage(props: Props) {
    return <ImageContent key={props.src} {...props} />;
}
