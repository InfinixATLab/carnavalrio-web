import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { FiChevronRight } from "react-icons/fi";
import type React from "react"
import api from "../services/api";
import { useEffect, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, EMAIL, NAME, REFRESH_TOKEN, SURNAME } from "../constants/Token";
import type { User } from "../interfaces/User";
import type { Token } from "../interfaces/Token";

async function loginUser(payload: {}): Promise<Token> {
    const {data} = await api.post('token/', payload)
    return data
}

interface LoginForm {
    email: string;
    password: string;
}

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const success = queryParams.get('s'); 
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (!localStorage.getItem(ACCESS_TOKEN)) return;
        let active = true;
        api.get<User>("users/me/").then(({ data }) => {
            if (active && (data.is_staff || data.is_superuser)) navigate("/management", { replace: true });
        }).catch(() => {});
        return () => { active = false; };
    }, [navigate]);

    const changePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    const [formData, setFormData] = useState<LoginForm>({
        email: "",
        password: ""
    })

    const login = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData || !(formData.email && formData.password)) {
            setError("E-mail e Senha devem ser preenchidos!")
            return;
        }
        
        try {
            const res = await loginUser(formData);
            const { data: user } = await api.get<User>("users/me/", {
                headers: { Authorization: `Bearer ${res.access}` },
            });
            if (!user.is_staff && !user.is_superuser) {
                setError("Acesso restrito à equipe. Use uma conta staff ou superuser.");
                return;
            }
            localStorage.setItem(ACCESS_TOKEN, res.access);
            localStorage.setItem(REFRESH_TOKEN, res.refresh);
            localStorage.setItem(EMAIL, res.email);
            localStorage.setItem(NAME, res.name);
            localStorage.setItem(SURNAME, res.surname);
            navigate("/management", { replace: true });
        } catch (err: unknown) {
            setError("Verifique seu e-mail e senha!");
        }
    }

    return (
        <>
            <Header />
            <main id="main" className="portal-container auth">
                <div className="auth-heading"><p className="eyebrow">Equipe Carnavalrio</p><h1>Bem-vindo de volta.</h1><p>Acesso exclusivo para staff e superuser.</p></div>
                <form onSubmit={login} className="auth-form od-stack">
                    {error && <div className="feedback" role="alert">{error}</div>}
                    {success && <div className="feedback success" role="status">Conta criada! Faça login!</div>}
                    <div className="form-field od-field"><label htmlFor="email">E-mail <span className="required">*</span></label><input id="email" type="email" autoComplete="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} placeholder="seu@email.com" required /></div>
                    <div className="form-field od-field">
                        <label htmlFor="password">Senha <span className="required">*</span></label>
                        <div className="password-wrap od-row">
                            <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} placeholder="Sua senha" required />
                            <button type="button" className="icon-button" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"} aria-pressed={showPassword} onClick={changePasswordVisibility}>{showPassword ? <FaRegEyeSlash aria-hidden="true" /> : <FaRegEye aria-hidden="true" />}</button>
                        </div>
                    </div>
                    <button type="submit" className="button primary full">Continuar<span className="icon-box"><FiChevronRight aria-hidden="true" /></span></button>
                </form>
            </main>
            <Footer />
        </>
    );
}
