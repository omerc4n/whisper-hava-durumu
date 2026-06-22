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

async function fetchWeather(lat, lon, name, countryCode = '') {
  // Şehir her başarıyla çağrıldığında hafızaya kaydet (F5 koruması)
  localStorage.setItem('sonSehir', name);
  localStorage.setItem('sonEnlem', lat);
  localStorage.setItem('sonBoylam', lon);
  if (countryCode) {
    localStorage.setItem('sonUlke', countryCode.toUpperCase());
  } else {
    localStorage.removeItem('sonUlke');
  }

  const input = $('search-input');
  if (input) {
    input.value = name;
  }

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
    render(data, name, countryCode);
  } catch {
    showError('Hava durumu alınamadı. Lütfen tekrar deneyin.');
  } finally {
    setLoading(false);
  }
}

function render(data, name, countryCode = '') {
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
  renderHourlyList(data.hourly);
  renderHumidityBars(data.daily);
}

function renderHourlyList(hourly) {
  const temps = hourly.temperature_2m.slice(0, 24);
  const times = hourly.time.slice(0, 24);

  $('hourly-list').innerHTML = temps.map((temp, i) => {
    const hour = times[i].split('T')[1].slice(0, 5);
    return `
      <div class="min-w-[4.75rem] shrink-0 rounded-xl border border-white/10 bg-surface-container/80 p-2 text-center">
        <div class="font-label-mono text-[10px] text-outline uppercase">${hour}</div>
        <div class="font-headline-md text-white mt-1">${Math.round(temp)}°</div>
      </div>
    `;
  }).join('');
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
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=tr&format=json`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results ?? [];
  } catch {
    return [];
  }
}

async function locateByIP() {
  setLoading(true);
  let lat, lon, name, countryCode;

  try {
    const ipwho = await fetch('https://ipwho.is/?lang=tr');
    const ipwhoData = await ipwho.json();
    if (ipwhoData.success) {
      lat = Number(ipwhoData.latitude);
      lon = Number(ipwhoData.longitude);
      name = ipwhoData.city || ipwhoData.region || ipwhoData.country || 'Konumunuz';
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
        lat = Number(freeipData.latitude);
        lon = Number(freeipData.longitude);
        name = freeipData.cityName || freeipData.regionName || freeipData.countryName || 'Konumunuz';
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
        lat = Number(ipapiData.latitude);
        lon = Number(ipapiData.longitude);
        name = ipapiData.city || ipapiData.region || ipapiData.country_name || 'Konumunuz';
        countryCode = ipapiData.country_code;
      }
    } catch (e) {
      console.warn('ipapi.co failed:', e);
    }
  }

  if (!lat || !lon) {
    console.warn('All geolocation APIs failed. Using fallback location (Istanbul).');
    lat = 41.0082;
    lon = 28.9784;
    name = 'İstanbul, Türkiye';
    countryCode = 'TR';
  }

  const input = $('search-input');
  if (input) input.value = name;

  fetchWeather(lat, lon, name, countryCode ?? 'TR');
}

function renderDropdown(results) {
  const box = $('search-results');
  if (!results.length) { box.classList.add('hidden'); return; }
  box.innerHTML = results.map(r => {
    const label = r.admin1 ? `${r.name}, ${r.admin1}` : r.name;
    return `<button class="w-full text-left px-4 py-3 hover:bg-surface-container-high font-label-mono text-sm text-on-surface border-b border-white/5 last:border-0 transition-colors" data-lat="${r.latitude}" data-lon="${r.longitude}" data-name="${label}" data-country="${r.country_code || ''}">
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
    fetchWeather(btn.dataset.lat, btn.dataset.lon, btn.dataset.name, btn.dataset.country);
  });

  document.addEventListener('click', e => {
    if (!$('search-wrapper').contains(e.target)) results.classList.add('hidden');
  });

  // Tarayıcı hafızasını (localStorage) kontrol eden bölüm
  const kayitliSehir = localStorage.getItem('sonSehir');
  const kayitliEnlem = localStorage.getItem('sonEnlem');
  const kayitliBoylam = localStorage.getItem('sonBoylam');
  const kayitliUlke = localStorage.getItem('sonUlke');

  if (kayitliSehir && kayitliEnlem && kayitliBoylam) {
    if (input) input.value = kayitliSehir;
    fetchWeather(
      parseFloat(kayitliEnlem),
      parseFloat(kayitliBoylam),
      kayitliSehir,
      kayitliUlke || ''
    );
  } else {
    locateByIP();
  }
}

// Uygulamayı tek bir kez başlatıyoruz
init();

// Sayfadaki 'current-year' ID'li elementi buluyoruz
const currentYearElement = document.getElementById('current-year');

if (currentYearElement) {
  const bugun = new Date();

// Tarihi Türkçe formatına (gün.ay.yıl) çeviriyoruz
  currentYearElement.textContent = bugun.toLocaleDateString('tr-TR');
}

// Modern Animated Cursor Follower (Nokta ve onu takip eden halka)
(function() {
  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';
  const ring = document.createElement('div');
  ring.className = 'custom-cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mouseX = -100;
  let mouseY = -100;
  let hasMoved = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    if (!hasMoved) {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
      hasMoved = true;
    }

    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    hasMoved = false;
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });

  document.addEventListener('mouseover', (e) => {
    // Input alanları ve textarealarda imleci gizle, default text imlecine izin ver
    const isInput = e.target.closest('input, textarea, select');
    if (isInput && (isInput.type === 'text' || isInput.type === 'search' || isInput.tagName === 'TEXTAREA')) {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    } else {
      if (hasMoved) {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }
    }

    // Hover durumlarında halkayı büyüt
    const target = e.target.closest('a, button, [role="button"], select, .cursor-pointer, .temp-dot, .rain-dot');
    if (target) {
      ring.classList.add('custom-cursor-hover');
    } else {
      ring.classList.remove('custom-cursor-hover');
    }
  });
})();