import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dbHelpers } from '../../db/database';
import { Card, Button } from '../../components/ui';
import { FiHeart, FiCheck, FiDownload, FiAward } from 'react-icons/fi';
import jsPDF from 'jspdf';
import './Donations.css';

const projects = [
    {
        id: 'tree_planting',
        type: 'tree_planting',
        name: 'Ağaç Dikimi Projesi',
        icon: '🌳',
        description: 'TEMA Vakfı ile orman alanlarının genişletilmesi',
        costPerKg: 0.15,
        impact: 'Her 20 kg CO2 için 1 ağaç dikilir',
        organization: 'TEMA Vakfı',
        color: '#2ECC71'
    },
    {
        id: 'renewable_energy',
        type: 'renewable_energy',
        name: 'Yenilenebilir Enerji',
        icon: '☀️',
        description: 'Güneş ve rüzgar enerjisi projelerine destek',
        costPerKg: 0.20,
        impact: 'Fosil yakıt kullanımını azaltır',
        organization: 'Greenpeace Türkiye',
        color: '#F39C12'
    },
    {
        id: 'carbon_capture',
        type: 'carbon_capture',
        name: 'Karbon Yakalama',
        icon: '🏭',
        description: 'İleri teknoloji karbon tutma sistemleri',
        costPerKg: 0.30,
        impact: 'Atmosferden doğrudan CO2 çekimi',
        organization: 'ClimateWorks',
        color: '#3498DB'
    },
    {
        id: 'conservation',
        type: 'conservation',
        name: 'Doğa Koruma',
        icon: '🦁',
        description: 'Biyoçeşitlilik ve habitat koruma',
        costPerKg: 0.18,
        impact: 'Ekosistemler ve karbon depoları korunur',
        organization: 'WWF Türkiye',
        color: '#9B59B6'
    }
];

