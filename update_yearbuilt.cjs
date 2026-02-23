const fs = require('fs');
let content = fs.readFileSync('src/data/properties.ts', 'utf8');

// Generate random year between 1950-2025
function randomYear() {
  return Math.floor(Math.random() * (2025 - 1950 + 1)) + 1950;
}

// Replace all yearBuilt values with random years between 1950-2025
let count = 0;
content = content.replace(/yearBuilt:\s*\d+/g, () => {
  count++;
  return `yearBuilt: ${randomYear()}`;
});

fs.writeFileSync('src/data/properties.ts', content);
console.log(`Updated ${count} yearBuilt values with random years (1950-2025)`);
