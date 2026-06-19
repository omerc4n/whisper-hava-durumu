const WMO = {
  0:  { tr: 'Açık',            icon: 'sunny' },
  1:  { tr: 'Az Bulutlu',        icon: 'partly_cloudy_day' },
  2:  { tr: 'Parçalı Bulutlu',   icon: 'partly_cloudy_day' },
  3:  { tr: 'Kapalı',            icon: 'cloud' },
  45: { tr: 'Sisli',             icon: 'foggy' },
  48: { tr: 'Kırağı Sis',        icon: 'foggy' },
  51: { tr: 'Hafif Çisenti',     icon: 'grain' },
  53: { tr: 'Orta Çisenti',      icon: 'grain' },
  55: { tr: 'Yoğun Çisenti',     icon: 'grain' },
  61: { tr: 'Hafif Yağmur',      icon: 'rainy' },
  63: { tr: 'Yağmur',            icon: 'rainy' },
  65: { tr: 'Şiddetli Yağmur',   icon: 'rainy' },
  71: { tr: 'Hafif Kar',         icon: 'ac_unit' },
  73: { tr: 'Kar',               icon: 'ac_unit' },
  75: { tr: 'Yoğun Kar',         icon: 'ac_unit' },
  77: { tr: 'Kar Taneleri',      icon: 'ac_unit' },
  80: { tr: 'Sağanak',           icon: 'rainy' },
  81: { tr: 'Orta Sağanak',      icon: 'rainy' },
  82: { tr: 'Şiddetli Sağanak',  icon: 'thunderstorm' },
  85: { tr: 'Karlı Sağanak',     icon: 'ac_unit' },
  86: { tr: 'Yoğun Karlı Sağ.', icon: 'ac_unit' },
  95: { tr: 'Gök Gürültülü',     icon: 'thunderstorm' },
  96: { tr: 'Dolu ile Fırtına',  icon: 'thunderstorm' },
  99: { tr: 'Şiddetli Fırtına',  icon: 'thunderstorm' },
};

const WIND_DIRS = ['K', 'KD', 'D', 'GD', 'G', 'GB', 'B', 'KB'];
const windDir = deg => WIND_DIRS[Math.round(deg / 45) % 8];

const $ = id => document.getElementById(id);

function setLoading(show) {
  $('loading-overlay').style.display = show ? 'flex' : 'none';
}

