import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button, Input, Card } from '../../components/ui';
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheck } from 'react-icons/fi';
import './Auth.css';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const strengthLabels = ['Çok Zayıf', 'Zayıf', 'Orta', 'İyi', 'Güçlü'];
    const strengthColors = ['#E74C3C', '#F39C12', '#F1C40F', '#2ECC71', '#27AE60'];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Şifreler eşleşmiyor');
            return;
        }

        if (formData.password.length < 6) {
            setError('Şifre en az 6 karakter olmalıdır');
            return;
        }

        setLoading(true);

        const result = await register(formData.email, formData.password, formData.username);

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
                        <h1>Kayıt Ol</h1>
                        <p>Karbon ayak izinizi takip etmeye başlayın</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <Input
                            label="Kullanıcı Adı"
                            type="text"
                            id="username"
                            name="username"
                            placeholder="kullanici_adi"
                            icon={<FiUser />}
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="E-posta"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="ornek@email.com"
                            icon={<FiMail />}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />

                        <div className="password-group">
                            <Input
                                label="Şifre"
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                icon={<FiLock />}
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            {formData.password && (
                                <div className="password-strength">
                                    <div className="strength-bars">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`strength-bar ${i < passwordStrength ? 'active' : ''}`}
                                                style={i < passwordStrength ? { backgroundColor: strengthColors[passwordStrength - 1] } : {}}
                                            />
                                        ))}
                                    </div>
                                    <span
                                        className="strength-label"
                                        style={{ color: strengthColors[passwordStrength - 1] }}
                                    >
                                        {strengthLabels[passwordStrength - 1] || 'Çok Zayıf'}
                                    </span>
                                </div>
                            )}
                        </div>

                        <Input
                            label="Şifre Tekrar"
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="••••••••"
                            icon={<FiCheck />}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            error={
                                formData.confirmPassword &&
                                    formData.password !== formData.confirmPassword ?
                                    'Şifreler eşleşmiyor' : ''
                            }
                            required
                        />

                        <div className="auth-terms">
                            <label className="checkbox-label">
                                <input type="checkbox" required />
                                <span>
                                    <a href="#terms">Kullanım koşullarını</a> ve{' '}
                                    <a href="#privacy">gizlilik politikasını</a> kabul ediyorum
                                </span>
                            </label>
                        </div>

                        <Button
                            type="submit"
                            fullWidth
                            loading={loading}
                            icon={<FiArrowRight />}
                            iconPosition="right"
                        >
                            Kayıt Ol
                        </Button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Zaten hesabınız var mı?{' '}
                            <Link to="/login">Giriş Yap</Link>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
