// WeatherAPI key - .env dosyasından çek
const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const $ = id => document.getElementById(id);

function convertTo24Hour(time12h) {
  const [time, period] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  hours = parseInt(hours);
  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }
  
  return `${String(hours).padStart(2, '0')}:${minutes}`;
}

function setLoading(show) {
  $('loading-overlay').style.display = show ? 'flex' : 'none';
}

function showError(msg) {
  const t = $('error-toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 4000);
}

async function fetchRainData(lat, lon, name, countryCode = '') {
  // Son konum hafızaya kaydet
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
    const url = new URL('https://api.weatherapi.com/v1/forecast.json');
    url.searchParams.set('key', WEATHER_API_KEY);
    url.searchParams.set('q', `${lat},${lon}`);
    url.searchParams.set('days', '7');
    url.searchParams.set('aqi', 'yes');

    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 403) throw new Error('API Key geçersiz. Lütfen kontrol et.');
      throw new Error(`API hatası: ${res.status}`);
    }
    const data = await res.json();
    render(data, name, countryCode);
  } catch (err) {
    console.error('Rain fetch error:', err);
    showError(err.message || 'Veriler alınamadı. Lütfen tekrar deneyin.');
  } finally {
    setLoading(false);
  }
}

function render(data, name, countryCode = '') {
  const current = data.current;
  const forecast = data.forecast.forecastday;
  
  // Bugün ve yarının saatlik veri
  const todayData = forecast[0];
  const tomorrowData = forecast[1] || { hour: [] };
  const allHourlyData = [...todayData.hour, ...tomorrowData.hour];
  
  // Şu anki saati bul (current.time_epoch'tan veya current.last_updated'tan)
  const now = new Date(current.last_updated);
  const currentHour = now.getHours();
  
  // Şu saattan itibaren 24 saat veri al
  const next24Hours = [];
  for (let i = 0; i < 24; i++) {
    const hourIndex = currentHour + i;
    if (hourIndex < 24) {
      next24Hours.push(todayData.hour[hourIndex]);
    } else {
      next24Hours.push(tomorrowData.hour[hourIndex - 24] || { chance_of_rain: 0, precip_mm: 0, time: '' });
    }
  }
  
  // Yağış verilerini al
  const rainyHours = next24Hours.filter(h => h.precip_mm > 0).length;
  const rainProb = Math.round((rainyHours / 24) * 100);
  const totalPrecipitation = todayData.day.totalprecip_mm;
  const sunrise = convertTo24Hour(todayData.astro.sunrise);
  const sunset = convertTo24Hour(todayData.astro.sunset);
  const maxUV = todayData.day.uv;

  // Ana kart
  $('rain-percent').textContent = `${current.chance_of_rain}%`;
  $('rain-status').innerHTML = current.chance_of_rain > 30 
    ? `<span class="material-symbols-outlined text-sm">rainy</span>Yağmur Bekleniyor` 
    : `<span class="material-symbols-outlined text-sm">sunny</span>Yağmur Yok`;
  
  $('header-title').textContent = `${name.toUpperCase()}`;
  $('location-title').textContent = name;
  $('location-text').textContent = `Yağmur ihtimali: ${current.chance_of_rain}%. Beklenen yağış: ${totalPrecipitation.toFixed(1)}mm. UV: ${maxUV.toFixed(1)}`;

  // İstatistikler
  $('precipitation-value').innerHTML = `${totalPrecipitation.toFixed(1)}<span class="text-secondary/60 text-lg ml-1">mm</span>`;
  $('rain-hours-value').innerHTML = `${rainyHours}<span class="text-tertiary/60 text-lg ml-1">saat</span>`;
  $('max-probability').textContent = `${Math.max(...next24Hours.map(h => h.chance_of_rain))}%`;
  $('avg-probability').textContent = `${Math.round(next24Hours.reduce((sum, h) => sum + h.chance_of_rain, 0) / 24)}%`;
  $('sunrise-value').textContent = sunrise;
  $('sunset-value').textContent = sunset;

  renderRainChart(next24Hours);
  renderHourlyList(next24Hours);
  renderDailyPrecipitation(forecast);
}

