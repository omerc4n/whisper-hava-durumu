# 🌦️ Whisper Hava Durumu & Deprem Takip Sistemi

> Türkiye geneli gerçek zamanlı hava durumu, detaylı yağış tahmini ve anlık deprem takip sitesi. Stitch tasarımından ve modern glassmorphic temalardan esinlenilmiştir.

🌐 **Canlı Site (Vercel):** [https://whisper-hava-durumu.vercel.app/](https://whisper-hava-durumu.vercel.app/)

---

## ✨ Özellikler

### 🌍 Ana Sayfa - Hava Durumu
- 📍 **Akıllı Konum Algılama:** IP tabanlı konum tespiti (`ipwho.is` -> `freeipapi` -> `ipapi.co` ardışık yedekli sistemi). Sistem başarısız olursa "İstanbul, Türkiye" varsayılanına güvenli geçiş yapar.
- 🔍 **Detaylı Arama:** İl ve ilçelerde gerçek zamanlı akıllı arama ve otomatik tamamlama.
- 🌡️ **Detaylı Hava Durumu:** Anlık sıcaklık, nem, rüzgar hızı/yönü, basınç ve görüş mesafesi bilgileri.
- 📊 **24 Saatlik Sıcaklık Grafiği:** Görüntülenen konuma ait 24 saatlik sıcaklık sismografı.
- 📈 **7 Günlük Nem Tahmini:** Haftalık ortalama nem yüzdeleri.
- 💾 **Sayfalar Arası Durum Senkronizasyonu:** `localStorage` tabanlı senkronizasyon sayesinde Ana Sayfa, Yağmur veya Deprem sayfalarından birinde yaptığınız arama/konum tüm sitede korunur.

### 🌧️ Yağmur Sayfası - Detaylı Yağış Tahmini
- 💧 **Yağış İhtimali ve Miktarı:** Detaylı saatlik ve günlük yağış yüzdeleri.
- ⏰ **Yağışlı Saat Sayısı:** Gün içindeki toplam yağış süresi tahmini.
- 📉 **24 Saatlik Yağmur İhtimali Grafiği:** Saat saat yağış olasılığı dağılımı.
- 🌅 **Güneş Bilgileri:** Gün doğumu ve gün batımı saatleri.
- ☀️ **UV İndeksi:** Günlük ultraviyole radyasyon seviyesi.
- 📅 **7 Günlük Yağış Miktarı:** Haftalık toplam yağış tahmini tablosu.
- 🖱️ **Modern İmleç Takipçisi (Hava & Yağmur):** Ana sayfa (mavi) ve yağmur (mor) sayfalarında, fare hareketini organik bir gecikmeyle izleyen estetik bir nokta ve halka imleç follower sistemi. İnteraktif elemanların üstüne gelince halka genişler, arama kutularına girildiğinde ise otomatik olarak kaybolarak default yazı imlecine (`text`) dönüşür.

### 🌋 Deprem Sayfası - Gerçek Zamanlı Deprem Takip & Analiz
- 📡 **Anlık Deprem Akışı:** Kandilli Rasathanesi API'si (ve yedek olarak USGS API) üzerinden Türkiye ve yakın çevresindeki son depremleri canlı listeleme.
- 🗺️ **İnteraktif Sismik Harita:** 
  - Son depremler büyüklüklerine göre renklendirilmiş (Yeşil: <2.5, Sarı: 2.5-4.0, Turuncu: 4.0-5.5, Kırmızı: >=5.5) halkalar ile gösterilir.
  - **En Son Deprem Dalgası:** Haritadaki en son depremin etrafında dışa doğru yayılan konsantrik sismik dalga animasyonları bulunur.
  - **Premium Konum İğnesi:** Seçilen şehri/merkezi gösteren, havada asılı kalıp yumuşakça süzülen (bobbing) ve altında dairesel dalgalar yayan altın sarısı animasyonlu bir konum iğnesi bulunur.
  - **İnteraktif Harita İmleçleri:** Harita üzerinde gezerken radar hedefi imleci, haritayı sürüklerken kilitlenmiş hedef imleci, depremlerin üzerine gelindiğinde ise sismik uyarı halkası imleci devreye girer.
- 📊 **Detaylı İstatistikler & Grafikler:**
  - Bölgedeki en büyük depremin şiddeti, konumu, gerçekleşme tarihi ve saati.
  - Ortalama büyüklük, M4.0+ üzeri kritik deprem sayıları ve ortalama derinlik kartları.
  - **Son 30 Deprem Sismografı:** Son sismik aktivitelerin grafiksel dağılımı.
  - **Adaptif Saatlik/Günlük Dağılım:** Veri seti 36 saatten daha az bir süreyi kapsıyorsa (örn: bölgesel dar aramalar) 3'er saatlik aralıklarla **Saatlik Dağılım**, 36 saatten fazla ise **Son 7 Günlük Dağılım** bar grafiği otomatik olarak çizilir.
- 🗺️ **Sınır Dışı Depremler Projeksiyonu:** Sınır dışı/uluslararası bir deprem seçildiğinde, en yakın Türkiye il merkezine olan mesafesi (örn. `SINIR DIŞI (İzmir'e 80 km)`) otomatik hesaplanır ve "Bölgesel Analiz" sekmesinde bu en yakın bölgenin sismik verileri/istatistikleri listelenir.

---

## 🛠️ Teknoloji Stack

- **Frontend:** Pure JavaScript (Framework bağımsız, modern vanilla ES6)
- **Styling:** Tailwind CSS + Custom Tailwind CSS tokens + Glassmorphism & Keyframe Animations
- **Icons:** Google Material Symbols
- **Maps:** Leaflet.js
- **Builder:** Vite
- **APIs:**
  - 🌡️ **Open-Meteo** (Hava durumu ana verisi)
  - 🌧️ **WeatherAPI** (Yağmur ve güneş verileri)
  - 🗺️ **Open-Meteo Geocoding** (Şehir/İlçe arama motoru)
  - 📡 **Kandilli Rasathanesi API** (orhanaydogdu.com.tr yansısı)
  - 🌍 **USGS Earthquake API** (Uluslararası sismik veriler)
  - 📍 **ipwho.is**, **freeipapi.com** & **ipapi.co** (Yedekli konum algılama)

---

## 🚀 Kurulum & Çalıştırma

### Gereksinimler
- Node.js (v18+)
- npm veya yarn

### Adımlar

```bash
# Repository'yi klonla
git clone https://github.com/omerc4n/whisper-hava-durumu.git
cd whisper-hava-durumu

# Bağımlılıkları kur
npm install

# Geliştirici sunucusunu (Vite) başlat
npm run dev
```

Tarayıcınızda terminalde belirtilen adresi (varsayılan: `http://localhost:5173` veya port doluysa `http://localhost:5174`) açın.

---

## 📦 Production Build (Dağıtım)

Projeyi derlemek ve statik dosya paketini hazırlamak için:

```bash
# Production derlemesi oluştur
npm run build

# Yerel sunucuda derlemeyi önizle
npm run preview
```

Derleme sonrasında oluşan `/dist` klasörünü Vercel, Netlify veya GitHub Pages gibi dilediğiniz bir statik barındırma platformuna doğrudan yükleyebilirsiniz.

---

## 🤝 Katkıda Bulunma

Katkılarınız ve önerileriniz memnuniyetle karşılanır!

1. Projeyi Fork edin
2. Yeni bir feature branch açın (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'feat: Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request açın

---

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasını inceleyebilirsiniz.

---

## 📧 İletişim

- **GitHub:** [@omerc4n](https://github.com/omerc4n)
- **Discord:** [Discord Profil Linki](https://discord.com/users/787270008324882433)
- **Canlı Web Sitesi:** [whisper-hava-durumu.vercel.app](https://whisper-hava-durumu.vercel.app/)
