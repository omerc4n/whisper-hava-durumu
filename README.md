# 🌦️ Whisper Hava Durumu

> Türkiye geneli gerçek zamanlı hava durumu ve detaylı yağış tahmini sitesi. Stitch tasarımından ve modern glassmorphic temalardan esinlenilmiştir.

🌐 **Canlı Site (Vercel):** [https://whisper-hava-durumu.vercel.app/](https://whisper-hava-durumu.vercel.app/)

---

## ✨ Özellikler

### 🌍 Ana Sayfa - Hava Durumu
- 📍 **Akıllı Konum Algılama:** IP tabanlı konum tespiti (`ipwho.is` -> `freeipapi` -> `ipapi.co` ardışık yedekli sistemi). Sistem başarısız olursa "İstanbul, Türkiye" varsayılanına güvenli geçiş yapar.
- 🔍 **Detaylı Arama:** İl ve ilçelerde gerçek zamanlı akıllı arama ve otomatik tamamlama.
- 🌡️ **Detaylı Hava Durumu:** Anlık sıcaklık, nem, rüzgar hızı/yönü, basınç ve görüş mesafesi bilgileri.
- 📊 **24 Saatlik Sıcaklık Grafiği:** Görüntülenen konuma ait 24 saatlik sıcaklık sismografı.
- 📈 **7 Günlük Nem Tahmini:** Haftalık ortalama nem yüzdeleri.
- 💾 **Sayfalar Arası Durum Senkronizasyonu:** `localStorage` tabanlı senkronizasyon sayesinde Ana Sayfa ve Yağmur sayfalarından birinde yaptığınız arama/konum tüm sitede korunur.

### 🌧️ Yağmur Sayfası - Detaylı Yağış Tahmini
- 💧 **Yağış İhtimali ve Miktarı:** Detaylı saatlik ve günlük yağış yüzdeleri.
- ⏰ **Yağışlı Saat Sayısı:** Gün içindeki toplam yağış süresi tahmini.
- 📉 **24 Saatlik Yağmur İhtimali Grafiği:** Saat saat yağış olasılığı dağılımı.
- 🌅 **Güneş Bilgileri:** Gün doğumu ve gün batımı saatleri.
- ☀️ **UV İndeksi:** Günlük ultraviyole radyasyon seviyesi.
- 📅 **7 Günlük Yağış Miktarı:** Haftalık toplam yağış tahmini tablosu.
- 🖱️ **Modern İmleç Takipçisi (Hava & Yağmur):** Ana sayfa (mavi) ve yağmur (mor) sayfalarında, fare hareketini organik bir gecikmeyle izleyen estetik bir nokta ve halka imleç follower sistemi. İnteraktif elemanların üstüne gelince halka genişler, arama kutularına girildiğinde ise otomatik olarak kaybolarak default yazı imlecine (`text`) dönüşür.



## 🛠️ Teknoloji Stack

- **Frontend:** Pure JavaScript (Framework bağımsız, modern vanilla ES6)
- **Styling:** Tailwind CSS + Custom Tailwind CSS tokens + Glassmorphism & Keyframe Animations
- **Icons:** Google Material Symbols
- **Builder:** Vite
- **APIs:**
  - 🌡️ **Open-Meteo** (Hava durumu ana verisi)
  - 🌧️ **WeatherAPI** (Yağmur ve güneş verileri)
  - 🗺️ **Open-Meteo Geocoding** (Şehir/İlçe arama motoru)
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