function renderHourlyList(hourlyData) {
  $('hourly-list').innerHTML = hourlyData.map((h, i) => {
    const hour = h.time.split(' ')[1].slice(0, 5);
    const hasRain = h.chance_of_rain > 0 ? '✓' : '—';
    return `
      <div class="min-w-[4.75rem] shrink-0 rounded-xl border border-white/10 bg-surface-container/80 p-2 text-center">
        <div class="font-label-mono text-[10px] text-outline uppercase">${hour}</div>
        <div class="font-headline-md text-secondary mt-1">${h.chance_of_rain}%</div>
        <div class="text-[10px] text-on-surface-variant mt-0.5">${h.precip_mm.toFixed(1)}mm ${hasRain}</div>
      </div>
    `;
  }).join('');
}

function renderRainChart(hourlyData) {
  const probs = hourlyData.map(h => h.chance_of_rain);
  const times = hourlyData.map(h => h.time);
  const W = 400, H = 120, pad = 10;
  const min = 0;
  const max = Math.max(...probs, 100);
  const range = max - min || 1;

  const pts = probs.map((p, i) => {
    const x = pad + (i / (probs.length - 1)) * (W - pad * 2);
    const y = H - pad - ((p - min) / range) * (H - pad * 2);
    return [x, y];
  });

  const polyPts = pts.map(p => p.join(',')).join(' ');
  const fillPts = [...pts.map(p => p.join(',')), `${W - pad},${H}`, `${pad},${H}`].join(' ');

  const dots = pts.map(([x, y], i) =>
    `<circle cx="${x}" cy="${y}" r="4" fill="#ddb7ff" opacity="0.85" data-index="${i}" class="rain-dot" style="cursor:pointer;"/>`
  ).join('');

  const chartSvg = $('rain-chart');
  chartSvg.innerHTML = `
    <defs>
      <linearGradient id="rg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ddb7ff" stop-opacity="0.35"/>
        <stop offset="100%" stop-color="#ddb7ff" stop-opacity="0"/>
      </linearGradient>
    </defs>
    <polygon points="${fillPts}" fill="url(#rg)"/>
    <polyline points="${polyPts}" fill="none" stroke="#ddb7ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${dots}
  `;

  const tooltip = $('chart-tooltip');
  const chartWrapper = chartSvg.parentElement;

  chartSvg.querySelectorAll('circle.rain-dot').forEach(circle => {
    circle.addEventListener('mouseenter', () => {
      const index = Number(circle.dataset.index);
      const prob = probs[index];
      const hour = times[index].split(' ')[1].slice(0, 5);
      tooltip.innerHTML = `
        <span class="font-label-mono text-[10px] text-outline uppercase">${hour}</span>
        <span class="font-headline-md">${prob}%</span>
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
    .map(t => `<span>${t.split(' ')[1].slice(0, 5)}</span>`)
    .join('');
}

function renderDailyPrecipitation(forecast) {
  const maxP = Math.max(...forecast.map(d => d.day.totalprecip_mm)) || 1;

  $('daily-precipitation').innerHTML = forecast.slice(0, 7).map((day, i) => {
    const date = new Date(day.date);
    const days = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];
    const dayName = days[date.getDay()];
    const p = day.day.totalprecip_mm;
    const pct = (p / maxP) * 100;
    return `
      <div class="flex flex-col items-center gap-1 flex-1">
        <span class="font-label-mono text-[10px] text-on-surface-variant">${p.toFixed(1)}mm</span>
        <div class="w-full flex items-end justify-center" style="height:80px">
          <div class="w-full rounded-t bg-secondary/60 transition-all duration-700" style="height:${pct}%"></div>
        </div>
        <span class="font-label-mono text-[10px] text-outline uppercase">${dayName}</span>
      </div>
    `;
  }).join('');
}

async function searchCities(q) {
  if (q.length < 2) return [];
  try {
    // Open-Meteo geocoding API (Türkçe şehir araması)
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=8&language=tr&format=json`;
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

  // 1. freeipapi.com (HTTPS, free, reliable)
  try {
    const freeip = await fetch('https://freeipapi.com/api/json');
    if (freeip.ok) {
      const data = await freeip.json();
      if (data.latitude && data.longitude) {
        lat = Number(data.latitude);
        lon = Number(data.longitude);
        name = data.cityName || data.regionName || data.countryName || 'Konumunuz';
        countryCode = data.countryCode;
      }
    }
  } catch (e) {
    console.warn('freeipapi failed:', e);
  }

  // 2. ipapi.co (HTTPS, free, rate-limited)
  if (!lat || !lon) {
    try {
      const ipapi = await fetch('https://ipapi.co/json/');
      if (ipapi.ok) {
        const data = await ipapi.json();
        if (data.latitude && data.longitude) {
          lat = Number(data.latitude);
          lon = Number(data.longitude);
          name = data.city || data.region || data.country_name || 'Konumunuz';
          countryCode = data.country_code;
        }
      }
    } catch (e) {
      console.warn('ipapi.co failed:', e);
    }
  }

  // 3. db-ip.com city resolution + geocoding (HTTPS, free, very high limits)
  if (!lat || !lon) {
    try {
      const dbip = await fetch('https://api.db-ip.com/v2/free/self');
      if (dbip.ok) {
        const data = await dbip.json();
        if (data.city) {
          name = data.city;
          countryCode = data.countryCode || 'TR';
          // Resolve coordinates using Open-Meteo Geocoding
          const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=tr&format=json`;
          const geoRes = await fetch(geoUrl);
          if (geoRes.ok) {
            const geoData = await geoRes.json();
            if (geoData.results && geoData.results.length > 0) {
              const res = geoData.results[0];
              lat = res.latitude;
              lon = res.longitude;
              name = res.admin1 ? `${res.name}, ${res.admin1}` : res.name;
            }
          }
        }
      }
    } catch (e) {
      console.warn('db-ip failed:', e);
    }
  }

  // Fallback to default
  if (!lat || !lon) {
    console.warn('All geolocation APIs failed. Using fallback location (Istanbul).');
    lat = 41.0082;
    lon = 28.9784;
    name = 'İstanbul, Türkiye';
    countryCode = 'TR';
  }

  const input = $('search-input');
  if (input) input.value = name;

  fetchRainData(lat, lon, name, countryCode ?? 'TR');
}

function renderDropdown(results) {
  const box = $('search-results');
  if (!results.length) { box.classList.add('hidden'); return; }
  box.innerHTML = results.map(r => {
    const label = r.admin1 ? `${r.name}, ${r.admin1}` : r.name;
    return `<button class="w-full text-left px-4 py-3 hover:bg-surface-container-high font-label-mono text-sm text-on-surface border-b border-white/5 last:border-0 transition-colors" data-lat="${r.latitude}" data-lon="${r.longitude}" data-name="${label}" data-country="${r.country_code || ''}">
      <span class="text-secondary">${r.name}</span>${r.admin1 ? `<span class="text-outline ml-2 text-[11px]">${r.admin1}</span>` : ''}
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
    fetchRainData(
      parseFloat(btn.dataset.lat), 
      parseFloat(btn.dataset.lon), 
      btn.dataset.name, 
      btn.dataset.country
    );
  });

  document.addEventListener('click', e => {
    if (!$('search-wrapper').contains(e.target)) results.classList.add('hidden');
  });

  // Tarayıcı hafızasını kontrol et
  const kayitliSehir = localStorage.getItem('sonSehir');
  const kayitliEnlem = localStorage.getItem('sonEnlem');
  const kayitliBoylam = localStorage.getItem('sonBoylam');
  const kayitliUlke = localStorage.getItem('sonUlke');

  if (kayitliSehir && kayitliEnlem && kayitliBoylam) {
    if (input) input.value = kayitliSehir;
    fetchRainData(
      parseFloat(kayitliEnlem),
      parseFloat(kayitliBoylam),
      kayitliSehir,
      kayitliUlke || ''
    );
  } else {
    locateByIP();
  }
}

init();

const currentYearElement = document.getElementById('current-year');
if (currentYearElement) {
  const bugun = new Date();
  currentYearElement.textContent = bugun.toLocaleDateString('tr-TR');
}

// Modern Animated Cursor Follower (Nokta ve onu takip eden halka) - Sadece masaüstü
(function() {
  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!isDesktop) return;

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
