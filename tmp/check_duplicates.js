const fs = require('fs');
const content = fs.readFileSync('./src/data/mockData.ts', 'utf8');

const items = [];
const blocks = content.split(/id:\s*'/);
for (let i = 1; i < blocks.length; i++) {
  const b = blocks[i];
  const id = b.split("'")[0];
  const nameM = b.match(/name:\s*'([^']+)'/);
  const catM = b.match(/category:\s*'([^']+)'/);
  const imgM = b.match(/\bimage:\s*'([^']+)'/);
  if (id && nameM && imgM) {
    items.push({ id, name: nameM[1], category: catM ? catM[1] : '', image: imgM[1] });
  }
}

console.log('Total items parsed:', items.length);
const seen = new Map();
for (const item of items) {
  if (seen.has(item.image)) {
    console.log('DUPLICATE:', item.image);
    console.log('  First: ', seen.get(item.image));
    console.log('  Second:', item.id, item.name);
  } else {
    seen.set(item.image, item.id + ' ' + item.name);
  }
}
