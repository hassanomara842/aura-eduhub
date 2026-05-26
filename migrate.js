import fs from 'fs';
import { scholarshipsData } from './src/data/scholarships.js';

const db = {
  scholarships: scholarshipsData
};

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('Migration complete. Created db.json');
