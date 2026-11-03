import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { FaUser } from "react-icons/fa";
import { ImExit } from "react-icons/im";
import { MdEmail, MdPassword } from "react-icons/md";
import { BiSolidUser } from 'react-icons/bi';
import { IoIosArrowForward } from "react-icons/io";
import { ACCESS_TOKEN, EMAIL, NAME } from "../constants/Token";
import React, { useState } from "react";
import Modal from "../components/Modal/Modal";
import { Link } from "react-router-dom";
import type { User } from "../interfaces/User";
import api from "../services/api";

const headers = () => ({
    'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
})

async function fetchUser(): Promise<string> {
    const res = await api.get("users/me/", { headers: headers() });
    return res.data.id;
}

async function updateField(payload: {}, user_id: string, password: boolean): Promise<User> {
    const url = password ? `users/${user_id}/change-password/` : `users/${user_id}/`

    try{
        const res = await api.patch(url, payload, {
            headers: headers()
        })

        return res.data;
    }catch(error: any){
        console.error("Erro ao atualizar usuário: ", error)

        if (error.code === "ECONNABORTED") {
            throw new Error("Problemas de conexão. Tente novamente mais tarde.")
        } else if (error.response) {
            throw new Error(`Erro ${error.response.status}: ${error.response.statusText}`);
        } else {
            throw new Error("Erro inesperado ao carregar as notícias.");
        }
    }
}

type FieldType = "name" | "email" | "password";

const FIELD_LABELS: Record<FieldType, string> = {
    name: 'Nome',
    email: 'Email',
    password: 'Senha',
}

export default function MyAccount() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [fieldType, setFieldType] = useState<FieldType | null>(null);
    const [userId, setUserId] = useState<string>("");
    const [formValues, setFormValues] = useState<Record<FieldType, string>>({
        name: "",
        password: "",
        email: "",
    })

    const openModal = (type: FieldType) => {
        setFieldType(type);
        setIsModalOpen(true);
    }
    
    const closeModal = () => {
        setIsModalOpen(false);
        setFieldType(null);
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {value} = e.target;
        if (fieldType) {
            setFormValues((prev) => ({
                ...prev,
                [fieldType]: value,
            }));
        }
    }

    const getUser = async () => {
        const data = await fetchUser()
        setUserId(data);
    }

    const handleSubmit = async () => {
        getUser();

        if (!fieldType) return;
        
        const value = formValues[fieldType].trim();
        if (!value) return;

        const payload = { [fieldType]: value };

        await updateField(payload, userId, fieldType === "password");

        if (fieldType === "name") localStorage.setItem(NAME, value);

        setUserId("");
        closeModal();
    }

    const userName = localStorage.getItem(NAME);

    return (
        <>
            <Header />
            <main id="main" className="portal-container account">
                <div className="page-heading"><p className="eyebrow">Minha conta</p><h1>Olá, {userName}.</h1><p>Seus dados, em um só lugar.</p></div>
                <section className="account-panel" aria-label="Configurações da conta">
                    <div className="account-profile od-row"><div className="avatar"><FaUser aria-hidden="true" /></div><div><strong>{userName}</strong><p>{localStorage.getItem(EMAIL)}</p></div></div>
                    <SettingItem icon={<BiSolidUser />} label="Alterar nome" onClick={() => openModal("name")} />
                    <SettingItem icon={<MdEmail />} label="Alterar e-mail" onClick={() => openModal("email")} />
                    <SettingItem icon={<MdPassword />} label="Alterar senha" onClick={() => openModal("password")} />
                    <Link className="setting-row exit-row od-row" to="/logout"><span className="icon-box"><ImExit aria-hidden="true" /></span><span className="setting-label">Sair</span><span className="icon-box"><IoIosArrowForward aria-hidden="true" /></span></Link>
                </section>
            </main>
            <Footer />
            {isModalOpen && fieldType && <Modal modalTitle={`Alterar ${FIELD_LABELS[fieldType].toLowerCase()}`} isOpen={isModalOpen} onClose={closeModal}>
                <div className="form-field od-field"><label htmlFor={fieldType}>{fieldType === "password" ? "Nova senha" : `Novo ${FIELD_LABELS[fieldType].toLowerCase()}`}</label>
                    <input id={fieldType} type={fieldType === "password" ? "password" : fieldType === "email" ? "email" : "text"} value={formValues[fieldType]} onChange={handleChange} required />
                </div>
                <div className="dialog-actions"><button type="button" className="button outline" onClick={closeModal}>Cancelar</button><button type="button" className="button primary" onClick={handleSubmit}>Salvar</button></div>
            </Modal>}
        </>
    );
}

type SettingItemProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
};

function SettingItem({ icon, label, onClick }: SettingItemProps) {
  return (
    <button type="button" className="setting-row od-row" onClick={onClick}>
        <span className="icon-box" aria-hidden="true">{icon}</span><span className="setting-label">{label}</span><span className="icon-box"><IoIosArrowForward aria-hidden="true" /></span>
    </button>
  );
}
