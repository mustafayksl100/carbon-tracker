import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dbHelpers } from '../../db/database';
import { Card, Button } from '../../components/ui';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js';
import { FiClipboard, FiTrendingDown, FiHeart, FiAward, FiChevronRight } from 'react-icons/fi';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Filler);

export default function Dashboard() {
    const { user, profile } = useAuth();
    const navigate = useNavigate();
    const [latestResult, setLatestResult] = useState(null);
    const [allResults, setAllResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (user) {
                const results = await dbHelpers.getResultsByUser(user.id);
                if (results && results.length > 0) {
                    setLatestResult(results[0]);
                    setAllResults(results.slice(0, 6).reverse());
                }
            }
            setLoading(false);
        };
        loadData();
    }, [user]);

    // Comparison data
    const turkeyAverage = 4500; // kg CO2 per year
    const worldAverage = 4800;
    const idealTarget = 2000;

    const userFootprint = latestResult?.totalCarbonFootprint || 0;

    // Pie chart data for category breakdown
    const categoryData = {
        labels: ['Enerji', 'Ulaşım', 'Beslenme', 'Dijital', 'Tüketim'],
        datasets: [{
            data: latestResult ? [
                latestResult.energyFootprint || 0,
                latestResult.transportFootprint || 0,
                latestResult.foodFootprint || 0,
                latestResult.digitalFootprint || 0,
                latestResult.consumptionFootprint || 0
            ] : [20, 25, 20, 15, 20],
            backgroundColor: [
                'rgba(201, 162, 39, 0.8)',
                'rgba(46, 204, 113, 0.8)',
                'rgba(52, 152, 219, 0.8)',
                'rgba(155, 89, 182, 0.8)',
                'rgba(231, 76, 60, 0.8)'
            ],
            borderColor: 'rgba(13, 31, 34, 1)',
            borderWidth: 2
        }]
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#E8E6E1',
                    padding: 20,
                    font: { family: 'Outfit', size: 12 }
                }
            }
        }
    };

    // Line chart for trend
    const trendData = {
        labels: allResults.map((r, i) => `#${i + 1}`),
        datasets: [{
            label: 'Karbon Ayak İzi',
            data: allResults.map(r => r.totalCarbonFootprint),
            borderColor: 'rgba(201, 162, 39, 1)',
            backgroundColor: 'rgba(201, 162, 39, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const lineOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            x: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#9CA3AF' }
            },
            y: {
                grid: { color: 'rgba(255,255,255,0.05)' },
                ticks: { color: '#9CA3AF' }
            }
        }
    };

    const getComparisonPercentage = (value, reference) => {
        if (reference === 0) return 0;
        return Math.round(((value - reference) / reference) * 100);
    };

    const getRecommendations = () => {
        if (!latestResult) return [];

        const recommendations = [];

        if (latestResult.transportFootprint > 2000) {
            recommendations.push({
                icon: '🚗',
                title: 'Ulaşım',
                text: 'Toplu taşıma veya bisiklet kullanımını artırın',
                savings: '~800 kg CO2/yıl'
            });
        }

        if (latestResult.energyFootprint > 1500) {
            recommendations.push({
                icon: '💡',
                title: 'Enerji',
                text: 'LED aydınlatma ve enerji verimli cihazlar kullanın',
                savings: '~400 kg CO2/yıl'
            });
        }

        if (latestResult.foodFootprint > 1500) {
            recommendations.push({
                icon: '🥗',
                title: 'Beslenme',
                text: 'Haftada 1-2 gün etsiz beslenmeyi deneyin',
                savings: '~500 kg CO2/yıl'
            });
        }

        return recommendations.slice(0, 3);
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner spinner-lg" />
                <p>Yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <div className="welcome-section">
                    <h1>Merhaba, {user?.username || 'Kullanıcı'}! 👋</h1>
                    <p>Karbon ayak izinizi takip edin ve gezegene katkıda bulunun.</p>
                </div>
                <div className="header-actions">
                    <Button
                        variant="primary"
                        icon={<FiClipboard />}
                        onClick={() => navigate('/survey')}
                    >
                        {latestResult ? 'Yeniden Hesapla' : 'Ankete Başla'}
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <Card variant="accent" padding="md" className="stat-card main-stat">
                    <img src="/logo.png" alt="" className="stat-icon-img" />
                    <div className="stat-content">
                        <span className="stat-label">Karbon Ayak İziniz</span>
                        <span className="stat-value">
                            {latestResult ? (
                                <>
                                    <span className="stat-number">{Math.round(userFootprint).toLocaleString()}</span>
                                    <span className="stat-unit">kg CO2/yıl</span>
                                </>
                            ) : (
                                <span className="stat-empty">Henüz hesaplanmadı</span>
                            )}
                        </span>
                    </div>
                </Card>

                <Card padding="md" className="stat-card">
                    <div className="stat-comparison">
                        <span className="comparison-label">🇹🇷 Türkiye Ort.</span>
                        <span className="comparison-value">{turkeyAverage.toLocaleString()} kg</span>
                        {latestResult && (
                            <span className={`comparison-diff ${userFootprint < turkeyAverage ? 'positive' : 'negative'}`}>
                                {getComparisonPercentage(userFootprint, turkeyAverage) > 0 ? '+' : ''}
                                {getComparisonPercentage(userFootprint, turkeyAverage)}%
                            </span>
                        )}
                    </div>
                </Card>

                <Card padding="md" className="stat-card">
                    <div className="stat-comparison">
                        <span className="comparison-label">🌐 Dünya Ort.</span>
                        <span className="comparison-value">{worldAverage.toLocaleString()} kg</span>
                        {latestResult && (
                            <span className={`comparison-diff ${userFootprint < worldAverage ? 'positive' : 'negative'}`}>
                                {getComparisonPercentage(userFootprint, worldAverage) > 0 ? '+' : ''}
                                {getComparisonPercentage(userFootprint, worldAverage)}%
                            </span>
                        )}
                    </div>
                </Card>

                <Card padding="md" className="stat-card">
                    <div className="stat-comparison">
                        <span className="comparison-label">🎯 Hedef</span>
                        <span className="comparison-value">{idealTarget.toLocaleString()} kg</span>
                        {latestResult && (
                            <span className={`comparison-diff ${userFootprint < idealTarget ? 'positive' : 'negative'}`}>
                                {userFootprint < idealTarget ? '✓ Hedefe ulaştınız!' : `${Math.round(userFootprint - idealTarget)} kg fazla`}
                            </span>
                        )}
                    </div>
                </Card>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                <Card padding="md" className="chart-card">
                    <h3>Kategori Dağılımı</h3>
                    <div className="chart-container pie-chart">
                        <Pie data={categoryData} options={pieOptions} />
                    </div>
                </Card>

                <Card padding="md" className="chart-card">
                    <h3>İlerleme Trendi</h3>
                    {allResults.length > 1 ? (
                        <div className="chart-container line-chart">
                            <Line data={trendData} options={lineOptions} />
                        </div>
                    ) : (
                        <div className="chart-empty">
                            <FiTrendingDown size={48} />
                            <p>Trend görmek için en az 2 hesaplama yapın</p>
                        </div>
                    )}
                </Card>
            </div>

            {/* Recommendations & Actions */}
            <div className="bottom-grid">
                <Card padding="md" className="recommendations-card">
                    <h3>Öneriler</h3>
                    {getRecommendations().length > 0 ? (
                        <div className="recommendations-list">
                            {getRecommendations().map((rec, index) => (
                                <div key={index} className="recommendation-item">
                                    <span className="rec-icon">{rec.icon}</span>
                                    <div className="rec-content">
                                        <strong>{rec.title}</strong>
                                        <p>{rec.text}</p>
                                        <span className="rec-savings">{rec.savings}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="chart-empty">
                            <p>Öneriler için önce anketi tamamlayın</p>
                        </div>
                    )}
                </Card>

                <Card padding="md" className="actions-card">
                    <h3>Hızlı İşlemler</h3>
                    <div className="quick-actions">
                        <Link to="/survey" className="action-item">
                            <FiClipboard className="action-icon" />
                            <span>Anketi Tamamla</span>
                            <FiChevronRight />
                        </Link>
                        <Link to="/donations" className="action-item">
                            <FiHeart className="action-icon" />
                            <span>Karbon Telafi</span>
                            <FiChevronRight />
                        </Link>
                        <Link to="/results" className="action-item">
                            <FiAward className="action-icon" />
                            <span>Sertifika Al</span>
                            <FiChevronRight />
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
}
