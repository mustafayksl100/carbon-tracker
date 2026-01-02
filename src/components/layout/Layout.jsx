import { Outlet } from 'react-router-dom';
import Header from './Header';
import './Layout.css';

export default function Layout() {
    return (
        <div className="layout">
            <Header />
            <main className="main-content">
                <Outlet />
            </main>
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-brand">
                        <img src="/logo.png" alt="CarbonTrack" className="footer-logo" />
                        <span>CarbonTrack</span>
                    </div>
                    <p className="footer-text">
                        Karbon ayak izinizi bilin, gezegenimizi koruyun.
                    </p>
                    <div className="footer-links">
                        <a href="#privacy">Gizlilik</a>
                        <span className="footer-divider">•</span>
                        <a href="#terms">Kullanım Koşulları</a>
                        <span className="footer-divider">•</span>
                        <a href="#contact">İletişim</a>
                    </div>
                    <p className="footer-copyright">
                        © {new Date().getFullYear()} CarbonTrack. Tüm hakları saklıdır.
                    </p>
                </div>
            </footer>
        </div>
    );
}
