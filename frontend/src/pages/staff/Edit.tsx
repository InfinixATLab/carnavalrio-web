import Footer from "../../components/Footer/Footer";
import Modal from "../../components/Modal/Modal";
import { FiImage, FiCheck } from "react-icons/fi";
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import type { News } from "../../interfaces/News";
import RichTextEditor from "../../components/Quill/Quill";
import { ACCESS_TOKEN, NAME, SURNAME } from "../../constants/Token";
import api from "../../services/api";
import { formatarDataHora, slug } from "../../tools/Tools";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom"; // Importe useNavigate
import Spinner from "../../components/Spinner/Spinner";
import { HOST } from "../../constants/Host";
import { useSchools } from "../../hooks/useRegions/useSchools";
import type { Image } from "../../interfaces/Image";

const headers = () => ({
    "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
})

type UploadResult = { id: number } | { error: string }
type EditResult = { error?: string; data?: any };

async function upload(payload: any, pk?: any): Promise<UploadResult> {
    try {
        const endpoint = pk ? `upload/${pk}/` : 'upload/';
        
        const res = pk 
            ? await api.patch(endpoint, payload, { headers: headers() })
            : await api.post(endpoint, payload, { headers: headers() });

        return { id: res.data.id };
    } catch (err: any) {
        return { error: err.response?.data?.error || "Upload failed"};
    }
}

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

// EditArticle agora recebe um payload que pode ter 'image' como ID
// Para evitar problemas de tipo, podemos ser mais flexíveis ou ajustar o payload
async function editArticle (payload: any, slug: string): Promise<EditResult> {
    
    // A checagem do ID agora será feita no handleSubmit antes de criar o payload
    
    try {
        const res = await api.patch(`news/${slug}/`, payload, {
            headers: headers(),
            validateStatus: () => true,
        });

        if (res.status >= 200 && res.status < 300) return { data: res.data };

        const errorData = res.data;
        return { error: errorData?.detail || errorData || "Erro ao publicar." };
    } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
            return err.response.data || "Erro ao publicar.";
        }
        return { error: "Erro de conexão com o servidor. Tente novamente mais tarde." };
    }
}

// --- Funções de Erro (sem mudanças) ---
function getFriendlyError(error: unknown): string {
    // ... (seu código getFriendlyError aqui, sem mudanças)
    console.error(error)
    if (typeof error === "string") {
        if (error.includes("value too long")) {
            return "Nome ou subtítulo da imagem muito longo.";
        }
        if (error.includes("cannot identify image file")) {
            return "Formato de imagem inválido. Use JPG, JPEG, PNG ou WEBP.";
        }
        if (error.includes("token")) {
            return "Sua sessão expirou. Faça login novamente.";
        }
        return error; // Retorna o erro de string diretamente
    }

    if (typeof error === "object" && error !== null) {
        if ("code" in error && error.code === "token_not_valid") {
            return "Sessão expirada. Faça login novamente.";
        }
        if ("title" in error && Array.isArray(error.title)) {
            const msg = error.title.join(" ");
            if (msg.includes("blank")) return "Preencha o título."; 
            return "Título muito longo. Máximo de 255 caracteres.";
        }
        if ("body" in error && Array.isArray(error.body)) {
            const msg = error.body.join(" ");
            if (msg.includes("blank")) return "Preencha o corpo da notícia."; 
            return "Preencha o corpo da notícia.";
        }
        if ("image" in error) {
            return "Defina uma imagem de capa e um subtítulo!";
        }
        if ("detail" in error && typeof error.detail === "string") {
            return error.detail;
        }
        return "Erro de validação nos campos.";
    }

    return "Erro inesperado.";
}

// --- Componente Modal (Movido para fora) ---
type ErrorModalProps = {
    message: string;
    onClose?: () => void;
};

