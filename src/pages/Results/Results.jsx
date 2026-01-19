import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dbHelpers } from '../../db/database';
import { Card, Button } from '../../components/ui';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FiDownload, FiShare2, FiHeart, FiAward, FiRefreshCw } from 'react-icons/fi';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './Results.css';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Results() {
    const { user } = useAuth();
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [allResults, setAllResults] = useState([]);
    const reportRef = useRef(null);

    useEffect(() => {
        const loadResults = async () => {
            if (user) {
                const results = await dbHelpers.getResultsByUser(user.id);
                if (results && results.length > 0) {
                    setResult(results[0]);
                    setAllResults(results);
                }
            }
            setLoading(false);
        };
        loadResults();
    }, [user]);

    const categories = [
        { key: 'energy', name: 'Enerji', icon: '⚡', color: 'rgba(201, 162, 39, 0.8)' },
        { key: 'transport', name: 'Ulaşım', icon: '🚗', color: 'rgba(46, 204, 113, 0.8)' },
        { key: 'food', name: 'Beslenme', icon: '🍽️', color: 'rgba(52, 152, 219, 0.8)' },
        { key: 'digital', name: 'Dijital', icon: '💻', color: 'rgba(155, 89, 182, 0.8)' },
        { key: 'consumption', name: 'Tüketim', icon: '🛒', color: 'rgba(231, 76, 60, 0.8)' }
    ];

    const getCategoryValue = (key) => {
        if (!result) return 0;
        const keyMap = {
            energy: 'energyFootprint',
            transport: 'transportFootprint',
            food: 'foodFootprint',
            digital: 'digitalFootprint',
            consumption: 'consumptionFootprint'
        };
        // Ensure non-negative values (some options have negative carbonValue for offsets)
        return Math.max(0, result[keyMap[key]] || 0);
    };

    const chartData = {
        labels: categories.map(c => c.name),
        datasets: [{
            data: categories.map(c => getCategoryValue(c.key)),
            backgroundColor: categories.map(c => c.color),
            borderColor: 'rgba(13, 31, 34, 1)',
            borderWidth: 3
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: ${context.parsed} kg CO2`
                }
            }
        }
    };

    const getImpactLevel = (value) => {
        if (value < 3000) return { label: 'Düşük', class: 'low', emoji: '🌿' };
        if (value < 5000) return { label: 'Orta', class: 'medium', emoji: '🌍' };
        if (value < 8000) return { label: 'Yüksek', class: 'high', emoji: '⚠️' };
        return { label: 'Çok Yüksek', class: 'very-high', emoji: '🔥' };
    };

    const impactLevel = getImpactLevel(result?.totalCarbonFootprint || 0);

    const treesNeeded = Math.ceil((result?.totalCarbonFootprint || 0) / 20);

    const handleDownloadPDF = async () => {
        if (!reportRef.current) return;

        const canvas = await html2canvas(reportRef.current, {
            backgroundColor: '#0D1F22',
            scale: 2
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 190;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
        pdf.save(`karbon-raporu-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Karbon Ayak İzi Sonucum',
                    text: `Yıllık karbon ayak izim: ${Math.round(result?.totalCarbonFootprint || 0).toLocaleString()} kg CO2. CarbonTrack ile hesapladım!`,
                    url: window.location.href
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(
                `Yıllık karbon ayak izim: ${Math.round(result?.totalCarbonFootprint || 0).toLocaleString()} kg CO2`
            );
            alert('Sonuç panoya kopyalandı!');
        }
    };

    if (loading) {
        return (
            <div className="results-loading">
                <div className="spinner spinner-lg" />
                <p>Sonuçlar yükleniyor...</p>
            </div>
        );
    }

    if (!result) {
        return (
            <div className="no-results">
                <Card padding="lg" className="no-results-card">
                    <div className="no-results-icon">📋</div>
                    <h2>Henüz sonuç yok</h2>
                    <p>Karbon ayak izinizi hesaplamak için anketi tamamlayın.</p>
                    <Link to="/survey">
                        <Button variant="primary">Ankete Başla</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="results">
            {/* Report Section - for PDF export */}
            <div ref={reportRef} className="results-report">
                {/* Header */}
                <div className="results-header">
                    <div className="header-content">
                        <span className="impact-emoji">{impactLevel.emoji}</span>
                        <div>
                            <h1>Karbon Ayak İzi Sonucunuz</h1>
                            <p className={`impact-label ${impactLevel.class}`}>
                                {impactLevel.label} Etki Düzeyi
                            </p>
                        </div>
                    </div>
                    <div className="total-display">
                        <span className="total-value">
                            {Math.round(result.totalCarbonFootprint).toLocaleString()}
                        </span>
                        <span className="total-unit">kg CO2/yıl</span>
                    </div>
                </div>

                {/* Chart & Breakdown */}
                <div className="results-grid">
                    <Card padding="md" className="chart-section">
                        <h3>Kategori Dağılımı</h3>
                        <div className="doughnut-container">
                            <Doughnut data={chartData} options={chartOptions} />
                            <div className="chart-center">
                                <span className="center-value">{treesNeeded}</span>
                                <span className="center-label">ağaç/yıl</span>
                            </div>
                        </div>
                    </Card>

                    <Card padding="md" className="breakdown-section">
                        <h3>Kategori Detayları</h3>
                        <div className="category-list">
                            {categories.map(cat => {
                                const value = getCategoryValue(cat.key);
                                const safeTotal = Math.max(result.totalCarbonFootprint, 1); // Prevent division by zero
                                const percentage = Math.max(0, ((value / safeTotal) * 100)).toFixed(1);
                                return (
                                    <div key={cat.key} className="category-item">
                                        <div className="cat-header">
                                            <span className="cat-icon" style={{ backgroundColor: cat.color }}>{cat.icon}</span>
                                            <span className="cat-name">{cat.name}</span>
                                            <span className="cat-percentage">{percentage}%</span>
                                        </div>
                                        <div className="cat-bar">
                                            <div
                                                className="cat-bar-fill"
                                                style={{
                                                    width: `${percentage}%`,
                                                    backgroundColor: cat.color
                                                }}
                                            />
                                        </div>
                                        <span className="cat-value">{Math.round(value).toLocaleString()} kg</span>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>

                {/* Comparison */}
                <Card padding="md" className="comparison-section">
                    <h3>Karşılaştırma</h3>
                    <div className="comparison-bars">
                        <div className="comp-item">
                            <span className="comp-label">Sizin değeriniz</span>
                            <div className="comp-bar-container">
                                <div
                                    className="comp-bar your-bar"
                                    style={{ width: `${Math.min((result.totalCarbonFootprint / 10000) * 100, 100)}%` }}
                                />
                            </div>
                            <span className="comp-value">{Math.round(result.totalCarbonFootprint).toLocaleString()} kg</span>
                        </div>
                        <div className="comp-item">
                            <span className="comp-label">🇹🇷 Türkiye Ort.</span>
                            <div className="comp-bar-container">
                                <div className="comp-bar turkey-bar" style={{ width: '45%' }} />
                            </div>
                            <span className="comp-value">4,500 kg</span>
                        </div>
                        <div className="comp-item">
                            <span className="comp-label">🌐 Dünya Ort.</span>
                            <div className="comp-bar-container">
                                <div className="comp-bar world-bar" style={{ width: '48%' }} />
                            </div>
                            <span className="comp-value">4,800 kg</span>
                        </div>
                        <div className="comp-item">
                            <span className="comp-label">🎯 Hedef</span>
                            <div className="comp-bar-container">
                                <div className="comp-bar target-bar" style={{ width: '20%' }} />
                            </div>
                            <span className="comp-value">2,000 kg</span>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Actions */}
            <div className="results-actions">
                <Button variant="secondary" icon={<FiDownload />} onClick={handleDownloadPDF}>
                    PDF İndir
                </Button>
                <Button variant="secondary" icon={<FiShare2 />} onClick={handleShare}>
                    Paylaş
                </Button>
                <Link to="/donations">
                    <Button variant="primary" icon={<FiHeart />}>
                        Karbon Telafi
                    </Button>
                </Link>
                <Link to="/survey">
                    <Button variant="ghost" icon={<FiRefreshCw />}>
                        Yeniden Hesapla
                    </Button>
                </Link>
            </div>

            {/* History */}
            {allResults.length > 1 && (
                <Card padding="md" className="history-section">
                    <h3>Geçmiş Hesaplamalar</h3>
                    <div className="history-list">
                        {allResults.slice(0, 5).map((r, index) => (
                            <div key={r.id} className="history-item">
                                <span className="history-date">
                                    {new Date(r.calculationDate).toLocaleDateString('tr-TR')}
                                </span>
                                <span className="history-value">
                                    {Math.round(r.totalCarbonFootprint).toLocaleString()} kg
                                </span>
                                {index === 0 && <span className="badge badge-accent">En Son</span>}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
}
