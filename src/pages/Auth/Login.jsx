import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../../components/ui';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import './Auth.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password, rememberMe);

        if (result.success) {
            navigate('/dashboard');
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-background">
                <div className="auth-gradient" />
                <div className="auth-pattern" />
            </div>

            <div className="auth-container">
                <div className="auth-header">
                    <Link to="/" className="auth-logo">
                        <img src="/logo.png" alt="CarbonTrack" className="logo-icon" />
                        <span className="logo-text">CarbonTrack</span>
                    </Link>
                </div>

                <Card variant="glass" padding="lg" className="auth-card">
                    <div className="auth-card-header">
                        <h1>Hoş Geldiniz</h1>
                        <p>Karbon ayak izinizi takip etmeye devam edin</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <Input
                            label="E-posta"
                            type="email"
                            id="email"
                            placeholder="ornek@email.com"
                            icon={<FiMail />}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <Input
                            label="Şifre"
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            icon={<FiLock />}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <div className="auth-options">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <span>Beni hatırla</span>
                            </label>
                            <Link to="/reset-password" className="forgot-link">
                                Şifremi unuttum
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            icon={<FiArrowRight />}
                            iconPosition="right"
                        >
                            Giriş Yap
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Hesabınız yok mu?{' '}
                            <Link to="/register">Kayıt Ol</Link>
                        </p>
                    </div>
                </Card>

                <div className="auth-features">
                    <div className="feature-item">
                        <span className="feature-icon">📊</span>
                        <span>Detaylı Analiz</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🌱</span>
                        <span>Öneriler</span>
                    </div>
                    <div className="feature-item">
                        <span className="feature-icon">🏆</span>
                        <span>Sertifika</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