function showError(msg) {
  const t = $('error-toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 4000);
}

async function fetchWeather(lat, lon, name) {
  // Şehir her başarıyla çağrıldığında hafızaya kaydet (F5 koruması)
  localStorage.setItem('sonSehir', name);
  localStorage.setItem('sonEnlem', lat);
  localStorage.setItem('sonBoylam', lon);

  setLoading(true);
  try {
    const url = new URL('https://api.open-meteo.com/v1/forecast');
    url.searchParams.set('latitude', lat);
    url.searchParams.set('longitude', lon);
    url.searchParams.set('current', 'temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility');
    url.searchParams.set('hourly', 'temperature_2m');
    url.searchParams.set('daily', 'relative_humidity_2m_mean');
    url.searchParams.set('timezone', 'auto');
    url.searchParams.set('forecast_days', '7');
    url.searchParams.set('forecast_hours', '24');

    const res = await fetch(url);
    if (!res.ok) throw new Error('API hatası');
    const data = await res.json();
    render(data, name);
  } catch {
    showError('Hava durumu alınamadı. Lütfen tekrar deneyin.');
  } finally {
    setLoading(false);
  }
}

function render(data, name) {
  const c = data.current;
  const wmo = WMO[c.weather_code] ?? { tr: 'Bilinmiyor', icon: 'cloud' };

  $('temp-value').innerHTML = `${Math.round(c.temperature_2m)}<span class="text-primary-fixed-dim">°C</span>`;
  $('condition-text').innerHTML = `<span class="material-symbols-outlined text-sm">${wmo.icon}</span>${wmo.tr}`;
  $('about-title').textContent = name;
  $('about-text').textContent = `${wmo.tr} hava koşulları. Sıcaklık ${Math.round(c.temperature_2m)}°C.`;
  $('header-title').textContent = name.toUpperCase();

  $('humidity-value').innerHTML = `${c.relative_humidity_2m}<span class="text-primary/60 text-lg ml-1">%</span>`;
  $('humidity-bar').style.width = `${c.relative_humidity_2m}%`;

  $('wind-value').innerHTML = `${Math.round(c.wind_speed_10m)}<span class="text-secondary/60 text-lg ml-1">km/s</span>`;
  $('wind-dir').textContent = `Yön: ${windDir(c.wind_direction_10m)}`;

  $('pressure-value').innerHTML = `${Math.round(c.surface_pressure)}<span class="text-tertiary/60 text-lg ml-1">hPa</span>`;

  const visKm = c.visibility != null ? (c.visibility / 1000).toFixed(1) : '--';
  $('visibility-value').innerHTML = `${visKm}<span class="text-on-surface/60 text-lg ml-1">km</span>`;

  renderTempChart(data.hourly);
  renderHumidityBars(data.daily);
}

function renderTempChart(hourly) {
  const temps = hourly.temperature_2m.slice(0, 24);
  const times = hourly.time.slice(0, 24);
  const W = 400, H = 120, pad = 10;
  const min = Math.min(...temps);
  const max = Math.max(...temps);
  const range = max - min || 1;

  const pts = temps.map((t, i) => {
    const x = pad + (i / (temps.length - 1)) * (W - pad * 2);
    const y = H - pad - ((t - min) / range) * (H - pad * 2);
    return [x, y];
  });

  const polyPts = pts.map(p => p.join(',')).join(' ');
  const fillPts = [...pts.map(p => p.join(',')), `${W - pad},${H}`, `${pad},${H}`].join(' ');

  // Her bir saat noktasını SVG içinde bir "dot" olarak çiziyoruz.
  // Bu dot'lar üzerine geldiğinde tooltip açılacak.
  const dots = pts.map(([x, y], i) =>
    `<circle cx="${x}" cy="${y}" r="4" fill="#89ceff" opacity="0.85" data-index="${i}" class="temp-dot" style="cursor:pointer;"/>`
  ).join('');

  const chartSvg = $('temp-chart');
  chartSvg.innerHTML = `
    <defs>
      <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#89ceff" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#89ceff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="${fillPts}" fill="url(#tg)"/>
    <polyline points="${polyPts}" fill="none" stroke="#89ceff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
  `;

  const tooltip = $('chart-tooltip');
  const chartWrapper = chartSvg.parentElement;

  // Her temp-dot için mouse enter / leave olayları ekliyoruz.
  // Böylece kullanıcı fareyi noktaya taşıdığında saat ve sıcaklık gösterilecek.
  chartSvg.querySelectorAll('circle.temp-dot').forEach(circle => {
    circle.addEventListener('mouseenter', () => {
      const index = Number(circle.dataset.index);
      const temp = temps[index];
      const hour = times[index].split('T')[1].slice(0, 5);
      tooltip.innerHTML = `
        <span class="font-label-mono text-[10px] text-outline uppercase">${hour}</span>
        <span class="font-headline-md">${Math.round(temp)}°C</span>
      `;

      const svgRect = chartSvg.getBoundingClientRect();
      const wrapperRect = chartWrapper.getBoundingClientRect();
      const x = (Number(circle.getAttribute('cx')) / W) * svgRect.width;
      const left = Math.min(Math.max(x, 30), wrapperRect.width - 30);

      tooltip.style.left = `${left}px`;
      tooltip.classList.remove('hidden');
      tooltip.classList.add('opacity-100');
    });

    circle.addEventListener('mouseleave', () => {
      tooltip.classList.add('hidden');
      tooltip.classList.remove('opacity-100');
    });
  });

  $('chart-labels').innerHTML = times
    .filter((_, i) => i % 4 === 0)
    .map(t => `<span>${t.split('T')[1].slice(0, 5)}</span>`)
    .join('');
}

function renderHumidityBars(daily) {
  const humids = daily.relative_humidity_2m_mean;
  const dates = daily.time;
  const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
  const maxH = Math.max(...humids) || 1;

  $('daily-humidity').innerHTML = humids.map((h, i) => {
    const day = days[new Date(dates[i]).getDay()];
    const pct = (h / maxH) * 100;
    return `
      <div class="flex flex-col items-center gap-1 flex-1">
        <span class="font-label-mono text-[10px] text-on-surface-variant">${Math.round(h)}%</span>
        <div class="w-full flex items-end justify-center" style="height:80px">
          <div class="w-full rounded-t bg-primary/60 transition-all duration-700" style="height:${pct}%"></div>
        </div>
        <span class="font-label-mono text-[10px] text-outline uppercase">${day}</span>
      </div>
    `;
  }).join('');
}

async function searchCities(q) {
  if (q.length < 2) return [];
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=tr&format=json&countryCode=TR`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

function renderDropdown(results) {
  const box = $('search-results');
  if (!results.length) { box.classList.add('hidden'); return; }
  box.innerHTML = results.map(r => {
    const label = r.admin1 ? `${r.name}, ${r.admin1}` : r.name;
    return `<button class="w-full text-left px-4 py-3 hover:bg-surface-container-high font-label-mono text-sm text-on-surface border-b border-white/5 last:border-0 transition-colors" data-lat="${r.latitude}" data-lon="${r.longitude}" data-name="${label}">
      <span class="text-primary">${r.name}</span>${r.admin1 ? `<span class="text-outline ml-2 text-[11px]">${r.admin1}</span>` : ''}
    </button>`;
  }).join('');
  box.classList.remove('hidden');
}

function init() {
  setLoading(false);

  const input = $('search-input');
  const results = $('search-results');
  let timer;

  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (q.length < 2) { results.classList.add('hidden'); return; }
    timer = setTimeout(async () => renderDropdown(await searchCities(q)), 300);
  });

  results.addEventListener('click', e => {
    const btn = e.target.closest('button[data-lat]');
    if (!btn) return;
    input.value = btn.dataset.name;
    results.classList.add('hidden');
    fetchWeather(btn.dataset.lat, btn.dataset.lon, btn.dataset.name);
  });

  document.addEventListener('click', e => {
    if (!$('search-wrapper').contains(e.target)) results.classList.add('hidden');
  });

  $('location-btn').addEventListener('click', () => {
    if (!navigator.geolocation) { showError('Tarayıcınız konumu desteklemiyor.'); return; }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=tr`
          );
          const d = await res.json();
          const city = d.address?.city ?? d.address?.town ?? d.address?.village ?? d.address?.county ?? 'Konumunuz';
          fetchWeather(latitude, longitude, city);
        } catch {
          fetchWeather(latitude, longitude, 'Konumunuz');
        }
      },
      err => {
        setLoading(false);
        showError(err.code === err.PERMISSION_DENIED ? 'Konum izni reddedildi.' : 'Konum alınamadı.');
      }
    );
  });

  // Tarayıcı hafızasını (localStorage) kontrol eden bölüm
  const kayitliSehir = localStorage.getItem('sonSehir');
  const kayitliEnlem = localStorage.getItem('sonEnlem');
  const kayitliBoylam = localStorage.getItem('sonBoylam');

  if (kayitliSehir && kayitliEnlem && kayitliBoylam) {
    fetchWeather(parseFloat(kayitliEnlem), parseFloat(kayitliBoylam), kayitliSehir);
  } else {
    fetchWeather(41.0082, 28.9784, 'İstanbul');
  }
}

// Uygulamayı tek bir kez başlatıyoruz
init();
