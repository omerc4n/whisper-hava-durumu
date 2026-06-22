// GEM Global Active Faults'tan Türkiye fay hatlarını filtrele
// + PB2002 tektanik plaka sınırlarını indir (dünya fayları için)
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

function download(url) {
  return new Promise((resolve, reject) => {
    let raw = '';
    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return download(res.headers.location).then(resolve).catch(reject);
      }
      res.on('data', d => { raw += d; process.stdout.write('.'); });
      res.on('end', () => resolve(raw));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  // 1. GEM Global Active Faults (Türkiye filtresi)
  console.log('\n[1/2] GEM active faults indiriliyor...');
  try {
    const raw = await download(
      'https://raw.githubusercontent.com/GEMScienceTools/gem-global-active-faults/master/geojson/gem_active_faults.geojson'
    );
    console.log('\nParsing...');
    const geojson = JSON.parse(raw);
    const trFeatures = geojson.features.filter(featureInTR);
    const out = { type: 'FeatureCollection', features: trFeatures };
    fs.writeFileSync(
      path.join(__dirname, 'src/turkey-faults-full.json'),
      JSON.stringify(out)
    );
    console.log(`✓ Türkiye fay hattı: ${trFeatures.length} adet → src/turkey-faults-full.json`);
  } catch (e) {
    console.error('GEM indirme hatası:', e.message);
  }

  // 2. PB2002 tektanik plaka sınırları (dünya fayları arka plan)
  console.log('\n[2/2] Tektanik plaka sınırları indiriliyor...');
  try {
    const raw2 = await download(
      'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json'
    );
    console.log('\nKaydediliyor...');
    fs.writeFileSync(
      path.join(__dirname, 'src/world-faults.json'),
      raw2
    );
    const wf = JSON.parse(raw2);
    console.log(`✓ Dünya fay sınırları: ${wf.features.length} adet → src/world-faults.json`);
  } catch (e) {
    console.error('PB2002 indirme hatası:', e.message);
  }

  console.log('\nTamamlandı!');
}

main();
