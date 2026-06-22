// Canlı Deprem Verileri API Kaynakları
const KANDILLI_API = 'https://api.orhanaydogdu.com.tr/deprem/kandilli/live?limit=100';
const RADIUS_KM = 500; // Seçilen konumdan kaç km yarıçap
const DAYS = 7;        // Kaç günlük veri analizi

const PROVINCES = [
  // Marmara
  { name: "İstanbul", lat: 41.0082, lon: 28.9784, region: "Marmara Bölgesi" },
  { name: "Edirne", lat: 41.6772, lon: 26.5557, region: "Marmara Bölgesi" },
  { name: "Kırklareli", lat: 41.7333, lon: 27.2167, region: "Marmara Bölgesi" },
  { name: "Tekirdağ", lat: 40.9781, lon: 27.5110, region: "Marmara Bölgesi" },
  { name: "Çanakkale", lat: 40.1553, lon: 26.4142, region: "Marmara Bölgesi" },
  { name: "Kocaeli", lat: 40.8533, lon: 29.8815, region: "Marmara Bölgesi" },
  { name: "Yalova", lat: 40.6549, lon: 29.2738, region: "Marmara Bölgesi" },
  { name: "Sakarya", lat: 40.7569, lon: 30.3783, region: "Marmara Bölgesi" },
  { name: "Bilecik", lat: 40.1419, lon: 29.9793, region: "Marmara Bölgesi" },
  { name: "Bursa", lat: 40.1885, lon: 29.0610, region: "Marmara Bölgesi" },
  { name: "Balıkesir", lat: 39.6484, lon: 27.8826, region: "Marmara Bölgesi" },
  
  // Ege
  { name: "İzmir", lat: 38.4192, lon: 27.1287, region: "Ege Bölgesi" },
  { name: "Manisa", lat: 38.6191, lon: 27.4287, region: "Ege Bölgesi" },
  { name: "Aydın", lat: 37.8560, lon: 27.8416, region: "Ege Bölgesi" },
  { name: "Muğla", lat: 37.2153, lon: 28.3636, region: "Ege Bölgesi" },
  { name: "Denizli", lat: 37.7760, lon: 29.0864, region: "Ege Bölgesi" },
  { name: "Uşak", lat: 38.6823, lon: 29.4082, region: "Ege Bölgesi" },
  { name: "Kütahya", lat: 39.4167, lon: 29.9833, region: "Ege Bölgesi" },
  { name: "Afyonkarahisar", lat: 38.7507, lon: 30.5567, region: "Ege Bölgesi" },
  
  // Akdeniz
  { name: "Antalya", lat: 36.8969, lon: 30.7133, region: "Akdeniz Bölgesi" },
  { name: "Isparta", lat: 37.7648, lon: 30.5566, region: "Akdeniz Bölgesi" },
  { name: "Burdur", lat: 37.7203, lon: 30.2908, region: "Akdeniz Bölgesi" },
  { name: "Mersin", lat: 36.8121, lon: 34.6415, region: "Akdeniz Bölgesi" },
  { name: "Adana", lat: 37.0000, lon: 35.3213, region: "Akdeniz Bölgesi" },
  { name: "Hatay", lat: 36.2021, lon: 36.1607, region: "Akdeniz Bölgesi" },
  { name: "Osmaniye", lat: 37.0744, lon: 36.2467, region: "Akdeniz Bölgesi" },
  { name: "Kahramanmaraş", lat: 37.5858, lon: 36.9371, region: "Akdeniz Bölgesi" },
  
  // İç Anadolu
  { name: "Ankara", lat: 39.9334, lon: 32.8597, region: "İç Anadolu Bölgesi" },
  { name: "Konya", lat: 37.8714, lon: 32.4847, region: "İç Anadolu Bölgesi" },
  { name: "Karaman", lat: 37.1759, lon: 33.2287, region: "İç Anadolu Bölgesi" },
  { name: "Aksaray", lat: 38.3687, lon: 34.0370, region: "İç Anadolu Bölgesi" },
  { name: "Kırıkkale", lat: 39.8468, lon: 33.5153, region: "İç Anadolu Bölgesi" },
  { name: "Kırşehir", lat: 39.1425, lon: 34.1709, region: "İç Anadolu Bölgesi" },
  { name: "Nevşehir", lat: 38.6244, lon: 34.7144, region: "İç Anadolu Bölgesi" },
  { name: "Niğde", lat: 37.9698, lon: 34.6757, region: "İç Anadolu Bölgesi" },
  { name: "Yozgat", lat: 39.8181, lon: 34.8147, region: "İç Anadolu Bölgesi" },
  { name: "Çankırı", lat: 40.6013, lon: 33.6134, region: "İç Anadolu Bölgesi" },
  { name: "Sivas", lat: 39.7477, lon: 37.0179, region: "İç Anadolu Bölgesi" },
  { name: "Eskişehir", lat: 39.7767, lon: 30.5206, region: "İç Anadolu Bölgesi" },
  { name: "Kayseri", lat: 38.7312, lon: 35.4787, region: "İç Anadolu Bölgesi" },
  
  // Karadeniz
  { name: "Bolu", lat: 40.7350, lon: 31.6078, region: "Karadeniz Bölgesi" },
  { name: "Düzce", lat: 40.8438, lon: 31.1565, region: "Karadeniz Bölgesi" },
  { name: "Zonguldak", lat: 41.4564, lon: 31.7987, region: "Karadeniz Bölgesi" },
  { name: "Karabük", lat: 41.2061, lon: 32.6204, region: "Karadeniz Bölgesi" },
  { name: "Bartın", lat: 41.6344, lon: 32.3375, region: "Karadeniz Bölgesi" },
  { name: "Kastamonu", lat: 41.3887, lon: 33.7827, region: "Karadeniz Bölgesi" },
  { name: "Sinop", lat: 42.0268, lon: 35.1625, region: "Karadeniz Bölgesi" },
  { name: "Samsun", lat: 41.2928, lon: 36.3313, region: "Karadeniz Bölgesi" },
  { name: "Ordu", lat: 40.9839, lon: 37.8764, region: "Karadeniz Bölgesi" },
  { name: "Giresun", lat: 40.9128, lon: 38.3895, region: "Karadeniz Bölgesi" },
  { name: "Trabzon", lat: 41.0027, lon: 39.7168, region: "Karadeniz Bölgesi" },
  { name: "Rize", lat: 41.0201, lon: 40.5234, region: "Karadeniz Bölgesi" },
  { name: "Artvin", lat: 41.1828, lon: 41.8183, region: "Karadeniz Bölgesi" },
  { name: "Gümüşhane", lat: 40.4600, lon: 39.4814, region: "Karadeniz Bölgesi" },
  { name: "Bayburt", lat: 40.2562, lon: 40.2249, region: "Karadeniz Bölgesi" },
  { name: "Amasya", lat: 40.6499, lon: 35.8353, region: "Karadeniz Bölgesi" },
  { name: "Tokat", lat: 40.3167, lon: 36.5500, region: "Karadeniz Bölgesi" },
  { name: "Çorum", lat: 40.5506, lon: 34.9556, region: "Karadeniz Bölgesi" },
  
  // Doğu Anadolu
  { name: "Erzurum", lat: 39.9000, lon: 41.2700, region: "Doğu Anadolu Bölgesi" },
  { name: "Erzincan", lat: 39.7500, lon: 39.5000, region: "Doğu Anadolu Bölgesi" },
  { name: "Kars", lat: 40.6013, lon: 43.0949, region: "Doğu Anadolu Bölgesi" },
  { name: "Ardahan", lat: 41.1105, lon: 42.7022, region: "Doğu Anadolu Bölgesi" },
  { name: "Iğdır", lat: 39.9237, lon: 44.0450, region: "Doğu Anadolu Bölgesi" },
  { name: "Ağrı", lat: 39.7225, lon: 43.0503, region: "Doğu Anadolu Bölgesi" },
  { name: "Van", lat: 38.5012, lon: 43.3730, region: "Doğu Anadolu Bölgesi" },
  { name: "Muş", lat: 38.7312, lon: 41.4939, region: "Doğu Anadolu Bölgesi" },
  { name: "Bitlis", lat: 38.4006, lon: 42.1095, region: "Doğu Anadolu Bölgesi" },
  { name: "Hakkari", lat: 37.5833, lon: 43.7333, region: "Doğu Anadolu Bölgesi" },
  { name: "Elazığ", lat: 38.6810, lon: 39.2230, region: "Doğu Anadolu Bölgesi" },
  { name: "Malatya", lat: 38.3552, lon: 38.3095, region: "Doğu Anadolu Bölgesi" },
  { name: "Bingöl", lat: 38.8847, lon: 40.4939, region: "Doğu Anadolu Bölgesi" },
  { name: "Tunceli", lat: 39.1079, lon: 39.5407, region: "Doğu Anadolu Bölgesi" },
  
  // Güneydoğu Anadolu
  { name: "Gaziantep", lat: 37.0662, lon: 37.3833, region: "Güneydoğu Anadolu Bölgesi" },
  { name: "Kilis", lat: 36.7161, lon: 37.1150, region: "Güneydoğu Anadolu Bölgesi" },
  { name: "Adıyaman", lat: 37.7631, lon: 38.2764, region: "Güneydoğu Anadolu Bölgesi" },
  { name: "Şanlıurfa", lat: 37.1591, lon: 38.7969, region: "Güneydoğu Anadolu Bölgesi" },
  { name: "Diyarbakır", lat: 37.9144, lon: 40.2306, region: "Güneydoğu Anadolu Bölgesi" },
  { name: "Mardin", lat: 37.3212, lon: 40.7245, region: "Güneydoğu Anadolu Bölgesi" },
  { name: "Batman", lat: 37.8812, lon: 41.1351, region: "Güneydoğu Anadolu Bölgesi" },
  { name: "Siirt", lat: 37.9333, lon: 41.9500, region: "Güneydoğu Anadolu Bölgesi" },
  { name: "Şırnak", lat: 37.5164, lon: 42.4611, region: "Güneydoğu Anadolu Bölgesi" }
];


