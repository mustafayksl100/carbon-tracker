import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Card, Button, Input } from '../../components/ui';
import { FiUser, FiMail, FiMapPin, FiUsers, FiCamera, FiSave } from 'react-icons/fi';
import './Profile.css';

export default function Profile() {
    const { user, profile, updateProfile, updateProfilePicture } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        birthDate: '',
        country: 'Türkiye',
        city: '',
        householdSize: 1,
        incomeLevel: 'medium'
    });
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                birthDate: profile.birthDate || '',
                country: profile.country || 'Türkiye',
                city: profile.city || '',
                householdSize: profile.householdSize || 1,
                incomeLevel: profile.incomeLevel || 'medium'
            });
        }
    }, [profile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSuccess('');

        const result = await updateProfile(formData);

        if (result.success) {
            setSuccess('Profil başarıyla güncellendi!');
            setTimeout(() => setSuccess(''), 3000);
        }

        setSaving(false);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Convert to base64
        const reader = new FileReader();
        reader.onload = async (event) => {
            const base64 = event.target?.result;
            if (base64) {
                await updateProfilePicture(base64);
            }
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="profile">
            <div className="profile-header">
                <h1>Profil Ayarları</h1>
                <p>Kişisel bilgilerinizi güncelleyin</p>
            </div>

            <div className="profile-grid">
                {/* Profile Picture */}
                <Card padding="lg" className="profile-picture-card">
                    <div className="avatar-container">
                        <div className="avatar-large">
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt="Profil" />
                            ) : (
                                <FiUser size={48} />
                            )}
                        </div>
                        <label className="avatar-upload">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                hidden
                            />
                            <FiCamera />
                            <span>Fotoğraf Değiştir</span>
                        </label>
                    </div>
                    <div className="user-info">
                        <h3>{user?.username}</h3>
                        <p>{user?.email}</p>
                    </div>
                </Card>

                {/* Profile Form */}
                <Card padding="lg" className="profile-form-card">
                    {success && (
                        <div className="success-message">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-grid">
                            <Input
                                label="Ad Soyad"
                                type="text"
                                name="fullName"
                                id="fullName"
                                placeholder="Adınız Soyadınız"
                                icon={<FiUser />}
                                value={formData.fullName}
                                onChange={handleChange}
                            />

                            <Input
                                label="Doğum Tarihi"
                                type="date"
                                name="birthDate"
                                id="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                            />

                            <Input
                                label="Ülke"
                                type="text"
                                name="country"
                                id="country"
                                placeholder="Türkiye"
                                icon={<FiMapPin />}
                                value={formData.country}
                                onChange={handleChange}
                            />

                            <Input
                                label="Şehir"
                                type="text"
                                name="city"
                                id="city"
                                placeholder="İstanbul"
                                icon={<FiMapPin />}
                                value={formData.city}
                                onChange={handleChange}
                            />

                            <div className="input-wrapper">
                                <label className="input-label">Hane Halkı Büyüklüğü</label>
                                <div className="select-container">
                                    <FiUsers className="select-icon" />
                                    <select
                                        name="householdSize"
                                        value={formData.householdSize}
                                        onChange={handleChange}
                                    >
                                        <option value={1}>1 kişi</option>
                                        <option value={2}>2 kişi</option>
                                        <option value={3}>3 kişi</option>
                                        <option value={4}>4 kişi</option>
                                        <option value={5}>5+ kişi</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-wrapper">
                                <label className="input-label">Gelir Düzeyi</label>
                                <select
                                    name="incomeLevel"
                                    value={formData.incomeLevel}
                                    onChange={handleChange}
                                >
                                    <option value="low">Düşük</option>
                                    <option value="medium">Orta</option>
                                    <option value="high">Yüksek</option>
                                </select>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            icon={<FiSave />}
                            loading={saving}
                        >
                            Değişiklikleri Kaydet
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
}
