import { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import type { News } from "../interfaces/News";
import type { Image } from "../interfaces/Image";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import DOMPurify from 'dompurify';
import Footer from "../components/Footer/Footer";
import { formatarDataHora } from "../tools/Tools";
import Spinner from "../components/Spinner/Spinner";

async function getArticle(slug: string): Promise<News> {
    try {
        const {data} = await api.get("news/" + slug + "/");
        return data;
    } catch (error: any) {
        console.error("Erro ao buscar a notícia: ", error)

        if (error.code === "ECONNABORTED") {
            throw new Error("Problemas de conexão. Tente novamente mais tarde.")
        } else if (error.response) {
            throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
        } else {
            throw new Error("Erro inesperado ao carregar as notícias.");
        }
    }
}

export default function Article() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState<News | null>(null);
    const [image, setImage] = useState<Image | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            if (!slug) {
                navigate("/");
                return;
            }

            
            try {
                setLoading(true);
                const art = await getArticle(slug);
                setArticle(art);
                setImage(art.image);
            } catch (error) {
                console.error("Erro ao carregar artigo:", error);
                setArticle(null);
            } finally {
                setLoading(false);
            }
        })();
    }, [slug, navigate]);

    // Verifica se o artigo é null após o carregamento
    useEffect(() => {
        if (!loading && article === null) {
            navigate("/");
        }
    }, [article, loading, navigate]);

    // Estado de carregamento mais claro
    if (loading) {
        return <Spinner />;
    }

    // Se chegou aqui e article é null, o useEffect acima vai redirecionar
    if (article === null) {
        return null;
    }

    return (
        <>
            <Header />
            <main id="main" className="portal-container article">
                {article.school?.name && <p className="eyebrow">{article.school.name}</p>}
                <h1>{article.title}</h1>
                <p className="byline"><span>Por {article.author_name} {article.author?.surname}</span><span>{formatarDataHora(article.updated_at)}</span></p>
                {image?.file && <figure><img src={image.file} alt={image.alt || ""} className="cover-preview" /><figcaption>{image.alt}</figcaption></figure>}
                <div className="article-body" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.body) }} />
            </main>
            <Footer />
        </>
    );
}