const $ = id => document.getElementById(id);

let currentMinMag = 0;
let currentScope = 'all'; // 'region' veya 'all'
let selectedDateOffset = 0; // 0 = Bugün (Canlı), 1-7 = Geçmiş Günler
let dataLoaded = false;
let allSourceQuakes = []; // Sunucudan çekilen ham deprem listesi
let allQuakes = [];       // Seçili merkeze göre filtrelenmiş depremler
let map = null;
let markersLayer = null;

/* ──────────────── Yardımcılar ──────────────── */

function setLoading(show) {
  const overlay = $('loading-overlay');
  if (overlay) overlay.style.display = show ? 'flex' : 'none';
}

function showError(msg) {
  const t = $('error-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 5000);
}

// Büyüklüğe göre CSS sınıfı
function magClass(mag) {
  if (mag < 2.5) return 'text-alert-low';
  if (mag < 4.0) return 'text-alert-medium';
  if (mag < 5.5) return 'text-alert-high';
  return 'text-alert-critical';
}

// Emojiler
function magEmoji(mag) {
  if (mag < 2.5) return '🟢';
  if (mag < 4.0) return '🟡';
  if (mag < 5.5) return '🟠';
  return '🔴';
}

// Zaman farkı hesaplayıcı
function timeAgo(ms) {
  const diff = Date.now() - ms;
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

// İki koordinat arası mesafeyi (KM) hesaplayan Haversine Formülü
function getDistanceKM(lat1, lon1, lat2, lon2) {
  const R = 6371; // Dünya yarıçapı
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Koordinatların ait olduğu Türkiye coğrafi bölgesini bulur
function getRegionForCoords(lat, lon) {
  let closest = null;
  let minDist = Infinity;
  for (const p of PROVINCES) {
    const dist = getDistanceKM(lat, lon, p.lat, p.lon);
    if (dist < minDist) {
      minDist = dist;
      closest = p;
    }
  }
  // Eğer en yakın il merkezi 350 km'den daha yakınsa Türkiye sınırlarındadır/yakınındadır
  if (minDist < 350) {
    return closest;
  }
  return null;
}

// Sınır dışı depremlerde en yakın Türkiye ilini bulur
function getAbsoluteClosestProvince(lat, lon) {
  let closest = null;
  let minDist = Infinity;
  for (const p of PROVINCES) {
    const dist = getDistanceKM(lat, lon, p.lat, p.lon);
    if (dist < minDist) {
      minDist = dist;
      closest = p;
    }
  }
  return { province: closest, distance: minDist };
}

// Tarih farkını formatlar ve YYYY-MM-DD formatında döner
function formatOffsetDate(offset) {
  const d = new Date();
  d.setDate(d.getDate() - offset);
  const display = offset === 0 
    ? 'Canlı Yayın (Bugün)' 
    : d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const dateDisplayStr = d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  return { display, dateStr: `${yyyy}-${mm}-${dd}`, dateDisplayStr };
}

function updateDateSelectorUI() {
  const prevBtn = $('date-prev');
  const nextBtn = $('date-next');
  if (prevBtn) prevBtn.disabled = (selectedDateOffset === 7);
  if (nextBtn) nextBtn.disabled = (selectedDateOffset === 0);

  const info = formatOffsetDate(selectedDateOffset);
  if ($('date-display')) $('date-display').textContent = info.display;
  if ($('date-sub-display')) {
    $('date-sub-display').textContent = selectedDateOffset === 0 
      ? `Canlı (${info.dateDisplayStr})` 
      : `Arşiv (${info.dateDisplayStr})`;
  }
}

// Tarihi ileri veya geri kaydırır ve verileri günceller
function navigateDate(direction) {
  const newOffset = selectedDateOffset + direction;
  if (newOffset < 0 || newOffset > 7) return;

  selectedDateOffset = newOffset;

  updateDateSelectorUI();

  // Yeniden veri çek (Eğer veri zaten en az bir kez yüklendiyse)
  if (dataLoaded) {
    const lat = parseFloat(localStorage.getItem('sonEnlem') || 39.9334);
    const lon = parseFloat(localStorage.getItem('sonBoylam') || 32.8597);
    const name = localStorage.getItem('sonSehir') || 'Ankara, Türkiye';
    const country = localStorage.getItem('sonUlke') || 'TR';
    fetchEarthquakes(lat, lon, name, country);
  }
}

/* ──────────────── Harita İşlemleri ──────────────── */

function initMap(lat, lon) {
  if (map) {
    map.setView([lat, lon], 7);
    return;
  }

  // Haritayı başlat
  map = L.map('map', {
    center: [lat, lon],
    zoom: 7,
    zoomControl: false
  });

  // Zoom kontrolünü sağ üste ekle
  L.control.zoom({ position: 'topright' }).addTo(map);

  // CartoDB Dark Matter tile katmanını ekle
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(map);

  // İşaretçiler katmanını ekle
  markersLayer = L.layerGroup().addTo(map);
}

function updateMapMarkers(features, centerLat, centerLon, centerName) {
  if (!markersLayer) return;
  markersLayer.clearLayers();

  // 1. Seçilen konum için altın renkli konum iğnesi ekle
  const userIcon = L.divIcon({
    className: 'user-location-marker-container',
    html: `
      <div class="custom-user-pin">
        <div class="pin-ripple"></div>
        <div class="pin-bob">
          <span class="material-symbols-outlined">location_on</span>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 38]
  });

  L.marker([centerLat, centerLon], { icon: userIcon })
    .bindPopup(`<div class="p-2 font-label-sm text-xs"><strong class="text-primary-container">Seçili Merkez</strong><br>${centerName}</div>`)
    .addTo(markersLayer);

  // 2. Filtrelenen ilk 10 deprem işaretçisini ekle
  let latestQuakeId = null;
  let maxTime = 0;
  features.forEach(f => {
    if (f.timeMs && f.timeMs > maxTime) {
      maxTime = f.timeMs;
      latestQuakeId = f.earthquake_id;
    }
  });

  features.forEach(f => {
    const coords = f.geojson?.coordinates;
    if (!coords || coords.length < 2) return;
    const lon = coords[0];
    const lat = coords[1];
    const depth = f.depth ?? 0;
    const mag = f.mag ?? 0;
    const place = f.title ?? 'Bilinmeyen Konum';
    const id = f.earthquake_id;

    // Büyüklüğe göre renk belirle
    let color = '#4ADE80'; // Düşük
    if (mag >= 2.5 && mag < 4.0) {
      color = '#FBBC05'; // Orta
    } else if (mag >= 4.0 && mag < 5.5) {
      color = '#FF4D00'; // Yüksek
    } else if (mag >= 5.5) {
      color = '#FF0000'; // Kritik
    }

    // Büyüklüğe göre işaretçi boyutunu ölçeklendir
    const size = Math.max(14, Math.min(36, 12 + mag * 4.5));
    const hasPulse = mag >= 3.5;
    const isLatest = f.earthquake_id === latestQuakeId;
    const latestClass = isLatest ? 'latest-quake' : '';

    // Özel HTML divIcon oluştur (data-mag eklendi)
    const markerHtml = `
      <div style="color: ${color}; width: ${size}px; height: ${size}px;" class="custom-marker ${latestClass}" id="marker-icon-${id}" data-mag="${mag.toFixed(1)}">
        <div class="marker-halo" style="width: 100%; height: 100%;"></div>
        <div class="marker-inner" style="width: ${size * 0.35}px; height: ${size * 0.35}px;"></div>
        ${hasPulse ? `<div class="marker-pulse" style="color: ${color};"></div>` : ''}
      </div>
    `;

    const icon = L.divIcon({
      className: '',
      html: markerHtml,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2]
    });

    const dateObj = new Date(f.timeMs);
    const dateString = dateObj.toLocaleDateString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const timeString = dateObj.toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const popupContent = `
      <div class="p-3 font-body-md text-xs">
        <div class="flex justify-between items-start mb-2 border-b border-grid-line pb-1.5">
          <span class="text-xl font-bold leading-none" style="color: ${color};">M ${mag.toFixed(1)}</span>
          <span class="text-[9px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded ${mag >= 4.0 ? 'bg-error-container/30 text-error' : 'bg-surface-container text-on-surface-variant'}">${mag >= 4.0 ? 'KRİTİK' : 'HAFİF'}</span>
        </div>
        <p class="font-label-md text-on-surface font-semibold mb-2">${place}</p>
        <div class="grid grid-cols-2 gap-2 border-t border-grid-line pt-2">
          <div>
            <p class="text-[9px] text-on-surface-variant uppercase leading-none mb-0.5">Derinlik</p>
            <p class="font-label-sm text-on-surface font-bold">${depth.toFixed(1)} km</p>
          </div>
          <div>
            <p class="text-[9px] text-on-surface-variant uppercase leading-none mb-0.5">Tarih / Saat</p>
            <p class="font-label-sm text-on-surface font-bold text-[10px] whitespace-nowrap">${dateString} ${timeString}</p>
          </div>
        </div>
      </div>
    `;

    const markerOptions = { icon: icon };
    if (isLatest) {
      markerOptions.zIndexOffset = 1000;
    }

    const marker = L.marker([lat, lon], markerOptions)
      .bindPopup(popupContent)
      .bindTooltip(`${mag.toFixed(1)}`, {
        permanent: false,
        direction: 'top',
        className: 'custom-tooltip',
        offset: [0, -5]
      })
      .addTo(markersLayer);

    // Marker popup olaylarını dinle (Active class ekle/sil)
    marker.on('popupopen', () => {
      const el = document.getElementById(`marker-icon-${id}`);
      if (el) el.classList.add('active-marker');
    });

    marker.on('popupclose', () => {
      const el = document.getElementById(`marker-icon-${id}`);
      if (el) el.classList.remove('active-marker');
    });

    // Haritadan depreme tıklanırsa seç ve analiz/grafikleri o merkezli güncelle
    marker.on('click', () => {
      selectEarthquake(f);
    });

    f._marker = marker;
  });
}

/* ──────────────── Open-Meteo Geocoding Arama (Küresel) ──────────────── */

async function searchCities(q) {
  if (q.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&language=tr&format=json`;
  try {
    const res  = await fetch(url);
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

function renderDropdown(results) {
  const box = $('search-results');
  if (!box) return;
  if (!results.length) { box.classList.add('hidden'); return; }
  box.innerHTML = results.map(r => {
    const label = r.admin1 ? `${r.name}, ${r.admin1}` : r.name;
    const country = r.country_code ? r.country_code.toUpperCase() : 'TR';
    return `<button class="w-full text-left px-4 py-2.5 hover:bg-surface-container-high font-label-sm text-xs text-on-surface border-b border-grid-line last:border-0 transition-colors flex justify-between items-center"
        data-lat="${r.latitude}" data-lon="${r.longitude}" data-name="${label}" data-country="${country}">
      <span>
        <strong class="text-primary-container mr-1">${r.name}</strong>
        ${r.admin1 ? `<span class="text-on-surface-variant text-[10px]">${r.admin1}</span>` : ''}
      </span>
      <span class="text-[9px] text-on-surface-variant uppercase bg-surface px-1.5 py-0.5 rounded border border-grid-line font-bold">${country}</span>
    </button>`;
  }).join('');
  box.classList.remove('hidden');
}

/* ──────────────── İlksel Yükleme Arayüz Kurulumu (Lazy Load) ──────────────── */

function setupInitialLoadUI(lat, lon, name, countryCode = 'TR') {
  localStorage.setItem('sonSehir',  name);
  localStorage.setItem('sonEnlem',  lat);
  localStorage.setItem('sonBoylam', lon);
  localStorage.setItem('sonUlke',   countryCode.toUpperCase());

  // Arayüz metinlerini güncelle
  $('region-title').textContent = name;
  const badge = $('region-badge');
  const centerProv = getRegionForCoords(lat, lon);
  const closestInfo = getAbsoluteClosestProvince(lat, lon);
  const selectedRegion = centerProv ? centerProv.region : (closestInfo.province ? closestInfo.province.region : null);
  if (badge) {
    if (currentScope === 'all') {
      badge.textContent = 'TÜM TÜRKİYE';
    } else {
      if (centerProv) {
        badge.textContent = centerProv.region;
      } else {
        if (closestInfo.province) {
          badge.textContent = `SINIR DIŞI (${closestInfo.province.name}'e ${closestInfo.distance.toFixed(0)} km)`;
        } else {
          badge.textContent = 'SINIR DIŞI';
        }
      }
    }
  }
  if ($('map-region-info')) {
    $('map-region-info').textContent = `Veri Yüklenmedi`;
  }
  if ($('footer-detected-loc')) {
    $('footer-detected-loc').textContent = `Bölge: ${name}`;
  }

  // Deprem feed listesine "Verileri Yükle" butonu ekle
  const container = $('quake-list');
  if (container) {
    container.innerHTML = `
      <div id="initial-load-card" class="p-6 text-center border border-dashed border-primary-container/40 rounded bg-surface-elevated/50 flex flex-col items-center gap-3">
        <span class="material-symbols-outlined text-primary-container text-3xl pulse-quake">sensors</span>
        <h3 class="font-headline-md text-sm font-bold text-on-surface">Deprem Verilerini Al</h3>
        <p class="font-label-sm text-xs text-on-surface-variant leading-relaxed">Deprem verilerini çekmek ve sismik haritayı güncellemek için aşağıdaki butona tıklayın.</p>
        <button id="load-data-btn" class="w-full bg-primary-container text-on-primary-container font-label-md py-2.5 rounded font-bold hover:bg-primary-fixed transition-colors uppercase tracking-wider text-xs">Verileri Yükle</button>
      </div>
    `;
    
    const btn = $('load-data-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        fetchEarthquakes(lat, lon, name, countryCode);
      });
    }
  }
}

/* ──────────────── IP ile otomatik konum ──────────────── */

async function locateByIP() {
  setLoading(true);
  let lat, lon, name, countryCode;

  try {
    const ipwho = await fetch('https://ipwho.is/?lang=tr');
    const ipwhoData = await ipwho.json();
    if (ipwhoData.success) {
      lat         = Number(ipwhoData.latitude);
      lon         = Number(ipwhoData.longitude);
      name        = ipwhoData.city || ipwhoData.region || ipwhoData.country || 'Konumunuz';
      countryCode = ipwhoData.country_code;
    }
  } catch (e) {
    console.warn('ipwho.is failed:', e);
  }

  if (!lat || !lon) {
    try {
      const freeip = await fetch('https://freeipapi.com/api/json');
      const freeipData = await freeip.json();
      if (freeipData.latitude && freeipData.longitude) {
        lat         = Number(freeipData.latitude);
        lon         = Number(freeipData.longitude);
        name        = freeipData.cityName || freeipData.regionName || freeipData.countryName || 'Konumunuz';
        countryCode = freeipData.countryCode;
      }
    } catch (e) {
      console.warn('freeipapi.com failed:', e);
    }
  }

  if (!lat || !lon) {
    try {
      const ipapi = await fetch('https://ipapi.co/json/');
      if (ipapi.ok) {
        const ipapiData = await ipapi.json();
        lat         = Number(ipapiData.latitude);
        lon         = Number(ipapiData.longitude);
        name = ipapiData.city || ipapiData.region || ipapiData.country_name || 'Konumunuz';
        countryCode = ipapiData.country_code;
      }
    } catch (e) {
      console.warn('ipapi.co failed:', e);
    }
  }

  try {
    if (!lat || !lon) throw new Error('Geçersiz koordinat');

    // Yalnızca Türkiye sınırları içindeki konumu kabul et, aksi halde fallback'e git
    const regionInfo = getRegionForCoords(lat, lon);
    if ((countryCode && countryCode.toUpperCase() !== 'TR') || !regionInfo) {
      throw new Error('Türkiye dışı konum tespit edildi');
    }

    const searchInput = $('search-input');
    if (searchInput) searchInput.value = name;

    initMap(lat, lon);
    fetchEarthquakes(lat, lon, name, countryCode || 'TR');
  } catch (err) {
    console.error('Locate by IP error or outside TR:', err);
    showError("Sadece Türkiye'deki depremleri göstermektedir.");
    
    const randomProv = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
    const searchInput = $('search-input');
    if (searchInput) searchInput.value = `${randomProv.name}, Türkiye`;
    
    initMap(randomProv.lat, randomProv.lon);
    fetchEarthquakes(randomProv.lat, randomProv.lon, `${randomProv.name}, Türkiye`, 'TR');
  } finally {
    setLoading(false);
  }
}

/* ──────────────── Deprem Verilerini Çekme (USGS / Kandilli) ──────────────── */

async function fetchEarthquakes(lat, lon, name, countryCode = 'TR') {
  localStorage.setItem('sonSehir',  name);
  localStorage.setItem('sonEnlem',  lat);
  localStorage.setItem('sonBoylam', lon);
  localStorage.setItem('sonUlke',   countryCode.toUpperCase());

  const searchInput = $('search-input');
  if (searchInput) {
    searchInput.value = name;
  }

  setLoading(true);
  currentMinMag = 0;
  resetFilterBtns();

  if (countryCode.toUpperCase() === 'TR') {
    try {
      let url = KANDILLI_API;
      if (selectedDateOffset > 0) {
        const info = formatOffsetDate(selectedDateOffset);
        url = `https://api.orhanaydogdu.com.tr/deprem/kandilli/archive?date=${info.dateStr}&date_end=${info.dateStr}&limit=100`;
      }
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Kandilli API hatası: ${res.status}`);
      const data = await res.json();
      const result = data.result ?? [];

      allSourceQuakes = result.map(f => {
        const coords = f.geojson?.coordinates;
        const eqLon = coords ? coords[0] : 0;
        const eqLat = coords ? coords[1] : 0;
        const dateStrNormalized = f.date_time.replaceAll('.', '-').replace(' ', 'T');
        const timeMs = new Date(dateStrNormalized + '+03:00').getTime();
        return {
          earthquake_id: f.earthquake_id,
          title: f.title,
          mag: f.mag,
          depth: f.depth ?? 0,
          geojson: f.geojson,
          date_time: f.date_time,
          timeMs: timeMs
        };
      });

      dataLoaded = true;

      // Analizi ve işaretçileri güncelle
      recenterAnalysis(lat, lon, name, true);
    } catch (err) {
      console.error('Kandilli hatası, USGS yedeğine bağlanılıyor:', err);
      await fetchUSGS(lat, lon, name);
    } finally {
      setLoading(false);
    }
  } else {
    await fetchUSGS(lat, lon, name);
    setLoading(false);
  }
}

async function fetchUSGS(lat, lon, name) {
  let startTime, endTime;
  if (selectedDateOffset > 0) {
    const info = formatOffsetDate(selectedDateOffset);
    startTime = new Date(info.dateStr + 'T00:00:00Z').toISOString();
    endTime = new Date(info.dateStr + 'T23:59:59Z').toISOString();
  } else {
    endTime   = new Date().toISOString();
    startTime = new Date(Date.now() - DAYS * 24 * 3600 * 1000).toISOString();
  }

  const url = new URL('https://earthquake.usgs.gov/fdsnws/event/1/query');
  url.searchParams.set('format',         'geojson');
  url.searchParams.set('starttime',      startTime);
  url.searchParams.set('endtime',        endTime);
  url.searchParams.set('latitude',       lat);
  url.searchParams.set('longitude',      lon);
  url.searchParams.set('maxradiuskm',    RADIUS_KM);
  url.searchParams.set('minmagnitude',   '1.0');
  url.searchParams.set('orderby',        'time');
  url.searchParams.set('limit',          '100');

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`USGS API hatası: ${res.status}`);
    const data = await res.json();
    const features = data.features ?? [];

    allSourceQuakes = features.map(f => {
      const coords = f.geometry?.coordinates;
      const eqLon = coords ? coords[0] : 0;
      const eqLat = coords ? coords[1] : 0;
      const timeMs = f.properties.time;
      const d = new Date(timeMs);
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Europe/Istanbul',
        year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
      });
      const date_time = formatter.format(d).replace(', ', ' ');
      return {
        earthquake_id: f.id,
        title: f.properties.place,
        mag: f.properties.mag,
        depth: coords ? coords[2] : 0,
        geojson: f.geometry,
        date_time: date_time,
        timeMs: timeMs
      };
    });

    dataLoaded = true;
    recenterAnalysis(lat, lon, name, true);
  } catch (err) {
    console.error('USGS fetch error:', err);
    showError('Küresel deprem verileri alınamadı.');
    allSourceQuakes = [];
    recenterAnalysis(lat, lon, name, true);
  }
}

/* ──────────────── Analiz Merkezi Güncelleme (Recenter) ──────────────── */

function recenterAnalysis(lat, lon, title, updateMarkers = false) {
  // Koordinatları yerel hafızaya kaydet
  localStorage.setItem('sonEnlem', lat);
  localStorage.setItem('sonBoylam', lon);
  localStorage.setItem('sonSehir', title);

  // Seçilen koordinatın ait olduğu Türkiye bölgesini bul
  const centerProv = getRegionForCoords(lat, lon);
  const closestInfo = getAbsoluteClosestProvince(lat, lon);
  const selectedRegion = centerProv ? centerProv.region : (closestInfo.province ? closestInfo.province.region : null);

  // Ham depremler listesindeki tüm depremlerin bölgelerini tespit et ve eşleşenleri filtrele
  allQuakes = allSourceQuakes.map(f => {
    const coords = f.geojson?.coordinates;
    const eqLon = coords ? coords[0] : 0;
    const eqLat = coords ? coords[1] : 0;
    f.distance = getDistanceKM(lat, lon, eqLat, eqLon);
    
    // Depremin bölgesini bul
    const eqProv = getRegionForCoords(eqLat, eqLon);
    f.region = eqProv ? eqProv.region : null;
    return f;
  }).filter(f => {
    // Eger secilen merkez Turkiye ise, sadece Turkiye icindeki depremleri goster
    const isTR = localStorage.getItem('sonUlke') === 'TR';
    if (isTR) {
      if (currentScope === 'region' && selectedRegion) {
        return f.region === selectedRegion;
      }
      // Tüm Türkiye kapsamındayken sınır depremlerini de göster
      return true;
    }
    // Turkiye disi ise, tum gelen depremleri goster
    return true;
  });

  // 1. Grafik ve istatistik kartlarını bu yeni bölgeye göre çiz (TÜM depremler üzerinden)
  renderStatsAndCharts(allQuakes);

  // 2. Sidebar deprem listesini çiz ve harita işaretçilerini sınırla (Filtreli en güncel 10 deprem)
  updateFilteredView(updateMarkers);

  // Footer ve genel sayaçları güncelle
  if ($('footer-detected-loc')) {
    $('footer-detected-loc').textContent = `Bölge: ${title}`;
  }
  $('region-title').textContent = title;

  // Bölge rozetini güncelle
  const badge = $('region-badge');
  if (badge) {
    if (currentScope === 'all') {
      badge.textContent = 'TÜM TÜRKİYE';
    } else {
      if (centerProv) {
        badge.textContent = centerProv.region;
      } else {
        // Türkiye dışındaysa en yakın ili bulup göster
        if (closestInfo.province) {
          badge.textContent = `SINIR DIŞI (${closestInfo.province.name}'e ${closestInfo.distance.toFixed(0)} km)`;
        } else {
          badge.textContent = 'SINIR DIŞI';
        }
      }
    }
  }
}

function setScope(scope) {
  currentScope = scope;
  
  const btnRegion = $('scope-region');
  const btnAll = $('scope-all');
  
  if (btnRegion && btnAll) {
    if (scope === 'region') {
      btnRegion.className = "px-2 py-1 rounded text-[9px] font-label-sm uppercase font-bold tracking-wider transition-all bg-primary-container text-on-primary-container active-scope";
      btnAll.className = "px-2 py-1 rounded text-[9px] font-label-sm uppercase font-bold tracking-wider transition-all text-on-surface-variant hover:text-on-surface";
    } else {
      btnAll.className = "px-2 py-1 rounded text-[9px] font-label-sm uppercase font-bold tracking-wider transition-all bg-primary-container text-on-primary-container active-scope";
      btnRegion.className = "px-2 py-1 rounded text-[9px] font-label-sm uppercase font-bold tracking-wider transition-all text-on-surface-variant hover:text-on-surface";
    }
  }
  
  // Yeniden hesapla ve çiz
  const lat = parseFloat(localStorage.getItem('sonEnlem') || 39.9334);
  const lon = parseFloat(localStorage.getItem('sonBoylam') || 32.8597);
  const name = localStorage.getItem('sonSehir') || 'Ankara, Türkiye';
  
  recenterAnalysis(lat, lon, name, true);
}

function updateFilteredView(updateMarkers = false) {
  const lat = parseFloat(localStorage.getItem('sonEnlem') || 39.9334);
  const lon = parseFloat(localStorage.getItem('sonBoylam') || 32.8597);
  const name = localStorage.getItem('sonSehir') || 'Ankara, Türkiye';

  // 1. Liste için (Bölge kapsamına göre filtrelenmiş)
  const filteredList = currentMinMag > 0
    ? allQuakes.filter(f => (f.mag ?? 0) >= currentMinMag)
    : allQuakes;

  // 2. Harita için (Tüm yüklenen depremler)
  const allTrQuakes = allSourceQuakes.map(f => {
    const coords = f.geojson?.coordinates;
    const eqLon = coords ? coords[0] : 0;
    const eqLat = coords ? coords[1] : 0;
    f.distance = getDistanceKM(lat, lon, eqLat, eqLon);
    const eqProv = getRegionForCoords(eqLat, eqLon);
    f.region = eqProv ? eqProv.region : null;
    return f;
  });

  const filteredMap = currentMinMag > 0
    ? allTrQuakes.filter(f => (f.mag ?? 0) >= currentMinMag)
    : allTrQuakes;

  // Tarih Filtreleme
  const dateInfo = formatOffsetDate(selectedDateOffset);
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  const todayStr = `${yyyy}-${mm}-${dd}`;
  const targetDateStr = dateInfo.dateStr || todayStr;

  // Listeyi tarihle filtrele
  const displayList = filteredList.filter(f => f.date_time && f.date_time.startsWith(targetDateStr));

  // Haritayı tarihle filtrele
  const displayMap = filteredMap.filter(f => f.date_time && f.date_time.startsWith(targetDateStr));

  // Deprem kontrol listesini render et
  renderListUI(displayList);

  // Eğer harita işaretçilerini güncellemek gerekiyorsa
  if (updateMarkers) {
    updateMapMarkers(displayMap, lat, lon, name);
  }

  // Footer istatistiklerini güncelle
  if ($('footer-stats-summary')) {
    $('footer-stats-summary').textContent = `Bölgede Toplam: ${filteredList.length} | Listelenen: ${displayList.length}`;
  }
  if ($('map-region-info')) {
    $('map-region-info').textContent = `Bölgedeki Toplam: ${filteredList.length} Olay`;
  }
}

/* ──────────────── Filtre İşlemleri ──────────────── */

function setFilter(minMag, btnId) {
  currentMinMag = minMag;
  
  const btns = ['filter-all', 'filter-m2', 'filter-m3', 'filter-m4'];
  btns.forEach(id => {
    const btn = $(id);
    if (!btn) return;
    if (id === btnId) {
      btn.classList.add('bg-primary-container', 'text-on-primary-container', 'border-primary-container', 'active-filter');
      btn.classList.remove('bg-surface-container', 'border-grid-line', 'text-on-surface-variant');
    } else {
      btn.classList.remove('bg-primary-container', 'text-on-primary-container', 'border-primary-container', 'active-filter');
      btn.classList.add('bg-surface-container', 'border-grid-line', 'text-on-surface-variant');
    }
  });

  // Filtrelenmiş görünümü güncelle (harita işaretçilerini de günceller)
  updateFilteredView(true);
}

function resetFilterBtns() {
  const btns = ['filter-all', 'filter-m2', 'filter-m3', 'filter-m4'];
  btns.forEach(id => {
    const btn = $(id);
    if (!btn) return;
    if (id === 'filter-all') {
      btn.classList.add('bg-primary-container', 'text-on-primary-container', 'border-primary-container', 'active-filter');
      btn.classList.remove('bg-surface-container', 'border-grid-line', 'text-on-surface-variant');
    } else {
      btn.classList.remove('bg-primary-container', 'text-on-primary-container', 'border-primary-container', 'active-filter');
      btn.classList.add('bg-surface-container', 'border-grid-line', 'text-on-surface-variant');
    }
  });
}


/* ──────────────── Deprem Seçme Olayı ──────────────── */

function selectEarthquake(quake) {
  const coords = quake.geojson?.coordinates;
  if (!coords || coords.length < 2) return;
  const lon = coords[0];
  const lat = coords[1];
  const title = quake.title;

  // 1. Haritayı deprem merkez üssüne yumuşakça kaydır
  map.flyTo([lat, lon], 9);

  // 2. Harita işaretçilerini silmeden, veriyi yerel olarak bu depremin koordinatına göre yeniden hesapla
  // (Böylelikle popup açık kalır ve analiz/grafik penceresi güncellenir)
  recenterAnalysis(lat, lon, title, false);

  // 3. Deprem popup'ını aç
  if (quake._marker) {
    quake._marker.openPopup();
  }

  // 4. Analiz ve Grafik sekmesini otomatik olarak aktif et
  activateTab('stats');
}

/* ──────────────── İstatistik & Grafik Çizimleri ──────────────── */

function renderStatsAndCharts(features) {
  const scopeText = currentScope === 'region' ? 'Bölgesel' : 'Genel (TR)';
  const labelScopeText = currentScope === 'region' ? 'Bölge' : 'Türkiye';
  
  if ($('label-max-mag')) $('label-max-mag').textContent = `${labelScopeText} En Büyük`;
  if ($('label-avg-mag')) $('label-avg-mag').textContent = `Ort. Büyüklük (${scopeText})`;
  if ($('label-strong-count')) $('label-strong-count').textContent = `M4+ Sayısı (${labelScopeText})`;
  if ($('label-avg-depth')) $('label-avg-depth').textContent = `Ort. Derinlik (${labelScopeText})`;
  if ($('label-chart-title')) $('label-chart-title').textContent = `Son 30 Deprem Sismografı (${labelScopeText})`;
  if ($('label-daily-title')) $('label-daily-title').textContent = `Günlük Dağılım (${labelScopeText} - Son 7 Gün)`;

  if (!features.length) {
    $('max-magnitude').innerHTML = `--<span class="text-primary-container/60 text-xs ml-0.5">M</span>`;
    $('max-mag-place').textContent = '—';
    if ($('max-mag-time')) $('max-mag-time').textContent = '—';
    $('avg-magnitude').innerHTML = `--<span class="text-secondary/60 text-xs ml-0.5">M</span>`;
    $('strong-count').innerHTML  = `0<span class="text-alert-high/60 text-xs ml-0.5">adet</span>`;
    $('avg-depth').innerHTML     = `--<span class="text-primary-fixed/60 text-xs ml-0.5">km</span>`;
    $('quake-chart').innerHTML   = '';
    $('chart-labels').innerHTML  = '';
    $('daily-quakes').innerHTML  = '';
    return;
  }

  const mags    = features.map(f => f.mag).filter(v => v != null);
  const depths  = features.map(f => f.depth).filter(v => v != null);
  const maxMag  = mags.length ? Math.max(...mags) : 0;
  const avgMag  = mags.length ? mags.reduce((a, b) => a + b, 0) / mags.length : 0;
  const avgDepth = depths.length ? depths.reduce((a, b) => a + b, 0) / depths.length : 0;
  const strong  = features.filter(f => (f.mag ?? 0) >= 4.0).length;
  const maxFeat = features.find(f => f.mag === maxMag);

  $('max-magnitude').innerHTML = `${maxMag.toFixed(1)}<span class="text-primary-container/60 text-xs ml-0.5">M</span>`;
  $('max-mag-place').textContent = maxFeat?.title ?? '—';
  
  if ($('max-mag-time') && maxFeat && maxFeat.timeMs) {
    const d = new Date(maxFeat.timeMs);
    const dateStr = d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = d.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    $('max-mag-time').textContent = `${dateStr} ${timeStr}`;
  } else if ($('max-mag-time')) {
    $('max-mag-time').textContent = '—';
  }

  $('avg-magnitude').innerHTML = `${avgMag.toFixed(1)}<span class="text-secondary/60 text-xs ml-0.5">M</span>`;
  $('strong-count').innerHTML  = `${strong}<span class="text-alert-high/60 text-xs ml-0.5">adet</span>`;
  $('avg-depth').innerHTML     = `${avgDepth.toFixed(0)}<span class="text-primary-fixed/60 text-xs ml-0.5">km</span>`;

  renderChart(features.slice(0, 30));
  renderDailyBars(features);
}

function renderChart(features) {
  const data  = [...features].reverse();
  const mags  = data.map(f => f.mag ?? 0);
  const times = data.map(f => {
    return new Date(f.timeMs).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
  });

  const W = 400, H = 120, pad = 12;
  const maxVal = Math.max(...mags, 5);

  const pts = mags.map((m, i) => {
    const x = pad + (i / Math.max(mags.length - 1, 1)) * (W - pad * 2);
    const y = H - pad - (m / maxVal) * (H - pad * 2);
    return [x, y];
  });

  const polyPts = pts.map(p => p.join(',')).join(' ');
  const fillPts = [...pts.map(p => p.join(',')), `${W - pad},${H}`, `${pad},${H}`].join(' ');
  const dots    = pts.map(([x, y], i) =>
    `<circle cx="${x}" cy="${y}" r="3.5" fill="#ffd700" opacity="0.8" data-index="${i}" class="quake-dot cursor-pointer" style="transition: r 0.2s;"/>`
  ).join('');

  const svg = $('quake-chart');
  if (!svg) return;

  svg.innerHTML = `
    <defs>
      <linearGradient id="qg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#ffd700" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#ffd700" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="${fillPts}" fill="url(#qg)"/>
    <polyline points="${polyPts}" fill="none" stroke="#ffd700" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round" class="seismo-line"/>
    ${dots}
  `;

  const tooltip   = $('chart-tooltip');
  const chartWrap = svg.parentElement;

  svg.querySelectorAll('circle.quake-dot').forEach(c => {
    c.addEventListener('mouseenter', () => {
      c.setAttribute('r', '6');
      const i     = Number(c.dataset.index);
      const place = data[i]?.title ?? '';
      const mag   = mags[i];
      const time  = times[i];
      
      let color = '#4ADE80';
      if (mag >= 2.5 && mag < 4.0) color = '#FBBC05';
      else if (mag >= 4.0 && mag < 5.5) color = '#FF4D00';
      else if (mag >= 5.5) color = '#FF0000';

      tooltip.innerHTML = `
        <span class="text-on-surface-variant text-[9px] mb-0.5">${time}</span>
        <span class="font-bold text-sm" style="color: ${color};">M ${mag.toFixed(1)}</span>
        <span class="text-on-surface text-[8px] truncate max-w-[120px] font-semibold">${place}</span>
      `;
      const svgRect  = svg.getBoundingClientRect();
      const wrapRect = chartWrap.getBoundingClientRect();
      const x        = (Number(c.getAttribute('cx')) / W) * svgRect.width;
      
      tooltip.style.left = `${Math.min(Math.max(x, 60), wrapRect.width - 60)}px`;
      tooltip.classList.remove('hidden');
    });
    
    c.addEventListener('mouseleave', () => {
      c.setAttribute('r', '3.5');
      tooltip.classList.add('hidden');
    });
  });

  const step = Math.max(1, Math.floor(times.length / 5));
  $('chart-labels').innerHTML = times
    .filter((_, i) => i % step === 0)
    .map(t => `<span>${t}</span>`)
    .join('');
}

function renderDailyBars(features) {
  const container = $('daily-quakes');
  if (!container) return;

  const times = features.map(f => f.timeMs).filter(t => t != null && !isNaN(t));
  if (!times.length) {
    container.innerHTML = '';
    return;
  }

  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  const diffHours = (maxTime - minTime) / (1000 * 60 * 60);

  if (diffHours <= 36) {
    // 36 saatten az veri varsa: Saatlik Dağılım çiz (3'er saatlik aralıklarla 8 bar)
    if ($('label-daily-title')) {
      const scopeText = currentScope === 'region' ? 'Bölge' : 'Türkiye';
      $('label-daily-title').textContent = `Saatlik Dağılım (${scopeText} - 24 Saat)`;
    }

    const intervals = [
      { label: '00-03', min: 0, max: 3, count: 0 },
      { label: '03-06', min: 3, max: 6, count: 0 },
      { label: '06-09', min: 6, max: 9, count: 0 },
      { label: '09-12', min: 9, max: 12, count: 0 },
      { label: '12-15', min: 12, max: 15, count: 0 },
      { label: '15-18', min: 15, max: 18, count: 0 },
      { label: '18-21', min: 18, max: 21, count: 0 },
      { label: '21-24', min: 21, max: 24, count: 0 }
    ];

    features.forEach(f => {
      if (!f.timeMs || isNaN(f.timeMs)) return;
      const hour = new Date(f.timeMs).getHours();
      const interval = intervals.find(x => hour >= x.min && hour < x.max);
      if (interval) interval.count++;
    });

    const maxCount = Math.max(...intervals.map(i => i.count), 1);

    container.innerHTML = intervals.map(i => {
      const pct = (i.count / maxCount) * 100;
      return `
        <div class="flex flex-col items-center gap-1 flex-1 h-full justify-end">
          <span class="font-label-sm text-[9px] text-on-surface-variant mb-0.5">${i.count}</span>
          <div class="w-full flex items-end justify-center" style="height:55px">
            <div class="w-2 rounded-t transition-all duration-700 glow-pulse"
                 style="height:${pct}%;background:linear-gradient(to top,#ff571a,#ffd700)"></div>
          </div>
          <span class="font-label-sm text-[8px] text-on-surface-variant uppercase mt-1 tracking-wider">${i.label}</span>
        </div>`;
    }).join('');

  } else {
    // 36 saatten fazla veri varsa (örneğin USGS 7 günlük veri): Günlük Dağılım çiz (Son 7 Gün)
    if ($('label-daily-title')) {
      const scopeText = currentScope === 'region' ? 'Bölge' : 'Türkiye';
      $('label-daily-title').textContent = `Günlük Dağılım (${scopeText} - Son 7 Gün)`;
    }

    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      days.push({ 
        label: d.toLocaleDateString('tr-TR', { weekday: 'short' }), 
        dateStr: `${yyyy}-${mm}-${dd}`, 
        count: 0 
      });
    }

    features.forEach(f => {
      if (!f.timeMs || isNaN(f.timeMs)) return;
      const d = new Date(f.timeMs);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const fDateStr = `${yyyy}-${mm}-${dd}`;
      const day = days.find(x => x.dateStr === fDateStr);
      if (day) day.count++;
    });

    const maxCount = Math.max(...days.map(d => d.count), 1);

    container.innerHTML = days.map(d => {
      const pct = (d.count / maxCount) * 100;
      return `
        <div class="flex flex-col items-center gap-1 flex-1 h-full justify-end">
          <span class="font-label-sm text-[9px] text-on-surface-variant mb-0.5">${d.count}</span>
          <div class="w-full flex items-end justify-center" style="height:55px">
            <div class="w-2 rounded-t transition-all duration-700 glow-pulse"
                 style="height:${pct}%;background:linear-gradient(to top,#ff571a,#ffd700)"></div>
          </div>
          <span class="font-label-sm text-[8px] text-on-surface-variant uppercase mt-1 tracking-wider">${d.label}</span>
        </div>`;
    }).join('');
  }
}

/* ──────────────── Sağ Sidebar Listesi Arayüz Çizimi ──────────────── */

function renderListUI(list) {
  const container = $('quake-list');
  if (!container) return;

  if (!list.length) {
    container.innerHTML = `
      <div class="p-6 text-center font-label-sm text-xs text-on-surface-variant border border-dashed border-grid-line rounded">
        Seçilen tarihte deprem bulunamadı.
      </div>`;
    return;
  }

  container.innerHTML = list.map(f => {
    const mag = f.mag?.toFixed(1) ?? '?';
    const place = f.title ?? 'Bilinmeyen Konum';
    const depth = f.depth?.toFixed(1) ?? '--';
    const ago = timeAgo(f.timeMs);
    const id = f.earthquake_id;

    // magnitude alert sınıfları
    let borderLeftColor = '#262626';
    let badgeBorderColor = 'border-outline';
    let badgeBgColor = 'bg-surface-container-low';
    let badgeTextColor = 'text-on-surface-variant';
    let glowClass = '';

    const m = f.mag ?? 0;
    if (m < 2.5) {
      borderLeftColor = '#4ADE80';
      badgeBorderColor = 'border-alert-low';
      badgeBgColor = 'bg-alert-low/10';
      badgeTextColor = 'text-alert-low';
    } else if (m < 4.0) {
      borderLeftColor = '#FBBC05';
      badgeBorderColor = 'border-alert-medium';
      badgeBgColor = 'bg-alert-medium/10';
      badgeTextColor = 'text-alert-medium';
    } else if (m < 5.5) {
      borderLeftColor = '#FF4D00';
      badgeBorderColor = 'border-alert-high';
      badgeBgColor = 'bg-alert-high/15';
      badgeTextColor = 'text-alert-high';
      glowClass = 'glow-pulse';
    } else {
      borderLeftColor = '#FF0000';
      badgeBorderColor = 'border-alert-critical';
      badgeBgColor = 'bg-alert-critical/20';
      badgeTextColor = 'text-alert-critical';
      glowClass = 'glow-pulse';
    }

    return `
      <div class="bg-surface-elevated border border-grid-line p-3 rounded flex items-center gap-3 hover:border-primary-container/60 hover:bg-surface-container-high transition-all group cursor-pointer event-card ${glowClass}" 
           style="border-left-color: ${borderLeftColor};" data-id="${id}">
        <div class="flex-shrink-0 w-11 h-11 rounded-full border-2 ${badgeBorderColor} flex items-center justify-center ${badgeBgColor}">
          <span class="font-label-md text-xs font-bold ${badgeTextColor}">${mag}</span>
        </div>
        <div class="flex-grow min-w-0">
          <h3 class="font-body-md text-on-surface font-semibold text-[13px] truncate group-hover:text-primary-container transition-colors">${place}</h3>
          <div class="flex gap-3 mt-1 font-label-sm text-[10px] text-on-surface-variant">
            <div class="flex items-center gap-0.5">
              <span class="material-symbols-outlined text-[12px]">vertical_align_bottom</span>
              <span>${depth} km</span>
            </div>
            <div class="flex items-center gap-0.5">
              <span class="material-symbols-outlined text-[12px]">schedule</span>
              <span>${ago}</span>
            </div>
          </div>
        </div>
        <span class="material-symbols-outlined text-on-surface-variant group-hover:text-primary-container transition-colors text-base shrink-0">chevron_right</span>
      </div>`;
  }).join('');

  // Tıklama olayı ile depremi seç ve odaklan
  container.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', () => {
      const qId = card.dataset.id;
      const quake = allQuakes.find(q => q.earthquake_id === qId);
      if (quake) {
        selectEarthquake(quake);
      }
    });
  });
}

