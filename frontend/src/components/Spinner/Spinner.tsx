export default function Spinner() {
    return <span className="loading-screen" role="status" aria-label="Carregando conteúdo"><img className="loading-symbol" src="/logos/loading-logo.webp" alt="" aria-hidden="true" /><span className="sr-only">Carregando conteúdo...</span></span>;
}
