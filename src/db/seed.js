import db from './database';

// Question categories
const categories = [
    {
        id: 1,
        name: 'Enerji Tüketimi',
        description: 'Ev ve yaşam alanınızdaki enerji kullanım alışkanlıklarınız',
        icon: '⚡',
        orderIndex: 1
    },
    {
        id: 2,
        name: 'Ulaşım Alışkanlıkları',
        description: 'Günlük ulaşım ve seyahat tercihleriniz',
        icon: '🚗',
        orderIndex: 2
    },
    {
        id: 3,
        name: 'Beslenme Alışkanlıkları',
        description: 'Yeme içme ve gıda tüketim alışkanlıklarınız',
        icon: '🍽️',
        orderIndex: 3
    },
    {
        id: 4,
        name: 'Dijital Alışkanlıklar',
        description: 'İnternet ve teknoloji kullanım alışkanlıklarınız',
        icon: '💻',
        orderIndex: 4
    },
    {
        id: 5,
        name: 'Tüketim Alışkanlıkları',
        description: 'Alışveriş ve genel tüketim tercihleriniz',
        icon: '🛒',
        orderIndex: 5
    }
];

// Questions with options
const questions = [
    // ==================== ENERJİ TÜKETİMİ (5 soru) ====================
    {
        id: 1,
        categoryId: 1,
        questionText: 'Hangi tip evde yaşıyorsunuz?',
        questionType: 'single_select',
        helpText: 'Yaşadığınız konut tipi enerji tüketiminizi doğrudan etkiler.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Stüdyo/1+0 apartman dairesi', carbonValue: 800, orderIndex: 1, description: 'Küçük yaşam alanı, düşük enerji tüketimi' },
            { optionKey: 'B', optionText: '2+1 veya 3+1 apartman dairesi', carbonValue: 1200, orderIndex: 2, description: 'Orta büyüklükte yaşam alanı' },
            { optionKey: 'C', optionText: 'Büyük apartman dairesi (4+1 ve üzeri)', carbonValue: 1800, orderIndex: 3, description: 'Geniş yaşam alanı, yüksek enerji ihtiyacı' },
            { optionKey: 'D', optionText: 'Müstakil ev (tek katlı)', carbonValue: 2200, orderIndex: 4, description: 'Bağımsız yapı, daha fazla ısıtma/soğutma' },
            { optionKey: 'E', optionText: 'Müstakil ev (çok katlı/villa)', carbonValue: 3500, orderIndex: 5, description: 'En yüksek enerji tüketimi' }
        ]
    },
    {
        id: 2,
        categoryId: 1,
        questionText: 'Elektriğinizin kaynağı nedir?',
        questionType: 'single_select',
        helpText: 'Yenilenebilir enerji kullanımı karbon ayak izinizi önemli ölçüde azaltır.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: '%100 yenilenebilir enerji (güneş paneli, yeşil tarife)', carbonValue: 50, orderIndex: 1, description: 'En düşük karbon etkisi' },
            { optionKey: 'B', optionText: 'Karma kaynak (kısmen yenilenebilir)', carbonValue: 450, orderIndex: 2, description: 'Orta düzey karbon etkisi' },
            { optionKey: 'C', optionText: 'Şebeke elektriği (Türkiye ortalaması)', carbonValue: 850, orderIndex: 3, description: 'Standart karbon etkisi' },
            { optionKey: 'D', optionText: 'Ağırlıklı fosil kaynaklı', carbonValue: 1200, orderIndex: 4, description: 'Yüksek karbon etkisi' }
        ]
    },
    {
        id: 3,
        categoryId: 1,
        questionText: 'Evinizdeki aydınlatma sistemi nasıl?',
        questionType: 'single_select',
        helpText: 'LED ampuller geleneksel ampullere göre %80 daha az enerji tüketir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Tamamen LED aydınlatma', carbonValue: 30, orderIndex: 1, description: 'En verimli seçenek' },
            { optionKey: 'B', optionText: 'Çoğunlukla LED, bazı floresan', carbonValue: 60, orderIndex: 2, description: 'Verimli' },
            { optionKey: 'C', optionText: 'Karma (LED, floresan, akkor)', carbonValue: 120, orderIndex: 3, description: 'Orta verimlilik' },
            { optionKey: 'D', optionText: 'Çoğunlukla floresan veya akkor', carbonValue: 200, orderIndex: 4, description: 'Düşük verimlilik' }
        ]
    },
    {
        id: 4,
        categoryId: 1,
        questionText: 'Isıtma için hangi sistemi kullanıyorsunuz?',
        questionType: 'single_select',
        helpText: 'Isıtma, ev enerji tüketiminin en büyük kalemlerinden biridir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Isı pompası veya jeotermal', carbonValue: 200, orderIndex: 1, description: 'En verimli modern sistem' },
            { optionKey: 'B', optionText: 'Doğalgaz kombi sistemi', carbonValue: 1500, orderIndex: 2, description: 'Yaygın ve orta verimli' },
            { optionKey: 'C', optionText: 'Merkezi ısıtma sistemi', carbonValue: 1800, orderIndex: 3, description: 'Bina bazlı sistem' },
            { optionKey: 'D', optionText: 'Elektrikli ısıtıcılar', carbonValue: 2200, orderIndex: 4, description: 'Yüksek elektrik tüketimi' },
            { optionKey: 'E', optionText: 'Kömür veya odun sobası', carbonValue: 3000, orderIndex: 5, description: 'En yüksek karbon etkisi' }
        ]
    },
    {
        id: 5,
        categoryId: 1,
        questionText: 'Klima/soğutma kullanım alışkanlığınız nasıl?',
        questionType: 'single_select',
        helpText: 'Yaz aylarında klima kullanımı enerji tüketimini ciddi ölçüde artırır.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Klima kullanmıyorum', carbonValue: 0, orderIndex: 1, description: 'Doğal havalandırma' },
            { optionKey: 'B', optionText: 'Sadece çok sıcak günlerde', carbonValue: 150, orderIndex: 2, description: 'Sınırlı kullanım' },
            { optionKey: 'C', optionText: 'Yaz boyunca düzenli kullanım', carbonValue: 400, orderIndex: 3, description: 'Orta düzey kullanım' },
            { optionKey: 'D', optionText: 'Yaz boyunca sürekli açık', carbonValue: 800, orderIndex: 4, description: 'Yoğun kullanım' },
            { optionKey: 'E', optionText: 'Yıl boyu klima kullanımı', carbonValue: 1200, orderIndex: 5, description: 'En yüksek tüketim' }
        ]
    },

    // ==================== ULAŞIM ALIŞKANLIKLARI (6 soru) ====================
    {
        id: 6,
        categoryId: 2,
        questionText: 'Günlük ulaşımda ana aracınız nedir?',
        questionType: 'single_select',
        helpText: 'Ulaşım, kişisel karbon ayak izinin en büyük kalemlerinden biridir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Yürüyüş veya bisiklet', carbonValue: 0, orderIndex: 1, description: 'Sıfır emisyon' },
            { optionKey: 'B', optionText: 'Toplu taşıma (metro, otobüs, tramvay)', carbonValue: 400, orderIndex: 2, description: 'Düşük kişi başı emisyon' },
            { optionKey: 'C', optionText: 'Elektrikli araç', carbonValue: 600, orderIndex: 3, description: 'Düşük emisyon' },
            { optionKey: 'D', optionText: 'Hibrit araç', carbonValue: 1200, orderIndex: 4, description: 'Orta emisyon' },
            { optionKey: 'E', optionText: 'Benzinli/Dizel sedan', carbonValue: 2400, orderIndex: 5, description: 'Yüksek emisyon' },
            { optionKey: 'F', optionText: 'SUV veya pikap', carbonValue: 3500, orderIndex: 6, description: 'En yüksek emisyon' }
        ]
    },
    {
        id: 7,
        categoryId: 2,
        questionText: 'Haftalık ortalama kaç kilometre yol yapıyorsunuz?',
        questionType: 'single_select',
        helpText: 'Daha az sürüş, daha az karbon emisyonu demektir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: '0-50 km (çok az)', carbonValue: 100, orderIndex: 1, description: 'Minimal sürüş' },
            { optionKey: 'B', optionText: '50-150 km (orta)', carbonValue: 350, orderIndex: 2, description: 'Günlük işe gidiş-geliş' },
            { optionKey: 'C', optionText: '150-300 km', carbonValue: 700, orderIndex: 3, description: 'Aktif sürücü' },
            { optionKey: 'D', optionText: '300-500 km', carbonValue: 1100, orderIndex: 4, description: 'Yoğun sürüş' },
            { optionKey: 'E', optionText: '500 km üzeri', carbonValue: 1800, orderIndex: 5, description: 'Profesyonel/uzun mesafe' }
        ]
    },
    {
        id: 8,
        categoryId: 2,
        questionText: 'Yurt içi uçak seyahati ne sıklıkla yaparsınız?',
        questionType: 'single_select',
        helpText: 'Uçak seyahati kişi başı en yüksek karbon emisyonuna sahip ulaşım şeklidir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Hiç', carbonValue: 0, orderIndex: 1, description: 'Uçmuyorum' },
            { optionKey: 'B', optionText: 'Yılda 1-2 kez', carbonValue: 400, orderIndex: 2, description: 'Nadir' },
            { optionKey: 'C', optionText: 'Yılda 3-5 kez', carbonValue: 1000, orderIndex: 3, description: 'Orta sıklıkta' },
            { optionKey: 'D', optionText: 'Yılda 6-10 kez', carbonValue: 2000, orderIndex: 4, description: 'Sık' },
            { optionKey: 'E', optionText: 'Ayda 1 veya daha fazla', carbonValue: 4000, orderIndex: 5, description: 'Çok sık' }
        ]
    },
    {
        id: 9,
        categoryId: 2,
        questionText: 'Yurt dışı uçak seyahati ne sıklıkla yaparsınız?',
        questionType: 'single_select',
        helpText: 'Uzun mesafeli uçuşlar çok yüksek karbon emisyonuna neden olur.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Hiç', carbonValue: 0, orderIndex: 1, description: 'Uçmuyorum' },
            { optionKey: 'B', optionText: 'Yılda 1 kez', carbonValue: 1200, orderIndex: 2, description: 'Yıllık tatil' },
            { optionKey: 'C', optionText: 'Yılda 2-3 kez', carbonValue: 3000, orderIndex: 3, description: 'Düzenli seyahat' },
            { optionKey: 'D', optionText: 'Yılda 4 veya daha fazla', carbonValue: 6000, orderIndex: 4, description: 'Sık seyahat' }
        ]
    },
    {
        id: 10,
        categoryId: 2,
        questionText: 'Araç paylaşımı veya car-sharing kullanıyor musunuz?',
        questionType: 'single_select',
        helpText: 'Araç paylaşımı trafiği ve emisyonları azaltmanın etkili bir yoludur.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Evet, düzenli olarak', carbonValue: -200, orderIndex: 1, description: 'Emisyon azaltımı' },
            { optionKey: 'B', optionText: 'Bazen', carbonValue: -100, orderIndex: 2, description: 'Kısmi azaltım' },
            { optionKey: 'C', optionText: 'Nadiren', carbonValue: 0, orderIndex: 3, description: 'Minimal etki' },
            { optionKey: 'D', optionText: 'Hayır, hiç kullanmıyorum', carbonValue: 100, orderIndex: 4, description: 'Potansiyel kayıp' }
        ]
    },
    {
        id: 11,
        categoryId: 2,
        questionText: 'Tatil seyahatlerinizde hangi ulaşımı tercih edersiniz?',
        questionType: 'single_select',
        helpText: 'Tatil tercihleri yıllık karbon ayak izinizi önemli ölçüde etkiler.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Yerel tatil, araçsız', carbonValue: 50, orderIndex: 1, description: 'En düşük etki' },
            { optionKey: 'B', optionText: 'Tren ile seyahat', carbonValue: 150, orderIndex: 2, description: 'Düşük emisyon' },
            { optionKey: 'C', optionText: 'Özel araç ile', carbonValue: 500, orderIndex: 3, description: 'Orta emisyon' },
            { optionKey: 'D', optionText: 'Kısa mesafe uçuş', carbonValue: 800, orderIndex: 4, description: 'Yüksek emisyon' },
            { optionKey: 'E', optionText: 'Uzun mesafe uçuş + araç kiralama', carbonValue: 2000, orderIndex: 5, description: 'En yüksek' }
        ]
    },

    // ==================== BESLENME ALIŞKANLIKLARI (4 soru) ====================
    {
        id: 12,
        categoryId: 3,
        questionText: 'Et tüketim alışkanlığınız nasıl?',
        questionType: 'single_select',
        helpText: 'Et üretimi, özellikle kırmızı et, yüksek sera gazı emisyonuna neden olur.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Vegan (hiç hayvansal ürün tüketmiyorum)', carbonValue: 400, orderIndex: 1, description: 'En düşük etki' },
            { optionKey: 'B', optionText: 'Vejetaryen (et yemiyorum, süt/yumurta tüketiyorum)', carbonValue: 700, orderIndex: 2, description: 'Düşük etki' },
            { optionKey: 'C', optionText: 'Fleksitaryen (haftada 1-2 kez et)', carbonValue: 1200, orderIndex: 3, description: 'Orta etki' },
            { optionKey: 'D', optionText: 'Düzenli et tüketimi (haftada 3-4 kez)', carbonValue: 1800, orderIndex: 4, description: 'Yüksek etki' },
            { optionKey: 'E', optionText: 'Yoğun et tüketimi (neredeyse her gün)', carbonValue: 2500, orderIndex: 5, description: 'Çok yüksek etki' }
        ]
    },
    {
        id: 13,
        categoryId: 3,
        questionText: 'Yerel ve mevsimlik ürün tüketimi hakkında ne söylersiniz?',
        questionType: 'single_select',
        helpText: 'Yerel ürünler taşıma emisyonlarını, mevsimlik ürünler sera üretim emisyonlarını azaltır.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Çoğunlukla yerel ve mevsimlik ürün tercih ediyorum', carbonValue: 100, orderIndex: 1, description: 'Düşük taşıma emisyonu' },
            { optionKey: 'B', optionText: 'Mümkün olduğunca dikkat ediyorum', carbonValue: 250, orderIndex: 2, description: 'Bilinçli tüketici' },
            { optionKey: 'C', optionText: 'Bazen dikkat ediyorum', carbonValue: 400, orderIndex: 3, description: 'Kısmi dikkat' },
            { optionKey: 'D', optionText: 'Pek dikkat etmiyorum', carbonValue: 600, orderIndex: 4, description: 'Yüksek taşıma emisyonu' }
        ]
    },
    {
        id: 14,
        categoryId: 3,
        questionText: 'Gıda israfınız ne düzeyde?',
        questionType: 'single_select',
        helpText: 'Dünya genelinde üretilen gıdanın %30\'u israf ediliyor ve bu ciddi emisyonlara neden oluyor.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Neredeyse hiç israf etmiyorum', carbonValue: 50, orderIndex: 1, description: 'Çok bilinçli' },
            { optionKey: 'B', optionText: 'Çok az israf ediyorum', carbonValue: 150, orderIndex: 2, description: 'Bilinçli' },
            { optionKey: 'C', optionText: 'Orta düzeyde israf', carbonValue: 300, orderIndex: 3, description: 'Ortalama' },
            { optionKey: 'D', optionText: 'Sıkça gıda atığım oluyor', carbonValue: 500, orderIndex: 4, description: 'Yüksek israf' }
        ]
    },
    {
        id: 15,
        categoryId: 3,
        questionText: 'Dışarıda yemek yeme sıklığınız nedir?',
        questionType: 'single_select',
        helpText: 'Restoran yemekleri genellikle ev yemeklerinden daha yüksek karbon ayak izine sahiptir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Nadiren (ayda 1-2 kez)', carbonValue: 100, orderIndex: 1, description: 'Ev yemekleri ağırlıklı' },
            { optionKey: 'B', optionText: 'Haftada 1-2 kez', carbonValue: 250, orderIndex: 2, description: 'Dengeli' },
            { optionKey: 'C', optionText: 'Haftada 3-4 kez', carbonValue: 450, orderIndex: 3, description: 'Sık dışarıda yemek' },
            { optionKey: 'D', optionText: 'Neredeyse her gün', carbonValue: 700, orderIndex: 4, description: 'Çok sık' }
        ]
    },

    // ==================== DİJİTAL ALIŞKANLIKLAR (4 soru) ====================
    {
        id: 16,
        categoryId: 4,
        questionText: 'Günlük internet kullanım süreniz ne kadar?',
        questionType: 'single_select',
        helpText: 'İnternet altyapısı ve veri merkezleri önemli miktarda enerji tüketir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: '1 saatten az', carbonValue: 20, orderIndex: 1, description: 'Minimal kullanım' },
            { optionKey: 'B', optionText: '1-3 saat', carbonValue: 50, orderIndex: 2, description: 'Orta kullanım' },
            { optionKey: 'C', optionText: '3-6 saat', carbonValue: 100, orderIndex: 3, description: 'Aktif kullanıcı' },
            { optionKey: 'D', optionText: '6-10 saat', carbonValue: 180, orderIndex: 4, description: 'Yoğun kullanıcı' },
            { optionKey: 'E', optionText: '10 saatten fazla', carbonValue: 300, orderIndex: 5, description: 'Süper kullanıcı' }
        ]
    },
    {
        id: 17,
        categoryId: 4,
        questionText: 'Video streaming (Netflix, YouTube vb.) kullanımınız ne kadar?',
        questionType: 'single_select',
        helpText: 'Video streaming, internet trafiğinin en büyük bölümünü oluşturur ve yüksek enerji tüketir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Kullanmıyorum', carbonValue: 0, orderIndex: 1, description: 'Sıfır etki' },
            { optionKey: 'B', optionText: 'Günde 1 saatten az', carbonValue: 60, orderIndex: 2, description: 'Hafif kullanım' },
            { optionKey: 'C', optionText: 'Günde 1-3 saat', carbonValue: 150, orderIndex: 3, description: 'Orta kullanım' },
            { optionKey: 'D', optionText: 'Günde 3-5 saat', carbonValue: 280, orderIndex: 4, description: 'Yoğun kullanım' },
            { optionKey: 'E', optionText: 'Günde 5 saatten fazla', carbonValue: 450, orderIndex: 5, description: 'Çok yoğun' }
        ]
    },
    {
        id: 18,
        categoryId: 4,
        questionText: 'Elektronik cihazlarınızı ne sıklıkla yeniliyorsunuz?',
        questionType: 'single_select',
        helpText: 'Elektronik üretimi yoğun kaynak ve enerji gerektirir. Uzun ömürlü kullanım çevreye daha az zarar verir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: '5 yıldan fazla kullanıyorum', carbonValue: 100, orderIndex: 1, description: 'Sürdürülebilir' },
            { optionKey: 'B', optionText: '3-5 yıl arası', carbonValue: 250, orderIndex: 2, description: 'Makul süre' },
            { optionKey: 'C', optionText: '2-3 yıl arası', carbonValue: 450, orderIndex: 3, description: 'Orta sıklıkta' },
            { optionKey: 'D', optionText: '1-2 yıl arası', carbonValue: 700, orderIndex: 4, description: 'Sık yenileme' },
            { optionKey: 'E', optionText: 'Yılda bir veya daha sık', carbonValue: 1000, orderIndex: 5, description: 'Çok sık' }
        ]
    },
    {
        id: 19,
        categoryId: 4,
        questionText: 'Bulut depolama kullanımınız ne düzeyde?',
        questionType: 'single_select',
        helpText: 'Bulut servisleri sürekli çalışan veri merkezlerinde barındırılır ve enerji tüketir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Kullanmıyorum, yerel depolama tercih ediyorum', carbonValue: 20, orderIndex: 1, description: 'Minimal bulut' },
            { optionKey: 'B', optionText: 'Temel kullanım (5GB altı)', carbonValue: 50, orderIndex: 2, description: 'Hafif kullanım' },
            { optionKey: 'C', optionText: 'Orta kullanım (5-50GB)', carbonValue: 100, orderIndex: 3, description: 'Orta depolama' },
            { optionKey: 'D', optionText: 'Yoğun kullanım (50-200GB)', carbonValue: 200, orderIndex: 4, description: 'Yoğun depolama' },
            { optionKey: 'E', optionText: 'Çok yoğun (200GB üzeri)', carbonValue: 350, orderIndex: 5, description: 'Ağır kullanıcı' }
        ]
    },

    // ==================== TÜKETİM ALIŞKANLIKLARI (5 soru) ====================
    {
        id: 20,
        categoryId: 5,
        questionText: 'Giyim alışverişi alışkanlığınız nasıl?',
        questionType: 'single_select',
        helpText: 'Tekstil endüstrisi dünyanın en kirletici sektörlerinden biridir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'İkinci el/vintage tercih ediyorum', carbonValue: 50, orderIndex: 1, description: 'En sürdürülebilir' },
            { optionKey: 'B', optionText: 'Yılda birkaç parça, kaliteli ve dayanıklı', carbonValue: 150, orderIndex: 2, description: 'Bilinçli tüketim' },
            { optionKey: 'C', optionText: 'Mevsimlik alışveriş', carbonValue: 350, orderIndex: 3, description: 'Orta düzey' },
            { optionKey: 'D', optionText: 'Sık alışveriş, trendleri takip', carbonValue: 600, orderIndex: 4, description: 'Yoğun tüketim' },
            { optionKey: 'E', optionText: 'Fast fashion, çok sık alışveriş', carbonValue: 1000, orderIndex: 5, description: 'En yüksek etki' }
        ]
    },
    {
        id: 21,
        categoryId: 5,
        questionText: 'Geri dönüşüm uygulamalarınız nasıl?',
        questionType: 'single_select',
        helpText: 'Geri dönüşüm, ham madde ihtiyacını ve üretim emisyonlarını azaltır.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Titizlikle ayırıyorum (cam, plastik, kağıt, organik)', carbonValue: -150, orderIndex: 1, description: 'Karbon azaltımı' },
            { optionKey: 'B', optionText: 'Çoğu malzemeyi geri dönüşüme atıyorum', carbonValue: -80, orderIndex: 2, description: 'İyi uygulama' },
            { optionKey: 'C', optionText: 'Bazen geri dönüşüm yapıyorum', carbonValue: 0, orderIndex: 3, description: 'Kısmi uygulama' },
            { optionKey: 'D', optionText: 'Nadiren veya hiç', carbonValue: 150, orderIndex: 4, description: 'Potansiyel kayıp' }
        ]
    },
    {
        id: 22,
        categoryId: 5,
        questionText: 'Su tasarrufu konusunda ne kadar dikkatlisiniz?',
        questionType: 'single_select',
        helpText: 'Su arıtma ve dağıtımı önemli enerji gerektirir.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Çok dikkatli, tasarruflu armatürler kullanıyorum', carbonValue: 30, orderIndex: 1, description: 'Çok tasarruflu' },
            { optionKey: 'B', optionText: 'Genel olarak dikkat ediyorum', carbonValue: 80, orderIndex: 2, description: 'Tasarruflu' },
            { optionKey: 'C', optionText: 'Orta düzeyde dikkat', carbonValue: 150, orderIndex: 3, description: 'Ortalama' },
            { optionKey: 'D', optionText: 'Pek dikkat etmiyorum', carbonValue: 250, orderIndex: 4, description: 'Yüksek tüketim' }
        ]
    },
    {
        id: 23,
        categoryId: 5,
        questionText: 'Online alışveriş sıklığınız nedir?',
        questionType: 'single_select',
        helpText: 'Online alışveriş, kargo taşımacılığı ve ambalaj atığı nedeniyle karbon ayak izine katkıda bulunur.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Nadiren (ayda 1 kez veya daha az)', carbonValue: 30, orderIndex: 1, description: 'Minimal kargo' },
            { optionKey: 'B', optionText: 'Ayda birkaç kez', carbonValue: 100, orderIndex: 2, description: 'Orta sıklıkta' },
            { optionKey: 'C', optionText: 'Haftada 1-2 kez', carbonValue: 250, orderIndex: 3, description: 'Sık alışveriş' },
            { optionKey: 'D', optionText: 'Neredeyse her gün', carbonValue: 500, orderIndex: 4, description: 'Çok sık' }
        ]
    },
    {
        id: 24,
        categoryId: 5,
        questionText: 'Tek kullanımlık ürün tüketiminiz nasıl?',
        questionType: 'single_select',
        helpText: 'Tek kullanımlık plastikler çevre kirliliği ve emisyonların önemli bir kaynağıdır.',
        isActive: true,
        options: [
            { optionKey: 'A', optionText: 'Kaçınıyorum, yeniden kullanılabilir tercih ediyorum', carbonValue: 30, orderIndex: 1, description: 'Sürdürülebilir' },
            { optionKey: 'B', optionText: 'Azaltmaya çalışıyorum', carbonValue: 100, orderIndex: 2, description: 'Bilinçli' },
            { optionKey: 'C', optionText: 'Bazen kullanıyorum', carbonValue: 200, orderIndex: 3, description: 'Orta düzey' },
            { optionKey: 'D', optionText: 'Sıkça kullanıyorum', carbonValue: 350, orderIndex: 4, description: 'Yüksek kullanım' }
        ]
    }
];

// Seed function
export async function seedDatabase() {
    try {
        // Check if already seeded
        const existingCategories = await db.questionCategories.count();
        if (existingCategories > 0) {
            console.log('Database already seeded');
            return;
        }

        console.log('Seeding database...');

        // Insert categories
        await db.questionCategories.bulkAdd(categories);
        console.log('Categories seeded');

        // Insert questions and options
        for (const question of questions) {
            const { options, ...questionData } = question;

            // Add question
            await db.questions.add(questionData);

            // Add options for this question
            const optionsWithQuestionId = options.map(opt => ({
                ...opt,
                questionId: question.id
            }));

            await db.questionOptions.bulkAdd(optionsWithQuestionId);
        }

        console.log('Questions and options seeded');
        console.log('Database seeding complete!');
    } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
    }
}

export default seedDatabase;
