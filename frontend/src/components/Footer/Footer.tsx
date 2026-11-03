import { FiFacebook, FiInstagram } from "react-icons/fi";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="site-footer">
            <div className="footer-brand"><div className="portal-container footer-row">
                <Link to="/" className="footer-wordmark">CARNAVALRIO</Link>
                <div className="social od-row"><span>SIGA</span>
                    <a href="https://instagram.com/carnavalrio.app" aria-label="Carnavalrio no Instagram"><span className="icon-box"><FiInstagram aria-hidden="true" /></span></a>
                    <a href="https://www.facebook.com/Carnavalrioapp/" aria-label="Carnavalrio no Facebook"><span className="icon-box"><FiFacebook aria-hidden="true" /></span></a>
                </div>
            </div></div>
            <nav className="portal-container footer-links" aria-label="Institucional">
                <Link to="/privacy-policy">Política de privacidade</Link><Link to="/terms">Termos e condições</Link><Link to="/contact">Fale conosco</Link><Link to="/advertise">Anuncie</Link>
            </nav>
            <p className="portal-container copyright">© 2020 - 2025. Todos direitos reservados a Carnavalrio.app. Este material não pode ser publicado, transmitido por broadcast, reescrito ou redistribuido sem autorização.</p>
        </footer>
    );
}