export default function Donations() {
    const { user } = useAuth();
    const [latestResult, setLatestResult] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [offsetAmount, setOffsetAmount] = useState('');
    const [loading, setLoading] = useState(true);
    const [donationHistory, setDonationHistory] = useState([]);
    const [showCertificate, setShowCertificate] = useState(false);
    const [processingDonation, setProcessingDonation] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                const result = await dbHelpers.getLatestResult(user.id);
                setLatestResult(result);

                const offsets = await dbHelpers.getOffsetsByUser(user.id);
                setDonationHistory(offsets);

                if (result) {
                    setOffsetAmount(Math.round(result.totalCarbonFootprint).toString());
                }
            }
            setLoading(false);
        };
        loadData();
    }, [user]);

    const totalOffset = donationHistory.reduce((sum, d) => sum + d.offsetAmount, 0);
    const remainingFootprint = (latestResult?.totalCarbonFootprint || 0) - totalOffset;

    const handleSelectProject = (project) => {
        setSelectedProject(project);
    };

    const calculateCost = () => {
        if (!selectedProject || !offsetAmount) return 0;
        return (parseFloat(offsetAmount) * selectedProject.costPerKg).toFixed(2);
    };

    const handleDonate = async () => {
        if (!selectedProject || !offsetAmount || !user) return;

        setProcessingDonation(true);

        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Save offset record
        await dbHelpers.saveOffset({
            userId: user.id,
            resultId: latestResult?.id,
            offsetAmount: parseFloat(offsetAmount),
            donationAmount: parseFloat(calculateCost()),
            projectType: selectedProject.type,
            projectName: selectedProject.name
        });

        // Refresh donation history
        const offsets = await dbHelpers.getOffsetsByUser(user.id);
        setDonationHistory(offsets);

        setProcessingDonation(false);
        setShowCertificate(true);
    };

    const downloadCertificate = () => {
        const pdf = new jsPDF('l', 'mm', 'a4');

        // Background
        pdf.setFillColor(13, 31, 34);
        pdf.rect(0, 0, 297, 210, 'F');

        // Border
        pdf.setDrawColor(201, 162, 39);
        pdf.setLineWidth(2);
        pdf.rect(10, 10, 277, 190, 'S');

        // Title
        pdf.setTextColor(201, 162, 39);
        pdf.setFontSize(32);
        pdf.text('KARBON NÖTR SERTİFİKASI', 148.5, 50, { align: 'center' });

        // Content
        pdf.setTextColor(232, 230, 225);
        pdf.setFontSize(16);
        pdf.text('Bu sertifika,', 148.5, 80, { align: 'center' });

        pdf.setFontSize(24);
        pdf.setTextColor(201, 162, 39);
        pdf.text(user?.username || 'Kullanıcı', 148.5, 95, { align: 'center' });

        pdf.setTextColor(232, 230, 225);
        pdf.setFontSize(16);
        pdf.text(`${offsetAmount} kg CO2 karbon telafisi yaptığını belgeler.`, 148.5, 115, { align: 'center' });
        pdf.text(`Proje: ${selectedProject?.name}`, 148.5, 130, { align: 'center' });
        pdf.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 148.5, 145, { align: 'center' });

        // Logo text
        pdf.setFontSize(20);
        pdf.setTextColor(201, 162, 39);
        pdf.text('🌍 CarbonTrack', 148.5, 175, { align: 'center' });

        pdf.save('karbon-notr-sertifikasi.pdf');
    };

    if (loading) {
        return (
            <div className="donations-loading">
                <div className="spinner spinner-lg" />
                <p>Yükleniyor...</p>
            </div>
        );
    }

    if (!latestResult) {
        return (
            <div className="no-results">
                <Card padding="lg" className="no-results-card">
                    <div className="no-results-icon">📋</div>
                    <h2>Önce anketi tamamlayın</h2>
                    <p>Karbon telafisi yapmak için önce karbon ayak izinizi hesaplayın.</p>
                    <Link to="/survey">
                        <Button variant="primary">Ankete Başla</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    if (showCertificate) {
        return (
            <div className="certificate-page">
                <Card variant="accent" padding="lg" className="certificate-card">
                    <div className="certificate-icon">
                        <FiAward size={64} />
                    </div>
                    <h1>Tebrikler! 🎉</h1>
                    <p className="certificate-message">
                        {offsetAmount} kg CO2 karbon telafisi başarıyla tamamlandı.
                    </p>
                    <div className="certificate-details">
                        <div className="detail-row">
                            <span>Proje</span>
                            <strong>{selectedProject?.name}</strong>
                        </div>
                        <div className="detail-row">
                            <span>Miktar</span>
                            <strong>{offsetAmount} kg CO2</strong>
                        </div>
                        <div className="detail-row">
                            <span>Bağış</span>
                            <strong>₺{calculateCost()}</strong>
                        </div>
                    </div>
                    <div className="certificate-actions">
                        <Button variant="primary" icon={<FiDownload />} onClick={downloadCertificate}>
                            Sertifikayı İndir
                        </Button>
                        <Button variant="secondary" onClick={() => setShowCertificate(false)}>
                            Geri Dön
                        </Button>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="donations">
            <div className="donations-header">
                <h1>Karbon Telafi</h1>
                <p>Karbon ayak izinizi telafi ederek doğaya katkıda bulunun</p>
            </div>

            {/* Stats */}
            <div className="offset-stats">
                <Card padding="md" className="stat-card">
                    <span className="stat-label">Toplam Ayak İzi</span>
                    <span className="stat-value">{Math.round(latestResult.totalCarbonFootprint).toLocaleString()} kg</span>
                </Card>
                <Card padding="md" className="stat-card">
                    <span className="stat-label">Telafi Edilen</span>
                    <span className="stat-value positive">{Math.round(totalOffset).toLocaleString()} kg</span>
                </Card>
                <Card padding="md" className="stat-card">
                    <span className="stat-label">Kalan</span>
                    <span className={`stat-value ${remainingFootprint <= 0 ? 'positive' : ''}`}>
                        {remainingFootprint <= 0 ? '✓ Karbon Nötr!' : `${Math.round(remainingFootprint).toLocaleString()} kg`}
                    </span>
                </Card>
            </div>

            {/* Project Selection */}
            <section className="projects-section">
                <h2>Proje Seçin</h2>
                <div className="projects-grid">
                    {projects.map(project => (
                        <Card
                            key={project.id}
                            padding="md"
                            hover
                            className={`project-card ${selectedProject?.id === project.id ? 'selected' : ''}`}
                            onClick={() => handleSelectProject(project)}
                        >
                            <div className="project-icon" style={{ backgroundColor: project.color }}>
                                {project.icon}
                            </div>
                            <h3>{project.name}</h3>
                            <p className="project-desc">{project.description}</p>
                            <div className="project-meta">
                                <span className="project-org">{project.organization}</span>
                                <span className="project-cost">₺{project.costPerKg}/kg</span>
                            </div>
                            <p className="project-impact">{project.impact}</p>
                            {selectedProject?.id === project.id && (
                                <div className="selected-indicator">
                                    <FiCheck />
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </section>

            {/* Donation Form */}
            {selectedProject && (
                <Card variant="glass" padding="lg" className="donation-form">
                    <h2>Bağış Miktarı</h2>

                    <div className="offset-input-group">
                        <label>Telafi edilecek CO2 miktarı (kg)</label>
                        <div className="input-with-buttons">
                            <input
                                type="number"
                                value={offsetAmount}
                                onChange={(e) => setOffsetAmount(e.target.value)}
                                min="1"
                                max={remainingFootprint > 0 ? remainingFootprint : latestResult.totalCarbonFootprint}
                            />
                            <button
                                className="preset-btn"
                                onClick={() => setOffsetAmount(Math.round(remainingFootprint > 0 ? remainingFootprint : latestResult.totalCarbonFootprint).toString())}
                            >
                                Tamamını Telafi Et
                            </button>
                        </div>
                    </div>

                    <div className="donation-summary">
                        <div className="summary-row">
                            <span>Seçilen proje</span>
                            <strong>{selectedProject.name}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Telafi miktarı</span>
                            <strong>{offsetAmount || 0} kg CO2</strong>
                        </div>
                        <div className="summary-row total">
                            <span>Toplam bağış</span>
                            <strong>₺{calculateCost()}</strong>
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        fullWidth
                        size="lg"
                        icon={<FiHeart />}
                        onClick={handleDonate}
                        loading={processingDonation}
                        disabled={!offsetAmount || parseFloat(offsetAmount) <= 0}
                    >
                        Bağış Yap
                    </Button>

                    <p className="donation-note">
                        * Bu bir simülasyondur. Gerçek ödeme işlemi yapılmamaktadır.
                    </p>
                </Card>
            )}

            {/* Donation History */}
            {donationHistory.length > 0 && (
                <Card padding="md" className="history-section">
                    <h3>Bağış Geçmişi</h3>
                    <div className="history-list">
                        {donationHistory.map((donation, index) => (
                            <div key={index} className="history-item">
                                <div className="history-project">
                                    <span>{projects.find(p => p.type === donation.projectType)?.icon}</span>
                                    <span>{donation.projectName}</span>
                                </div>
                                <span className="history-amount">{Math.round(donation.offsetAmount)} kg</span>
                                <span className="history-date">
                                    {new Date(donation.offsetDate).toLocaleDateString('tr-TR')}
                                </span>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