/* ──────────────── Sekme Değiştirme (Activate Tab) ──────────────── */

function activateTab(tabName) {
  const tabBtnEvents = $('tab-btn-events');
  const tabBtnStats = $('tab-btn-stats');
  const tabContentEvents = $('tab-content-events');
  const tabContentStats = $('tab-content-stats');
  const scopeWrap = $('scope-selector-container');
  const magWrap = $('magnitude-filters-container');
  const eventsControls = $('events-controls');

  if (!tabBtnEvents || !tabBtnStats) return;

  if (tabName === 'stats') {
    tabBtnStats.className = "flex-1 pb-2 border-b-2 border-primary-container text-primary-container font-label-md text-center focus:outline-none transition-all uppercase tracking-wider text-xs font-semibold";
    tabBtnEvents.className = "flex-1 pb-2 border-b-2 border-transparent text-on-surface-variant font-label-md text-center focus:outline-none hover:text-on-surface transition-all uppercase tracking-wider text-xs";
    tabContentEvents.classList.add('hidden');
    tabContentStats.classList.remove('hidden');
    
    // Büyüklük filtrelerini yumuşakça gizle (Direct Style) - Bölge/Tüm TR seçeneği kalır
    if (magWrap) {
      magWrap.style.maxHeight = '0px';
      magWrap.style.opacity = '0';
      magWrap.style.pointerEvents = 'none';
      magWrap.style.paddingBottom = '0px';
    }
  } else {
    tabBtnEvents.className = "flex-1 pb-2 border-b-2 border-primary-container text-primary-container font-label-md text-center focus:outline-none transition-all uppercase tracking-wider text-xs font-semibold";
    tabBtnStats.className = "flex-1 pb-2 border-b-2 border-transparent text-on-surface-variant font-label-md text-center focus:outline-none hover:text-on-surface transition-all uppercase tracking-wider text-xs";
    tabContentEvents.classList.remove('hidden');
    tabContentStats.classList.add('hidden');
    
    // Büyüklük filtrelerini geri getir (Direct Style)
    if (magWrap) {
      magWrap.style.maxHeight = '48px';
      magWrap.style.opacity = '1';
      magWrap.style.pointerEvents = 'auto';
      magWrap.style.paddingBottom = '4px';
    }
  }
}