const ErrorModal = ({ message, onClose }: ErrorModalProps) => (
    <Modal isOpen onClose={() => onClose?.()} modalTitle="Não foi possível concluir">
        <p className="feedback" role="alert">{message}</p><div className="dialog-actions"><button type="button" className="button outline" onClick={onClose}>Fechar</button></div>
    </Modal>
);

// --- Componente Principal Refatorado ---

export default function Edit() {
    const { schools, loading: schoolsLoading, fetchSchools } = useSchools();
    const { slug: slugURL } = useParams();
    const navigate = useNavigate(); // Hook de navegação
    
    const [uploadError, setUploadError] = useState("");
    const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(true);
    const [imageChanged, setImageChanged] = useState(false);
    
    // Estado 'cover' agora é a fonte da verdade para a imagem sendo editada
    const [cover, setCover] = useState<Image | null>(null);
    
    // formData começa vazio e será preenchido pelo getArticle
    const [formData, setFormData] = useState<News | null>(null); // Começa como nulo

    // Busca escolas ao montar
    useEffect(() => {
        fetchSchools();
    }, []);

    // Busca o artigo ao montar ou quando o slug mudar
    useEffect(() => {
        const retrieveArticle = async () => {
            if (!slugURL) {
                console.error("Slug da URL não encontrado");
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const art = await getArticle(slugURL);
                
                if (!art || !art.title) {
                    console.error("Dados do artigo inválidos:", art);
                    return;
                }
                
                setFormData(art);
                // Define o estado 'cover' com os dados da imagem do artigo
                setCover(art.image); 
                
                setImageChanged(false); // Reseta o flag
                
            } catch (error) {
                console.error("Erro ao carregar artigo:", error);
                setUploadError(getFriendlyError(error));
            } finally {
                setIsLoading(false);
            }
        }

        retrieveArticle();
    }, [slugURL]);

    // Timer para o relógio (sem mudanças)
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60 * 1000);

        return () => {
            clearInterval(timer);
        }
    }, [])

    // --- LÓGICA DE SUBMISSÃO REFEITA ---
    const handleSubmit = async () => {
        if (!formData) return; // Não faz nada se os dados não carregaram

        setIsLoading(true);
        setUploadError("");

        try {
            let imageIdToSubmit = formData.image.id; // ID da imagem original

            // 1. Verifica se a imagem mudou (novo arquivo OU novo alt)
            if (imageChanged) {
                
                // Caso 1: Um NOVO ARQUIVO foi selecionado
                if (cover.file instanceof File) {
                    const imagePayload = new FormData();
                    imagePayload.append('file', cover.file);
                    if (cover.alt) {
                        imagePayload.append('alt', cover.alt);
                    }
                    
                    // Cria um *novo* MediaFile
                    const uploadResult = await upload(imagePayload); 
                    
                    if ("error" in uploadResult) {
                        throw new Error(uploadResult.error); // Joga o erro para o catch
                    }
                    imageIdToSubmit = uploadResult.id; // Usa o ID da nova imagem
                
                // Caso 2: SOMENTE o texto 'alt' mudou
                } else if (cover.alt !== formData.image.alt) { 
                    const altPayload = { alt: cover.alt || "" };
                    
                    // Atualiza (PATCH) o MediaFile *existente*
                    const uploadResult = await upload(altPayload, formData.image.id);
                    
                    if ("error" in uploadResult) {
                        throw new Error(uploadResult.error);
                    }
                    // O ID da imagem continua o mesmo (imageIdToSubmit)
                }
            }

            // 2. Prepara o payload final para o artigo
            const identifier = slug(formData.title);
            const finalPayload = {
                ...formData,
                title: formData.title,
                body: formData.body,
                school: formData.school,
                image: imageIdToSubmit, // Envia APENAS O ID
                author_name: `${localStorage.getItem(NAME)} ${localStorage.getItem(SURNAME)}` || "",
                slug: identifier,
                link: `${HOST}${identifier}`,
                status: 'Publicado',
            };

            // 3. Salva o artigo
            const res = await editArticle(finalPayload, slugURL || "");

            if (res.error) {
                throw res.error; // Joga o erro para o catch
            }

            // 4. Sucesso! Navega para o artigo
            navigate(finalPayload.link);

        } catch (err) {
            console.error("Erro no handleSubmit:", err);
            const friendly = getFriendlyError(err);
            setUploadError(friendly);
        } finally {
            setIsLoading(false); // Sempre para de carregar
        }
    }

    // Mostrar loading enquanto carrega os dados
    // Adicionado cheque para formData
    if (isLoading || schoolsLoading || !formData) {
        return (
            <div>
                <Header />
                <div className="flex flex-col justify-center items-center m-auto">
                    <p className="pt-20">Carregando artigo...</p>
                    <p className="pt-4"><Spinner /></p>
                </div>
            </div>
        );
    }

    // O JSX principal
    return (
        <>
            {uploadError && <ErrorModal message={uploadError} onClose={() => setUploadError("")} />}
            <Header />
            <main id="main" className="portal-container editor">
                <div className="page-heading"><p className="eyebrow">Área da equipe</p><h1>Editar matéria</h1><p>Atualize o conteúdo da notícia.</p></div>
                <div className="editor-layout">
                    <div className="editor-main">
                        <div className="form-field"><label htmlFor="titulo">Título da notícia <span className="required">*</span></label><textarea id="titulo" rows={3} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Escreva o título da notícia" required /></div>
                        <p className="editor-date">{formatarDataHora(currentDateTime)}</p>
                        <div className="form-field"><label id="body-label">Corpo da notícia <span className="required">*</span></label><div aria-labelledby="body-label"><RichTextEditor value={formData.body} onChange={value => setFormData({ ...formData, body: value })} placeholder="Escreva a notícia aqui..." /></div></div>
                    </div>
                    <aside className="editor-side" aria-label="Propriedades da matéria">
                        <div className="form-field"><label htmlFor="school">Selecione uma escola <span className="optional">(opcional)</span></label>
                            <select id="school" value={formData.school || ""} onChange={e => setFormData({ ...formData, school: parseInt(e.target.value) || undefined })} disabled={schoolsLoading}><option value="">{schoolsLoading ? "Carregando..." : "Nenhuma"}</option>{schools.filter(school => school.group === 1 || school.group === 2).map(school => <option key={school.id} value={school.id}>{school.name}</option>)}</select>
                        </div>
                        <div className="form-field"><label htmlFor="file">Imagem de capa <span className="required">*</span></label>
                            <div className="cover-slot">{cover.file_url ? <img className="cover-preview" src={cover.file_url} alt={cover.alt || "Prévia da capa"} /> : <div className="upload-placeholder"><span className="icon-box"><FiImage aria-hidden="true" /></span><span>Adicione uma foto de capa</span></div>}</div>
                            <input id="file" name="file" className="file-input" type="file" accept="image/*" onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    if (cover.file_url && cover.file_url.startsWith("blob:")) URL.revokeObjectURL(cover.file_url);
                                    setCover({ ...cover, file, file_url: URL.createObjectURL(file) });
                                    setImageChanged(true);
                            }} />
                        </div>
                        <div className="form-field"><label htmlFor="alt">Subtítulo da capa <span className="required">*</span></label><textarea id="alt" name="alt" rows={3} value={cover.alt || ""} onChange={e => { setCover({ ...cover, alt: e.target.value }); setImageChanged(true); }} required /></div>
                    </aside>
                </div>
                <div className="editor-submit"><p>Campos com <span className="required">*</span> são obrigatórios.</p><button type="button" onClick={handleSubmit} className="button primary" disabled={isLoading}><span className="icon-box"><FiCheck aria-hidden="true" /></span>{isLoading ? "Salvando..." : "Salvar"}</button></div>
            </main>
            <Footer />
        </>
    );
}
