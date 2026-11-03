import Footer from "../../components/Footer/Footer";
import Modal from "../../components/Modal/Modal";
import { FiImage, FiChevronRight } from "react-icons/fi";
import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import type { News } from "../../interfaces/News"; 
import RichTextEditor from "../../components/Quill/Quill";
import { ACCESS_TOKEN, NAME, SURNAME } from "../../constants/Token";
import api from "../../services/api";
import { formatarDataHora, slug } from "../../tools/Tools";
import axios from "axios";
import { useSchools } from "../../hooks/useRegions/useSchools";
import { HOST } from "../../constants/Host";

// --- Funções da API (com correção) ---

const headers = () => ({
    "Authorization": `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
})

type UploadResult = { id: number } | { error: string }

async function upload(payload: FormData): Promise<UploadResult> {
    try {
        const res = await api.post("upload/", payload, {
            headers: headers()
        });
        return { id: res.data.id };
    } catch (err: any) {
        return { error: err.response?.data?.error || "Upload failed"};
    }
}

type PublishResult = { error?: string; data?: any };

async function publishNews (payload: any): Promise<PublishResult> {
    
    if (!payload.image || typeof payload.image !== "number" || payload.image < 0) {
        return { error: "Imagem de capa inválida ou ausente." };
    }

    try {
        const res = await api.post("news/", payload, {
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

// --- Tratamento de Erro (sem mudanças) ---

function getFriendlyError(error: unknown): string {
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
        return error;
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

export default function Publish() {
    const { schools, loading: schoolsLoading, fetchSchools } = useSchools(); 
    
    const [uploadError, setUploadError] = useState("");
    const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());
    const [isLoading, setIsLoading] = useState(false);

    const [imageUpload, setImageUpload] = useState<{ file: File | null, alt: string }>({
        file: null,
        alt: ""
    });
    const [previewUrl, setPreviewUrl] = useState<string>("");

    const [formData, setFormData] = useState<Partial<News>>({
        title: "",
        body: "",
        school: undefined,
        author_name: "",
        status: "Rascunho",
        scheduleTo: null,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60 * 1000);

        fetchSchools();

        return () => {
            clearInterval(timer);
        }
    }, []);

    // --- LÓGICA DE SUBMISSÃO REFEITA ---

    const handleUploadImage = async (): Promise<{ id?: number; error?: string }> => {
        if (!(imageUpload.file && imageUpload.alt)) {
             return { error: "A imagem de capa e o subtítulo são obrigatórios." };
        }

        const uploadData = new FormData();
        uploadData.append("file", imageUpload.file);
        uploadData.append("alt", imageUpload.alt);

        const result = await upload(uploadData);

        if ("error" in result) {
            console.error("Erro ao subir a capa: ", result.error)
            const message = getFriendlyError(result.error || "");
            return { error: message }
        } else {
            return { id: result.id };
        }
    }


    const handleSubmit = async () => {
        setIsLoading(true);
        setUploadError("");

        try {
            if (!formData.title || !formData.body || !imageUpload.file || !imageUpload.alt) {
                throw new Error("Preencha todos os campos obrigatórios: Título, Corpo, Imagem de Capa e Subtítulo.");
            }
        
            const coverResult = await handleUploadImage();
            if (coverResult.error) {
                throw new Error(coverResult.error);
            }

            const imageId = coverResult.id || -1;
            const identifier = slug(formData.title);

            const updatedPayload = {
                ...formData,
                image: imageId,
                school: formData.school,
                author_name: `${localStorage.getItem(NAME)} ${localStorage.getItem(SURNAME)}` || "",
                slug: identifier,
                link: `${HOST}radar/${identifier}`,
                status: 'Publicado',
            };
            
            const res = await publishNews(updatedPayload);

            if (res.error) throw res.error;

            if (previewUrl) URL.revokeObjectURL(previewUrl);
            window.location.href = updatedPayload.link;
        } catch (err) {
            const friendly = getFriendlyError(err);
            setUploadError(friendly);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <>
            {uploadError && <ErrorModal message={uploadError} onClose={() => setUploadError("")} />}
            <Header />
            <main id="main" className="portal-container editor">
                <div className="page-heading"><p className="eyebrow">Área da equipe</p><h1>Nova matéria</h1><p>Prepare o conteúdo para publicar no portal.</p></div>
                <div className="editor-layout">
                    <div className="editor-main">
                        <div className="form-field"><label htmlFor="titulo">Título da notícia <span className="required">*</span></label><textarea id="titulo" rows={3} value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Escreva o título da notícia" required /></div>
                        <p className="editor-date">{formatarDataHora(currentDateTime)}</p>
                        <div className="form-field"><label id="body-label">Corpo da notícia <span className="required">*</span></label><div aria-labelledby="body-label"><RichTextEditor value={formData.body || ""} onChange={value => setFormData({ ...formData, body: value })} placeholder="Escreva a notícia aqui..." /></div></div>
                    </div>
                    <aside className="editor-side" aria-label="Propriedades da matéria">
                        <div className="form-field"><label htmlFor="school">Selecione uma escola <span className="optional">(opcional)</span></label>
                            <select id="school" value={formData.school || ""} onChange={e => setFormData({ ...formData, school: parseInt(e.target.value) || undefined })} disabled={schoolsLoading}><option value="">{schoolsLoading ? "Carregando..." : "Nenhuma"}</option>{schools.filter(school => school.group === 1 || school.group === 2).map(school => <option key={school.id} value={school.id}>{school.name}</option>)}</select>
                        </div>
                        <div className="form-field"><label htmlFor="file">Imagem de capa <span className="required">*</span></label>
                            <div className="cover-slot">{previewUrl ? <img className="cover-preview" src={previewUrl} alt={imageUpload.alt || "Prévia da capa"} /> : <div className="upload-placeholder"><span className="icon-box"><FiImage aria-hidden="true" /></span><span>Adicione uma foto de capa</span></div>}</div>
                            <input id="file" name="file" className="file-input" type="file" accept="image/*" onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    if (previewUrl) URL.revokeObjectURL(previewUrl);
                                    setPreviewUrl(URL.createObjectURL(file));
                                    setImageUpload({ ...imageUpload, file });
                            }} />
                        </div>
                        <div className="form-field"><label htmlFor="alt">Subtítulo da capa <span className="required">*</span></label><textarea id="alt" name="alt" rows={3} value={imageUpload.alt || ""} onChange={e => { setImageUpload({ ...imageUpload, alt: e.target.value }); }} required /></div>
                    </aside>
                </div>
                <div className="editor-submit"><p>Campos com <span className="required">*</span> são obrigatórios.</p><button type="button" onClick={handleSubmit} className="button primary" disabled={isLoading}><span className="icon-box"><FiChevronRight aria-hidden="true" /></span>{isLoading ? "Publicando..." : "Publicar"}</button></div>
            </main>
            <Footer />
        </>
    );
}
