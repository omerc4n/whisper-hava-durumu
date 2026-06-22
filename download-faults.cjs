const https = require('https');
const fs = require('fs');
const path = require('path');

const TR_BOUNDS = { minLon: 25, maxLon: 46, minLat: 35, maxLat: 43 };

function coordInTR(coord) {
  return coord[0] >= TR_BOUNDS.minLon && coord[0] <= TR_BOUNDS.maxLon &&
         coord[1] >= TR_BOUNDS.minLat && coord[1] <= TR_BOUNDS.maxLat;
}

function featureInTR(feature) {
  const geom = feature.geometry;
  if (!geom) return false;
  let coords = [];
  if (geom.type === 'LineString') coords = geom.coordinates;
  else if (geom.type === 'MultiLineString') coords = geom.coordinates.flat();
  return coords.some(c => coordInTR(c));
}

function download(url, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error('Too many redirects'));
    let raw = '';
    const mod = url.startsWith('https') ? https : require('http');
    mod.get(url, { headers: { 'User-Agent': 'Node.js/fault-downloader' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location, redirectCount + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      res.on('data', d => { raw += d; process.stdout.write('.'); });
      res.on('end', () => resolve(raw));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  // 1. GEM Global Active Faults - Türkiye filtresi
  console.log('[1/2] GEM active faults indiriliyor (buyuk dosya, bekleyin)...');
  try {
    const raw = await download(
      'https://raw.githubusercontent.com/GEMScienceTools/gem-global-active-faults/master/geojson/gem_active_faults.geojson'
    );
    console.log('\nParsing...');
    const geojson = JSON.parse(raw);
    const trFeatures = geojson.features.filter(featureInTR);
    fs.writeFileSync(
      path.join(__dirname, 'src/turkey-faults-full.json'),
      JSON.stringify({ type: 'FeatureCollection', features: trFeatures })
    );
    console.log('OK: ' + trFeatures.length + ' TR fay hatti -> src/turkey-faults-full.json');
  } catch (e) {
    console.error('\nGEM hatasi:', e.message);
  }

  // 2. PB2002 tektonik plaka siniri (dunya faylari arka plan)
  console.log('\n[2/2] Tektonik plaka sinirlari indiriliyor...');
  try {
    const raw2 = await download(
      'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'
    );
    console.log('');
    fs.writeFileSync(path.join(__dirname, 'src/world-faults.json'), raw2);
    const wf = JSON.parse(raw2);
    console.log('OK: ' + wf.features.length + ' dunya plaka siniri -> src/world-faults.json');
  } catch (e) {
    console.error('\nPB2002 hatasi:', e.message);
  }

  console.log('\nTamamlandi!');
}

main();
