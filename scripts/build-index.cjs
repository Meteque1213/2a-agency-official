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
      const lower = label.toLowerCase();
      index[lower] = content;
      // Alias sans accents
      const normalized = lower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (normalized !== lower) index[normalized] = content;
      // Alias avec tirets (espaces → tirets) pour URLs slug-style
      const slugged = normalized.replace(/\s+/g, "-").replace(/[&]/g, "").replace(/-+/g, "-");
      if (slugged !== normalized && slugged !== lower) index[slugged] = content;
      // Alias sans points (f.p.-journe → fp-journe)
      const noDots = slugged.replace(/\./g, "");
      if (noDots !== slugged && noDots !== normalized && noDots !== lower) index[noDots] = content;
      // Alias avec espaces depuis slug (tirets → espaces)
      const spaced = normalized.replace(/-/g, " ");
      if (spaced !== normalized && spaced !== lower) index[spaced] = content;
      // Alias mb-and-f style (&→-and-)
      const andSlug = normalized.replace(/\s*&\s*/g, "-and-").replace(/\s+/g, "-").replace(/-+/g, "-");
      if (andSlug !== slugged && andSlug !== normalized && andSlug !== lower) index[andSlug] = content;
    }
  } catch {}
}

const ts = `// AUTO-GENERATED — do not edit manually
// Run: node scripts/build-index.cjs
export const BRAND_INDEX: Record<string, Record<string, unknown>> = ${JSON.stringify(index)};
`;

fs.writeFileSync(
  path.join(__dirname, '../api/mcp/brand-data.ts'),
  ts
);

console.log(`Built: ${Object.keys(index).length} brands`);
