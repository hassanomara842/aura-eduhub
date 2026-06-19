/* eslint-disable no-undef */
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import nodemailer from 'nodemailer';

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
const PORT = process.env.PORT || 5005;
const JWT_SECRET = process.env.JWT_SECRET || 'baura_jwt_super_secret_2025';
const MONGO_URI = process.env.MONGO_URI;
const DB_PATH = path.join(__dirname, '..', 'db.json');

const allowedOrigins = [
  'https://aura-eduhub.me',
  'https://www.aura-eduhub.me',
  'https://aura-eduhub.netlify.app', 
  'http://localhost:5000', 
  'http://127.0.0.1:5000',
  'http://localhost:5173'
];

const strictCors = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    return callback(new Error('Unauthorized Origin'));
  }
});

// Allow any origin to report theft, but strictly lock everything else
app.use('/api/report-theft', cors());
app.use(strictCors);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const opts = {
      serverSelectionTimeoutMS: 5000,
      family: 4 // Force IPv4, crucial for Vercel + MongoDB Free Tier
    };
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log('✅ Connected to MongoDB Atlas (Vercel Mode)');
      migrateDataIfNeeded();
      return mongoose;
    }).catch(err => {
      console.error('❌ MongoDB Connection Error:', err);
      global.dbError = err.message;
      throw err;
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Connect immediately but also allow route handlers to await it if needed
connectDB().catch(console.error);


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
           // eslint-disable-next-line no-unused-vars
           const { id, ...rest } = c;
           return rest;
        });
        await Contact.insertMany(contactsToMigrate);
        console.log(`✅ Migrated ${oldDB.contacts.length} contacts.`);
      }

      console.log('🎉 Migration completed successfully!');
    }
  } catch (err) {
    console.error('❌ Migration error:', err);
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
  } catch (err) {
    res.status(500).json({ error: err.message });
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Contacts API ──────────────────────────────────────────────

app.get('/api/contacts', verifyToken, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    // Map _id to id for frontend compatibility
    res.json(contacts.map(c => ({ ...c.toObject(), id: c._id.toString() })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Email Notification Helper ──────────────────────────────
async function sendEmailNotification(subject, htmlContent) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  // Always send to Hassan's email as requested
  const targetEmail = 'hassanomara842@gmail.com'; 
  
  if (!emailUser || !emailPass) {
    console.log('❌ Email secrets (EMAIL_USER or EMAIL_PASS) are missing in process.env!');
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass
      }
    });

    await transporter.sendMail({
      from: `"Aura EduHub Alerts" <${emailUser}>`,
      to: targetEmail,
      subject: subject,
      html: htmlContent
    });
    
    console.log(`✅ Email notification sent: ${subject}`);
  } catch (err) {
    console.error('❌ Failed to send Email (Network/Auth error):', err.message);
  }
}

app.post('/api/report-theft', async (req, res) => {
  try {
    const { domain, url, time } = req.body;
    
    const subject = `🚨 إنذار سرقة الكود المصدري! - ${domain}`;
    const html = `
      <div style="direction: rtl; font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ff0000; border-radius: 10px; background-color: #fff0f0;">
        <h2 style="color: red;">🚨 إنذار سرقة الكود المصدري! 🚨</h2>
        <p>لقد تم اكتشاف أن الواجهة الأمامية لموقعك يتم تشغيلها على نطاق (Domain) غير مصرح به.</p>
        <hr />
        <ul>
          <li><strong>النطاق المخالف:</strong> ${domain}</li>
          <li><strong>الرابط الكامل:</strong> <a href="${url}">${url}</a></li>
          <li><strong>وقت الاختراق:</strong> ${time}</li>
        </ul>
        <p><em>تم تدمير واجهة الموقع بنجاح لدى المخترق.</em></p>
      </div>
    `;
    
    sendEmailNotification(subject, html);
    res.json({ status: 'reported' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/test-email', async (req, res) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailUser || !emailPass) {
    return res.json({ error: 'يجب إضافة EMAIL_USER و EMAIL_PASS في ملف .env أولاً' });
  }
  try {
    await sendEmailNotification('رسالة تجريبية - Aura EduHub', '<div style="direction: rtl;"><h3>✅ مبروك!</h3><p>نظام إرسال الإيميلات يعمل بنجاح في السيرفر.</p></div>');
    res.json({ success: true, message: 'تم إرسال إيميل تجريبي، يرجى مراجعة صندوق الوارد الخاص بك.' });
  } catch (err) {
    res.json({ error: 'فشل في إرسال الإيميل', details: err.message });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    console.log(`📩 New contact: ${newContact.name}`);
    
    // Send Email notification in the background
    const subject = `طلب تواصل جديد من: ${newContact.name}`;
    const html = `
      <div style="direction: rtl; font-family: Arial, sans-serif;">
        <h3 style="color: #2c3e50;">🔔 طلب تواصل جديد</h3>
        <ul style="list-style-type: none; padding: 0;">
          <li style="margin-bottom: 10px;">👤 <b>الاسم:</b> ${newContact.name}</li>
          <li style="margin-bottom: 10px;">📞 <b>الهاتف:</b> ${newContact.phone}</li>
          <li style="margin-bottom: 10px;">📧 <b>الإيميل:</b> ${newContact.email}</li>
          <li style="margin-bottom: 10px;">💼 <b>الخدمة:</b> ${newContact.service || 'استفسار عام'}</li>
        </ul>
        <div style="background-color: #f9f9f9; padding: 15px; border-right: 4px solid #3498db;">
          <b>💬 الرسالة:</b><br/>
          ${newContact.message ? newContact.message.replace(/\n/g, '<br/>') : 'لا يوجد'}
        </div>
      </div>
    `;
    sendEmailNotification(subject, html);
    
    res.status(201).json({ ...newContact.toObject(), id: newContact._id.toString() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/contacts/:id', verifyToken, async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    console.log(`🗑️  Deleted contact: ${req.params.id}`);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Scholarships API ──────────────────────────────────────────

app.get('/scholarships', async (req, res) => {
  try {
    const scholarships = await Scholarship.find().sort({ createdAt: -1 });
    res.json(scholarships.map(s => ({ ...s.toObject(), id: s.id })));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/scholarships/:id', async (req, res) => {
  try {
    const scholarship = await Scholarship.findOne({ id: req.params.id });
    if (!scholarship) return res.status(404).json({ error: 'Not found' });
    res.json(scholarship);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/scholarships', verifyToken, async (req, res) => {
  try {
    const newScholarship = new Scholarship({ ...req.body, id: Date.now().toString() });
    await newScholarship.save();
    res.status(201).json(newScholarship);
  } catch (err) {
    console.error('❌ POST /scholarships error:', err.message);
    res.status(500).json({ error: 'Server error', details: err.message });
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/scholarships/:id', verifyToken, async (req, res) => {
  try {
    await Scholarship.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/api/health', (_, res) => {
  let hostname = 'unknown';
  try {
    if (process.env.MONGO_URI) {
      hostname = new URL(process.env.MONGO_URI).hostname;
    }
  } catch (e) { hostname = 'invalid-url'; }
  res.json({ status: 'ok', dbState: mongoose.connection.readyState, hostname, error: global.dbError });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});
