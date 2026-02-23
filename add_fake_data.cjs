const fs = require('fs');
const content = fs.readFileSync('src/data/properties.ts', 'utf8');

// Seed random for reproducibility
let seed = 12345;
function seededRandom() {
  seed = (seed * 1103515245 + 12345) & 0x7fffffff;
  return seed / 0x7fffffff;
}

// Generate fake data based on existing fields
function generateFakeData(prop) {
  const lotSize = Math.round(3000 + (seededRandom() * 12000) * (1 - (prop.pricePerUnit - 10) / 110));
  const sqft = Math.round(800 + seededRandom() * 3200 * ((prop.pricePerUnit - 10) / 80 + 0.3));
  const yearBuilt = Math.round(2013 - prop.houseAge + (seededRandom() - 0.5) * 2);
  const bedrooms = Math.max(1, Math.min(6, Math.round(sqft / 700 + seededRandom() * 2)));
  const bathrooms = Math.max(1, Math.min(4, Math.round(bedrooms / 1.5 + seededRandom())));
  return { lotSize, sqft, yearBuilt, bedrooms, bathrooms };
}

// Update interface
let updated = content.replace(
  /export interface Property \{[\s\S]*?\}/,
  `export interface Property {
  id: number;
  transactionDate: number;
  houseAge: number;
  distanceToMRT: number;
  convenienceStores: number;
  latitude: number;
  longitude: number;
  pricePerUnit: number;
  lotSize: number;
  sqft: number;
  yearBuilt: number;
  bedrooms: number;
  bathrooms: number;
}`
);

// Find all property objects and add fake data
const propertyRegex = /\{\s*id:\s*(\d+),\s*transactionDate:\s*([\d.]+),\s*houseAge:\s*([\d.]+),\s*distanceToMRT:\s*([\d.]+),\s*convenienceStores:\s*(\d+),\s*latitude:\s*([\d.]+),\s*longitude:\s*([\d.]+),\s*pricePerUnit:\s*([\d.]+)\s*\}/g;

updated = updated.replace(propertyRegex, (match, id, transactionDate, houseAge, distanceToMRT, convenienceStores, latitude, longitude, pricePerUnit) => {
  const prop = { pricePerUnit: parseFloat(pricePerUnit), houseAge: parseFloat(houseAge) };
  const fake = generateFakeData(prop);
  return `{ id: ${id}, transactionDate: ${transactionDate}, houseAge: ${houseAge}, distanceToMRT: ${distanceToMRT}, convenienceStores: ${convenienceStores}, latitude: ${latitude}, longitude: ${longitude}, pricePerUnit: ${pricePerUnit}, lotSize: ${fake.lotSize}, sqft: ${fake.sqft}, yearBuilt: ${fake.yearBuilt}, bedrooms: ${fake.bedrooms}, bathrooms: ${fake.bathrooms} }`;
});

fs.writeFileSync('src/data/properties.ts', updated);
console.log('Properties file updated with fake data!');
