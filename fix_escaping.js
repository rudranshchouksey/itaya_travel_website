const fs = require('fs');
const path = require('path');

const filesToFix = [
  'components/cards/DestinationCard.tsx',
  'components/cards/ExperienceCard.tsx',
  'components/cards/ListingCard.tsx',
  'lib/api/destinations.ts',
  'lib/api/experiences.ts',
  'lib/api/listings.ts'
];

filesToFix.forEach(f => {
  const filePath = path.join(__dirname, f);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/\\\`/g, '\`');
    content = content.replace(/\\\$/g, '$');
    fs.writeFileSync(filePath, content);
  }
});
console.log('Fixed escaping issues');