/* ──────────────── Uygulama Başlatma (Init) ──────────────── */

function init() {
  setLoading(false);
  updateDateSelectorUI();

  const input   = $('search-input');
  const results = $('search-results');
  const clearBtn = $('search-clear-btn');
  let timer;

  if (clearBtn && input) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.add('hidden');
      results.classList.add('hidden');
      input.focus();
    });
  }

  // Arama girdisi
  input.addEventListener('input', () => {
    if (clearBtn) {
      if (input.value.trim().length > 0) {
        clearBtn.classList.remove('hidden');
      } else {
        clearBtn.classList.add('hidden');
      }
    }
    clearTimeout(timer);
    const q = input.value.trim();
    if (q.length < 2) { results.classList.add('hidden'); return; }
    timer = setTimeout(async () => {
      const cities = await searchCities(q);
      renderDropdown(cities);
    }, 300);
  });

  // Arama sonucundan seçim yapılması
  results.addEventListener('click', e => {
    const btn = e.target.closest('button[data-lat]');
    if (!btn) return;

    const country = btn.dataset.country || 'TR';
    const lat = parseFloat(btn.dataset.lat);
    const lon = parseFloat(btn.dataset.lon);
    const regionInfo = getRegionForCoords(lat, lon);

    if (country.toUpperCase() !== 'TR' || !regionInfo) {
      showError('Yalnızca Türkiye sınırları içindeki konumları arayabilirsiniz.');
      results.classList.add('hidden');
      input.value = '';
      if (clearBtn) clearBtn.classList.add('hidden');
      return;
    }

    input.value = btn.dataset.name;
    if (clearBtn) clearBtn.classList.remove('hidden');
    results.classList.add('hidden');
    
    const name = btn.dataset.name;
    
    initMap(lat, lon);
    fetchEarthquakes(lat, lon, name, country).then(() => {
      // Şehir aranınca analiz & grafik sekmesini otomatik olarak aç
      activateTab('stats');
    });
  });

  // Dışarı tıklanınca aramayı kapat
  document.addEventListener('click', e => {
    if (input && results && !input.contains(e.target) && !results.contains(e.target)) {
      results.classList.add('hidden');
    }
  });

  // Filtre butonları
  $('filter-all').addEventListener('click', () => setFilter(0,   'filter-all'));
  $('filter-m2' ).addEventListener('click', () => setFilter(2.0, 'filter-m2'));
  $('filter-m3' ).addEventListener('click', () => setFilter(3.0, 'filter-m3'));
  $('filter-m4' ).addEventListener('click', () => setFilter(4.0, 'filter-m4'));

  // Scope (Bölge / Tüm TR) butonları
  const scopeRegionBtn = $('scope-region');
  const scopeAllBtn = $('scope-all');
  if (scopeRegionBtn && scopeAllBtn) {
    scopeRegionBtn.addEventListener('click', () => setScope('region'));
    scopeAllBtn.addEventListener('click', () => setScope('all'));
  }

  // Tarih gezinme butonları
  const datePrevBtn = $('date-prev');
  const dateNextBtn = $('date-next');
  if (datePrevBtn && dateNextBtn) {
    datePrevBtn.addEventListener('click', () => navigateDate(1));  // 1 gün geri
    dateNextBtn.addEventListener('click', () => navigateDate(-1)); // 1 gün ileri (bugüne doğru)
  }

  // Tab değiştirme dinleyicileri
  const tabBtnEvents = $('tab-btn-events');
  const tabBtnStats = $('tab-btn-stats');

  if (tabBtnEvents && tabBtnStats) {
    tabBtnEvents.addEventListener('click', () => activateTab('events'));
    tabBtnStats.addEventListener('click', () => activateTab('stats'));
  }

  // Saat güncelleyici (İstanbul - TSİ)
  setInterval(() => {
    const utcEl = $('utc-time');
    if (utcEl) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour12: false });
      utcEl.textContent = timeStr;
    }
  }, 1000);

  // localStorage'dan son seçimi yükle, yoksa IP'den bul
  const kayitliSehir  = localStorage.getItem('sonSehir');
  const kayitliEnlem  = localStorage.getItem('sonEnlem');
  const kayitliBoylam = localStorage.getItem('sonBoylam');
  const kayitliUlke   = localStorage.getItem('sonUlke');

  if (kayitliSehir && kayitliEnlem && kayitliBoylam) {
    const lat = parseFloat(kayitliEnlem);
    const lon = parseFloat(kayitliBoylam);
    
    const isTR = (kayitliUlke && kayitliUlke.toUpperCase() === 'TR') || (getRegionForCoords(lat, lon) !== null);
    if (!isTR) {
      showError("Sadece Türkiye'deki depremleri göstermektedir.");
      const randomProv = PROVINCES[Math.floor(Math.random() * PROVINCES.length)];
      input.value = `${randomProv.name}, Türkiye`;
      if (clearBtn) clearBtn.classList.remove('hidden');
      initMap(randomProv.lat, randomProv.lon);
      fetchEarthquakes(randomProv.lat, randomProv.lon, `${randomProv.name}, Türkiye`, 'TR');
    } else {
      input.value = kayitliSehir;
      if (clearBtn) clearBtn.classList.remove('hidden');
      initMap(lat, lon);
      fetchEarthquakes(lat, lon, kayitliSehir, kayitliUlke || 'TR');
    }
  } else {
    locateByIP();
  }
}

init();
