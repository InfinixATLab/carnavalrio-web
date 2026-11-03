export default function Spinner({ inline = false }: { inline?: boolean }) {
    return <span className={inline ? "loading-inline" : "loading-screen"} role="status" aria-label="Carregando conteúdo"><img className="loading-symbol" src="/logos/loading.svg" alt="" aria-hidden="true" /><span className="sr-only">Carregando conteúdo...</span></span>;
}
