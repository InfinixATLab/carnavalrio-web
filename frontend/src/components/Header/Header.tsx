import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiUser, FiX, FiHome } from "react-icons/fi";
import { ACCESS_TOKEN, NAME } from "../../constants/Token";
import type { User } from "../../interfaces/User";
import api from "../../services/api";

interface HeaderProps { disabled?: boolean; }

export default function Header({ disabled }: HeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const menuRef = useRef<HTMLDialogElement>(null);
    const name = localStorage.getItem(NAME);

    useEffect(() => {
        const dialog = menuRef.current;
        if (isMenuOpen && !dialog?.open) dialog?.showModal();
        else if (!isMenuOpen && dialog?.open) dialog.close();
    }, [isMenuOpen]);

    useEffect(() => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (!token) return;
        let active = true;
        api.get<User>("users/me/", { headers: { Authorization: `Bearer ${token}` } })
            .then(({ data }) => { if (active) setIsStaff(Boolean(data.is_staff || data.is_superuser)); })
            .catch(() => { if (active) setIsStaff(false); });
        return () => { active = false; };
    }, []);

    return (
        <>
            <a className="skip" href="#main">Pular para o conteúdo</a>
            <header className="masthead">
                <div className="portal-container masthead-inner">
                    <button type="button" className="header-action" aria-label="Abrir menu" aria-haspopup="dialog" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(true)}>
                        <span className="icon-box"><FiMenu aria-hidden="true" /></span><span>Menu</span>
                    </button>
                    <Link to="/" className="brand" aria-label="Carnavalrio, início"><img src="/logos/logo.webp" alt="Carnaval Rio" /></Link>
                    {isStaff && !disabled ? <Link to="/management" className="header-action account-action" aria-label="Área da equipe">
                        <span>{name ? `Olá, ${name}` : "Área da equipe"}</span><span className="icon-box"><FiUser aria-hidden="true" /></span>
                    </Link> : <span aria-hidden="true" />}

                </div>
            </header>
            <dialog ref={menuRef} className="drawer portal-dialog" aria-labelledby="menu-title" onClose={() => setIsMenuOpen(false)} onClick={e => { if (e.target === e.currentTarget) setIsMenuOpen(false); }}>
                <div className="dialog-heading od-row"><h2 id="menu-title">Menu</h2><button type="button" className="icon-button" aria-label="Fechar menu" onClick={() => setIsMenuOpen(false)}><FiX aria-hidden="true" /></button></div>
                <nav className="menu-nav" aria-label="Navegação principal"><Link to="/" onClick={() => setIsMenuOpen(false)}><span className="icon-box"><FiHome aria-hidden="true" /></span>Início</Link></nav>
            </dialog>

        </>
    );
}
