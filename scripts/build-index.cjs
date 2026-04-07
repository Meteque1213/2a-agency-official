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
    const label = content.brand || content.name;
    if (label) {
      index[label.toLowerCase()] = content;
    }
  } catch {}
}

fs.writeFileSync(
  path.join(__dirname, '../api/mcp/brand-index.json'),
  JSON.stringify(index)
);

console.log(`Built index: ${Object.keys(index).length} brands`);
