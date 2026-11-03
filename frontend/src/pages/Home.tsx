import NewsImage from "../components/NewsImage/NewsImage";
import Spinner from "../components/Spinner/Spinner";
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";

import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { formatarDataHora, getSchoolName } from "../tools/Tools";
import type { News } from "../interfaces/News";
import { useSchools } from "../hooks/useRegions/useSchools";

const GET_NEWS_AND_COUNT = gql`
    query GetNewsAndCount($school: String, $limit: Int, $offset: Int, $status: String, $title: String) {
        newsAndCount(school: $school, limit: $limit, offset: $offset, status: $status, title: $title) {
            totalCount
            news {
                id
                title
                slug
                status
                link
                school
                authorName
                author {
                    id
                    name
                    surname
                    email
                }
                createdAt
                updatedAt
                image {
                    id
                    alt
                    url
                }
            }
        }
    }
`;

const useDebounce = (value: string, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

export default function Home() {
    const [searchParams] = useSearchParams();

    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const {schools, loading: schoolsLoading, fetchSchools} = useSchools();

    const ITEMS_PER_PAGE = 11;

    const { loading, error, data } = useQuery(GET_NEWS_AND_COUNT, {
        variables: {
            school: searchParams.get("school"),
            limit: ITEMS_PER_PAGE,
            offset: (currentPage - 1) * ITEMS_PER_PAGE,
            status: "Publicado",
            title: debouncedSearchTerm,
        },
        fetchPolicy: "network-only"
    });

    useEffect(() => {
        if (debouncedSearchTerm !== "") setCurrentPage(1);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        (async() => {
            await fetchSchools();
        })();
    }, []);

    const { highlight, mainList, remnantList } = useMemo(() => {
        const newsList = data?.newsAndCount?.news; // Property 'newsAndCount' does not exist on type '{}'.
        
        if (!newsList || newsList.length === 0) return { highlight: null, mainList: [], remnantList: [] };

        const newsEnhanced = newsList.map((n: News) => ({
            ...n,
            school: getSchoolName(n.school, schools)
        }))

        return {
            highlight: newsEnhanced[0],
            mainList: newsEnhanced.slice(1, 5),
            remnantList: newsEnhanced.slice(5, 11),
        }
    }, [data, schools]);

    const totalCount = data?.newsAndCount?.totalCount ?? 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }

    return (
        <>
            <Header />
            <main id="main" className="portal-container home">
                <div className="home-intro od-row">
                    <div><p className="eyebrow">Carnavalrio</p><h1>No radar do carnaval</h1></div>
                    <div className="search-box od-row">
                        <span className="icon-box"><FiSearch aria-hidden="true" /></span>
                        <label className="sr-only" htmlFor="news-search">Buscar notícias pelo título</label>
                        <input id="news-search" type="search" placeholder="Buscar sua notícia..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                    </div>
                </div>
                {loading && !data ? (
                    <div className="loading-content" role="status"><p className="loading-label"><Spinner />Carregando notícias...</p><div className="skeleton skeleton-hero" /><div className="skeleton-lines" aria-hidden="true"><div className="skeleton" /><div className="skeleton" /></div></div>
                ) : error ? (
                    <div className="empty-state" role="alert"><h2>Não foi possível carregar as notícias.</h2><p>Tente novamente mais tarde.</p></div>
                ) : !highlight ? (
                    <div className="empty-state"><span className="state-icon"><FiSearch aria-hidden="true" /></span><h2>{searchTerm ? "Nenhuma notícia encontrada" : "Nenhuma notícia publicada"}</h2><p>{searchTerm ? "Tente buscar por outro título." : "As próximas notícias aparecerão aqui."}</p></div>
                ) : (
                    <div aria-busy={loading}>
                        {loading && <p className="loading-label" role="status"><Spinner />Atualizando notícias...</p>}
                        <Link to={`/${highlight.slug}`} className="news-card lead">
                            {highlight.image?.url && <NewsImage src={highlight.image.url} alt={highlight.image.alt || ""} />}
                            <div className="card-copy">
                                {highlight.school && <p className="eyebrow">{highlight.school}</p>}
                                <h2>{highlight.title}</h2>
                                <p className="byline"><span>Por {highlight.authorName}</span><span>{formatarDataHora(highlight.updatedAt)}</span></p>
                                <span className="read-story">Ler matéria<span className="icon-box"><FiChevronRight aria-hidden="true" /></span></span>
                            </div>
                        </Link>
                        <div className="compact-grid">
                            {mainList.map(item => (
                                <Link key={item.id} to={`/${item.slug}`} className="news-card compact">
                                    {item.image?.url && <NewsImage src={item.image.url} alt={item.image.alt || ""} loading="lazy" />}
                                    <div className="card-copy">{item.school && <p className="eyebrow">{item.school}</p>}<h2>{item.title}</h2></div>
                                </Link>
                            ))}
                        </div>
                        {remnantList.length > 0 && <><div className="section-label"><h2>Mais notícias</h2><span aria-hidden="true" /></div>
                            <div className="news-grid">{remnantList.map(item => (
                                <Link key={item.id} to={`/${item.slug}`} className="news-card tile">
                                    {item.image?.url && <NewsImage src={item.image.url} alt={item.image.alt || ""} loading="lazy" />}
                                    <div className="card-copy">{item.school && <p className="eyebrow">{item.school}</p>}<h2>{item.title}</h2></div>
                                </Link>
                            ))}</div></>}
                        {totalPages > 1 && <nav className="pagination" aria-label="Paginação de notícias">
                            <button type="button" className="icon-button" aria-label="Página anterior" onClick={handlePrevPage} disabled={currentPage === 1 || loading}><FiChevronLeft aria-hidden="true" /></button>
                            <p aria-live="polite"><strong>{currentPage}</strong> de {totalPages}</p>
                            <button type="button" className="icon-button" aria-label="Próxima página" onClick={handleNextPage} disabled={currentPage >= totalPages || loading}><FiChevronRight aria-hidden="true" /></button>
                        </nav>}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
