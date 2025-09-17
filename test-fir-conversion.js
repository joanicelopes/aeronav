// Test script to verify FIR coordinate conversion
const { parseFirPoints } = require('./src/lib/fir-utils.ts');

// Test data from the CSV
const testCsv = `Name;Latitude;Longitude;;;;
MELUT ;160755N;0261600W;;;;
EVKAS ;174003N;0260116W;;;;
ODMEN ;135354N;0242034W;;;;
NATAS ;160024N;0330000W;;;;`;

console.log('Testing FIR coordinate conversion...');
const firPoints = parseFirPoints(testCsv);

console.log('Converted points:');
firPoints.forEach(point => {
  console.log(`${point.name}: ${point.latitude.toFixed(6)}, ${point.longitude.toFixed(6)}`);
});

// Expected results (approximate):
// MELUT: 16.131944, -26.266667
// EVKAS: 17.667500, -26.021111
// ODMEN: 13.898333, -24.342778
// NATAS: 16.006667, -33.000000

