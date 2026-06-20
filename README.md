# 🌦️ Whisper Hava Durumu

> Türkiye geneli ücretsiz hava durumu ve yağmur tahmini sitesi. Stitch tasarımından esinlenilmiştir.

🌐 **Live Demo:** [https://whisper-hava-durumu.vercel.app/](https://whisper-hava-durumu.vercel.app/)

---

## ✨ Özellikler

### 🌍 Ana Sayfa - Hava Durumu
- 📍 Otomatik konum algılama (IP tabanlı)
- 🔍 81 il + tüm ilçelerde gerçek zamanlı arama
- 🌡️ Anlık sıcaklık, nem, rüzgar, basınç ve görüş bilgileri
- 📊 24 saatlik sıcaklık grafiği
- 📈 7 günlük nem tahmini
- 💾 Son aramanız otomatik kaydedilir (F5 koruması)

### 🌧️ Yağmur Sayfası - Detaylı Yağış Tahmini
- 💧 Yağış ihtimali ve miktarı
- ⏰ Yağışlı saat sayısı
- 📉 24 saatlik yağmur ihtimali grafiği
- 🌅 Güneş doğuş/batış saatleri
- ☀️ UV İndeksi
- 📅 7 günlük yağış miktarı

---

## 🛠️ Teknoloji Stack

- **Frontend:** Pure JavaScript (framework yok, minimal bağımlılık)
- **Styling:** Tailwind CSS + Custom CSS
- **Icons:** Google Material Symbols
- **Builder:** Vite
- **APIs:**
  - 🌡️ **Open-Meteo** (Ana hava durumu - ücretsiz, anahtarsız)
  - 🌧️ **WeatherAPI** (Yağmur tahmini - ücretsiz)
  - 🗺️ **Open-Meteo Geocoding** (Şehir araması - ücretsiz)
  - 📍 **ipwho.is** & **ipapi.co** (Konum algılama - ücretsiz)

---

## 🚀 Kurulum & Çalıştırma

### Gereksinimler
- Node.js (v14+)
- npm veya yarn

### Adımlar

```bash
# Repository'yi klonla
git clone https://github.com/omerc4n/whisper-hava-durumu.git
cd whisper-hava-durumu

# Bağımlılıkları kur
npm install

# Development server'ı başlat
npm run dev
```

Tarayıcında `http://localhost:5173` adresini aç.

---

## 📦 Production Build

```bash
# Production build
npm run build

# Build'i test et
npm run preview
```

`dist/` klasörü oluşacak. Herhangi bir statik hosting servisine (Vercel, Netlify, GitHub Pages vb.) yükleyebilirsin.

---

## 📄 Sayfalar

### `/` - Ana Sayfa (Hava Durumu)
- Şu anki hava koşulları
- 24 saatlik sıcaklık tahmini
- 7 günlük nem oranı

### `/rain.html` - Yağmur Sayfası
- Detaylı yağmur tahmini
- 24 saatlik yağmur ihtimali grafiği
- Güneş bilgileri
- Saatlik yağış miktarı

---

## 🎨 Tasarım

- **Dark Mode:** Göz dostu koyu tema
- **Responsive:** Mobil, tablet ve desktop uyumlu
- **Glass Morphism:** Modern glassmorphic kartlar
- **Smooth Animations:** Yumuşak geçişler ve animasyonlar

---

## 📋 API Bilgileri

### Open-Meteo (Ücretsiz)
- Limit: Sınırsız
- Dokumentasyon: [open-meteo.com](https://open-meteo.com)

### WeatherAPI (Ücretsiz Tier)
- Limit: 1 milyon istek/ay
- API Key gerekli
- Dokumentasyon: [weatherapi.com](https://www.weatherapi.com)

---

## 🤝 Katkıda Bulunma

Katkılarınız ve önerileriniz memnuniyetle karşılanır!

1. Fork et
2. Feature branch oluştur (`git checkout -b feature/AmazingFeature`)
3. Değişiklikleri commit et (`git commit -m 'Add some AmazingFeature'`)
4. Branch'e push et (`git push origin feature/AmazingFeature`)
5. Pull Request aç

---

## 📄 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Ayrıntılar için [LICENSE](LICENSE) dosyasını gör.

---

## 📧 İletişim

- GitHub: [@omerc4n](https://github.com/omerc4n)
- Site: [https://omerc4n.vercel.app/](https://omerc4n.vercel.app/)

---

## 🙏 Teşekkürler

- **Open-Meteo** - Ücretsiz hava durumu API
- **WeatherAPI** - Detaylı hava tahmini API
- **Tailwind CSS** - Modern CSS framework
- **Vite** - Hızlı build tool

---

**Yapıcı yorumlar ve bug raporları için GitHub Issues'i kullan!** 🐛✨
