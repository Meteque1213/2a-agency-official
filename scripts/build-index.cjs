const fs = require('fs');
const path = require('path');

const nodeDir = path.join(__dirname, '../node');
const files = fs.readdirSync(nodeDir).filter(f => f.endsWith('.json'));

const index = {};
for (const file of files) {
  try {
    const content = JSON.parse(
      fs.readFileSync(path.join(nodeDir, file), 'utf-8')
    );
    if (typeof content.brand === 'string') {
      index[content.brand.toLowerCase()] = file.replace('.json', '');
    } else if (typeof content.name === 'string') {
      // fallback for Schema.org nodes
      index[content.name.toLowerCase()] = file.replace('.json', '');
    }
  } catch {}
}

fs.writeFileSync(
  path.join(__dirname, '../api/mcp/brand-index.json'),
  JSON.stringify(index, null, 2)
);

console.log(`Built index: ${Object.keys(index).length} brands`);
