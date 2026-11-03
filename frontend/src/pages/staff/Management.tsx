import { Link, useNavigate } from "react-router-dom";
import type { News } from "../../interfaces/News";
import api from "../../services/api";
import { useEffect, useState } from "react";
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from "react-icons/fi";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PortalModal from "../../components/Modal/Modal";

type ModalProps = {
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
};

async function fetchNews(): Promise<News[]> {
    try {
        const {data} = await api.get("news/");
        
        return data.results;
    } catch (error: any) {
        console.error("Erro ao buscar notícias: ", error)

        if (error.code === "ECONNABORTED") {
            throw new Error("Problemas de conexão. Tente novamente mais tarde.")
        } else if (error.response) {
            throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
        } else {
            throw new Error("Erro inesperado ao carregar as notícias.");
        }
    }
}

async function deleteArticle(slug: string): Promise<{ error: any } | { response: string}> {
    try {
        await api.delete(`news/${slug}/`)
    
        return { response: "Artigo deletado com sucesso." };
    } catch (err: any) {
        return { error: err };
    }
}


export default function Management() {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [news, setNews] = useState<News[]>([]);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);
    const navigate = useNavigate();
    const Modal = ({ message, onConfirm, onCancel }: ModalProps) => (
        <PortalModal isOpen onClose={() => onCancel?.()} modalTitle="Deletar matéria?">
            <p>{message}</p>
            <div className="dialog-actions"><button type="button" className="button outline" onClick={onCancel}>Fechar</button><button type="button" className="button danger" onClick={onConfirm}>Deletar matéria</button></div>
        </PortalModal>
    );

    useEffect(() => {
        (async () => {
            try {
                await fetchNews().then(setNews);
            } catch (error) {
                setNews([]);
            }
        })();
    }, [])

    const remove = async (slug: string) => {
        try {
            await deleteArticle(slug);
            setNews(prev => prev?.filter(article => article.slug !== slug));
        } catch (error: any) {
            console.error(error);
        } finally {
            setArticleToDelete(null);
        }
    }
    
    return (
        <>
            <Header />
            <main id="main" className="portal-container management">
                {articleToDelete && <Modal message="Ao continuar, esta matéria será deletada." onConfirm={() => remove(articleToDelete)} onCancel={() => setArticleToDelete("")} />}
                <div className="page-heading management-heading od-row">
                    <div><p className="eyebrow">Área da equipe</p><h1>Gerenciamento de notícias</h1><p>Organize e edite as matérias do portal.</p></div>
                    <div className="staff-actions"><Link to="/me" className="button outline">Minha conta</Link><Link to="/logout" className="button outline">Sair</Link><button type="button" onClick={() => navigate("publish/")} className="button primary"><span className="icon-box"><FiPlus aria-hidden="true" /></span>Nova matéria</button></div>
                </div>
                <div className="search-box od-row"><span className="icon-box"><FiSearch aria-hidden="true" /></span><label className="sr-only" htmlFor="admin-search">Buscar matérias pelo título</label><input id="admin-search" type="search" placeholder="Buscar sua notícia..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} /></div>
                <div className="admin-table">
                    <div className="table-header"><span>Matéria</span><span>Ações</span></div>
                    {Array.isArray(news) && news.map(article => (
                        <article key={article.id ?? article.slug} className="admin-row">
                            <div className="admin-news od-row">{article.image?.file && <img src={article.image.file} alt={article.image.alt || ""} loading="lazy" />}<h2>{article.title}</h2></div>
                            <div className="row-actions od-row"><button type="button" className="icon-button" aria-label={`Editar: ${article.title}`} onClick={() => navigate(`edit/${article.slug}`)}><FiEdit2 aria-hidden="true" /></button><button type="button" className="icon-button danger-icon" aria-label={`Deletar: ${article.title}`} onClick={() => setArticleToDelete(article.slug)}><FiTrash2 aria-hidden="true" /></button></div>
                        </article>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}
