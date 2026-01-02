import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../../components/ui';
import { FiMail, FiLock, FiArrowRight, FiCheck } from 'react-icons/fi';
import './Auth.css';

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [demoToken, setDemoToken] = useState('');

    const { requestPasswordReset, resetPassword } = useAuth();

    const handleRequestReset = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const result = await requestPasswordReset(email);

        if (result.success) {
            setSuccess(result.message);
            // For demo purposes, show the token
            if (result.demoToken) {
                setDemoToken(result.demoToken);
            }
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        if (newPassword.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            return;
        }

        setLoading(true);

        const result = await resetPassword(token, newPassword);

        if (result.success) {
            setSuccess(result.message);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    // If token is provided, show password reset form
    if (token) {
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
                            <h1>Yeni Şifre Belirle</h1>
                            <p>Hesabınız için yeni bir şifre oluşturun</p>
                        </div>

                        {error && <div className="auth-error">{error}</div>}
                        {success && (
                            <div className="auth-success">
                                {success}
                                <Link to="/login" className="btn-link">Giriş Yap</Link>
                            </div>
                        )}

                        {!success && (
                            <form onSubmit={handleResetPassword} className="auth-form">
                                <Input
                                    label="Yeni Şifre"
                                    type="password"
                                    id="newPassword"
                                    placeholder="••••••••"
                                    icon={<FiLock />}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />

                                <Input
                                    label="Şifre Tekrar"
                                    type="password"
                                    id="confirmPassword"
                                    placeholder="••••••••"
                                    icon={<FiCheck />}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    error={
                                        confirmPassword && newPassword !== confirmPassword ?
                                            'Şifreler eşleşmiyor' : ''
                                    }
                                    required
                                />

                                <Button
                                    type="submit"
                                    fullWidth
                                    loading={loading}
                                    icon={<FiArrowRight />}
                                    iconPosition="right"
                                >
                                    Şifreyi Değiştir
                                </Button>
                            </form>
                        )}
                    </Card>
                </div>
            </div>
        );
    }

    // Default: show email request form
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
                        <h1>Şifremi Unuttum</h1>
                        <p>E-posta adresinizi girin, size şifre sıfırlama bağlantısı gönderelim</p>
                    </div>

                    {error && <div className="auth-error">{error}</div>}
                    {success && (
                        <div className="auth-success">
                            {success}
                        </div>
                    )}

                    {/* Demo token display - remove in production */}
                    {demoToken && (
                        <div className="auth-demo-token">
                            <p><strong>Demo:</strong> Gerçek bir uygulamada bu token e-posta ile gönderilir.</p>
                            <Link to={`/reset-password?token=${demoToken}`}>
                                Şifre Sıfırlama Bağlantısı
                            </Link>
                        </div>
                    )}

                    <form onSubmit={handleRequestReset} className="auth-form">
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

                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            icon={<FiArrowRight />}
                            iconPosition="right"
                        >
                            Sıfırlama Bağlantısı Gönder
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            <Link to="/login">← Giriş sayfasına dön</Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
