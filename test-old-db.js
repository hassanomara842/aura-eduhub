const mongoose = require('mongoose');

const oldUri = 'mongodb+srv://hassanomara842_db_user:Qaf4SCwHJ1PWQDS3@cluster0.eu9xb94.mongodb.net/aura_eduhub?retryWrites=true&w=majority&appName=Cluster0';

async function checkOldDB() {
  try {
    console.log('Testing connection to OLD database from your local PC...');
    await mongoose.connect(oldUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ SUCCESS! Your local PC can still access the old database!');
    
    // Test fetch
    const db = mongoose.connection.db;
    const count = await db.collection('scholarships').countDocuments();
    console.log(`Found ${count} scholarships in the old database.`);
    
    process.exit(0);
  } catch (err) {
    console.log('❌ Failed to connect:', err.message);
    process.exit(1);
  }
}

checkOldDB();
