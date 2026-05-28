import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

// Models
import Admin from './models/Admin.js';
import Contact from './models/Contact.js';
import Scholarship from './models/Scholarship.js';

// Load .env manually
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

function loadEnv(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const [key, ...rest] = trimmed.split('=');
      if (key && rest.length) {
        process.env[key.trim()] = rest.join('=').trim();
      }
    });
  } catch {
    // .env file not found — use defaults
  }
}
loadEnv(path.join(__dirname, '.env'));

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'baura_jwt_super_secret_2025';
const MONGO_URI = process.env.MONGO_URI;
const DB_PATH = path.join(__dirname, '..', 'db.json');

app.use(cors());
app.use(express.json());

// ── MongoDB Connection ─────────────────────────────────────────
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    migrateDataIfNeeded();
  })
  .catch(err => console.error('❌ MongoDB Connection Error:', err));


// ── Migration Logic ───────────────────────────────────────────
async function migrateDataIfNeeded() {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0 && fs.existsSync(DB_PATH)) {
      console.log('🔄 First run detected. Migrating data from db.json to MongoDB...');
      const oldDB = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

      // Migrate Admins
      if (oldDB.admins && oldDB.admins.length > 0) {
        await Admin.insertMany(oldDB.admins);
        console.log(`✅ Migrated ${oldDB.admins.length} admins.`);
      } else {
        // Create default if none
        await Admin.create({ username: process.env.ADMIN_USER || 'admin', passwordHash: bcrypt.hashSync(process.env.ADMIN_PASS || 'baura@2025', 10), role: 'مدير' });
      }

      // Migrate Scholarships
      if (oldDB.scholarships && oldDB.scholarships.length > 0) {
        await Scholarship.insertMany(oldDB.scholarships);
        console.log(`✅ Migrated ${oldDB.scholarships.length} scholarships.`);
      }

      // Migrate Contacts
      if (oldDB.contacts && oldDB.contacts.length > 0) {
        // Add timestamp if missing and remove string id for mongo
        const contactsToMigrate = oldDB.contacts.map(c => {
           const { id, ...rest } = c;
           return rest;
        });
        await Contact.insertMany(contactsToMigrate);
        console.log(`✅ Migrated ${oldDB.contacts.length} contacts.`);
      }

      console.log('🎉 Migration completed successfully!');
    }
  } catch (error) {
    console.error('❌ Migration error:', error);
  }
}


// ── JWT Middleware ─────────────────────────────────────────────
function verifyToken(req, res, next) {
  const token = (req.headers['authorization'] || '').split(' ')[1];
  if (!token) return res.status(401).json({ error: 'غير مصرح — Token مطلوب' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token منتهي أو غير صالح' });
    req.user = user;
    next();
  });
}

// ══════════════════════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════════════════════

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({ error: 'بيانات ناقصة' });

    const admin = await Admin.findOne({ username: username.trim() });
    if (!admin || !bcrypt.compareSync(password.trim(), admin.passwordHash)) {
      return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }

    const token = jwt.sign({ username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '8h' });
    console.log(`✅ Login: ${admin.username} (${admin.role})`);
    res.json({ token, username: admin.username, role: admin.role });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/credentials
app.put('/api/admin/credentials', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newUsername, newPassword } = req.body;
    if (!currentPassword || !newUsername || !newPassword) {
      return res.status(400).json({ error: 'بيانات ناقصة' });
    }

    const admin = await Admin.findOne({ username: req.user.username });
    if (!admin) return res.status(404).json({ error: 'المستخدم غير موجود' });

    if (!bcrypt.compareSync(currentPassword, admin.passwordHash)) {
      return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    }

    admin.username = newUsername.trim();
    admin.passwordHash = bcrypt.hashSync(newPassword.trim(), 10);
    await admin.save();

    console.log(`🔒 Credentials updated for: ${newUsername}`);
    res.json({ success: true, message: 'تم تحديث البيانات بنجاح' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Contacts API ──────────────────────────────────────────────

app.get('/api/contacts', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    // Map _id to id for frontend compatibility
    res.json(contacts.map(c => ({ ...c.toObject(), id: c._id.toString() })));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Telegram Notification Helper ──────────────────────────────
async function sendTelegramNotification(contact) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  
  if (!token || !chatId) return; // Skip if not configured

  const message = `
🔔 *طلب تواصل جديد*
👤 *الاسم:* ${contact.name}
📞 *الهاتف:* ${contact.phone}
📧 *الإيميل:* ${contact.email}
💼 *الخدمة:* ${contact.service || 'استفسار عام'}
💬 *الرسالة:*
${contact.message || 'لا يوجد'}
  `;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown'
      })
    });
  } catch (err) {
    console.error('❌ Failed to send Telegram notification:', err.message);
  }
}

app.post('/api/contacts', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    console.log(`📩 New contact: ${newContact.name}`);
    
    // Send Telegram notification in the background
    sendTelegramNotification(newContact);
    
    res.status(201).json({ ...newContact.toObject(), id: newContact._id.toString() });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/contacts/:id', verifyToken, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    console.log(`🗑️  Deleted contact: ${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ── Scholarships API ──────────────────────────────────────────

app.get('/scholarships', async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json(scholarships.map(s => ({ ...s.toObject(), id: s.id })));
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/scholarships/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findOne({ id: req.params.id });
    if (!scholarship) return res.status(404).json({ error: 'Not found' });
    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/scholarships', verifyToken, async (req, res) => {
  try {
    const newScholarship = new Scholarship({ ...req.body, id: Date.now().toString() });
    await newScholarship.save();
    res.status(201).json(newScholarship);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/scholarships/:id', verifyToken, async (req, res) => {
  try {
    const scholarship = await Scholarship.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!scholarship) return res.status(404).json({ error: 'Not found' });
    res.json(scholarship);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/scholarships/:id', verifyToken, async (req, res) => {
  try {
    await Scholarship.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});
