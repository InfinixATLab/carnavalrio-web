import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { FiChevronRight } from "react-icons/fi";
import type React from "react"
import type { User } from "../interfaces/User";
import api from "../services/api";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const headers = () => ({
    "Content-Type": "application/json",
})

async function registerUser(payload: {}): Promise<User[]> {
    const res = await api.post("/users/", payload, { headers: headers() })
    return res.data
}

interface LoginForm {
    email: string;
    name: string;
    surname: string;
    password: string;
}

export default function Register() {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [error, setError] = useState<String>("");
    const navigate = useNavigate();

    const changePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const [formData, setFormData] = useState<LoginForm>({
        email: "",
        name: "",
        surname: "",
        password: ""
    })

    const register = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await registerUser(formData);
            navigate("/infinix/?s=true", { replace: true });
        } catch (err) {
            setError("E-mail já cadastrado.");
        }
    }

    return (
        <>
            <Header />
            <main id="main" className="portal-container auth">
                <div className="auth-heading"><p className="eyebrow">Sua conta Carnavalrio</p><h1>Crie sua conta.</h1><p>Preencha seus dados para começar.</p></div>
                <form onSubmit={register} className="auth-form od-stack">
                    {error && <div className="feedback" role="alert">{error}</div>}

                    <div className="form-field od-field"><label htmlFor="email">E-mail <span className="required">*</span></label><input id="email" type="email" autoComplete="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="seu@email.com" required /></div>
                    <div className="form-field od-field"><label htmlFor="name">Primeiro nome <span className="required">*</span></label><input id="name" type="text" autoComplete="given-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Seu nome" required /></div>
                    <div className="form-field od-field"><label htmlFor="surname">Sobrenome <span className="required">*</span></label><input id="surname" type="text" autoComplete="family-name" value={formData.surname} onChange={e => setFormData({ ...formData, surname: e.target.value })} placeholder="Seu sobrenome" required /></div>
                    <div className="form-field od-field">
                        <label htmlFor="password">Senha <span className="required">*</span></label>
                        <div className="password-wrap od-row">
                            <input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Sua senha" required />
                            <button type="button" className="icon-button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} aria-pressed={showPassword} onClick={changePasswordVisibility}>{showPassword ? <FaRegEyeSlash aria-hidden="true" /> : <FaRegEye aria-hidden="true" />}</button>
                        </div>
                    </div>
                    <button type="submit" className="button primary full">Criar conta<span className="icon-box"><FiChevronRight aria-hidden="true" /></span></button>
                    <p className="auth-switch">Já possui uma conta?<br /><a href="/infinix/">Faça login agora</a></p>
                </form>
            </main>
            <Footer />
        </>
    );
}
