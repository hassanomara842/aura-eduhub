import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Load .env manually (dotenv doesn't support ESM well without extra config)
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Simple .env parser
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
// Render assigns a port via process.env.PORT
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'baura_jwt_super_secret_2025';
const DB_PATH    = path.join(__dirname, '..', 'db.json');

// Allow CORS from any origin for production
app.use(cors());
app.use(express.json());

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

// ── DB helpers ────────────────────────────────────────────────
const readDB  = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');

// ── Initialize Admins in DB ───────────────────────────────────
function initAdmins() {
  const db = readDB();
  if (!db.admins || db.admins.length === 0) {
    db.admins = [
      { username: process.env.ADMIN_USER   || 'admin',   passwordHash: bcrypt.hashSync(process.env.ADMIN_PASS   || 'baura@2025', 10), role: 'مدير' },
      { username: process.env.MANAGER_USER || 'manager', passwordHash: bcrypt.hashSync(process.env.MANAGER_PASS || 'baura@mgr1', 10), role: 'مسئول' },
    ];
    writeDB(db);
    console.log('✅ Admins initialized in database');
  }
}
initAdmins();

// ══════════════════════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════════════════════

// POST /api/login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'بيانات ناقصة' });

  const db = readDB();
  const admin = (db.admins || []).find(a => a.username === username.trim());
  if (!admin || !bcrypt.compareSync(password.trim(), admin.passwordHash)) {
    return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
  }

  const token = jwt.sign({ username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '8h' });
  console.log(`✅ Login: ${admin.username} (${admin.role})`);
  res.json({ token, username: admin.username, role: admin.role });
});

// PUT /api/admin/credentials — Change Username & Password
app.put('/api/admin/credentials', verifyToken, (req, res) => {
  const { currentPassword, newUsername, newPassword } = req.body;
  if (!currentPassword || !newUsername || !newPassword) {
    return res.status(400).json({ error: 'بيانات ناقصة' });
  }

  const db = readDB();
  const adminIndex = db.admins.findIndex(a => a.username === req.user.username);
  if (adminIndex === -1) return res.status(404).json({ error: 'المستخدم غير موجود' });

  const admin = db.admins[adminIndex];
  if (!bcrypt.compareSync(currentPassword, admin.passwordHash)) {
    return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });
  }

  // Update credentials
  db.admins[adminIndex].username = newUsername.trim();
  db.admins[adminIndex].passwordHash = bcrypt.hashSync(newPassword.trim(), 10);
  writeDB(db);

  console.log(`🔒 Credentials updated for: ${newUsername}`);
  res.json({ success: true, message: 'تم تحديث البيانات بنجاح' });
});

// ── Contacts API ──────────────────────────────────────────────

// GET /api/contacts — JWT required
app.get('/api/contacts', verifyToken, (req, res) => {
  res.json(readDB().contacts || []);
});

// POST /api/contacts — public (from contact form)
app.post('/api/contacts', (req, res) => {
  const db = readDB();
  const newContact = {
    id: Date.now().toString(),
    ...req.body,
    submittedAt: new Date().toISOString(),
    status: 'جديد',
  };
  db.contacts = [...(db.contacts || []), newContact];
  writeDB(db);
  console.log(`📩 New contact: ${newContact.name}`);
  res.status(201).json(newContact);
});

// DELETE /api/contacts/:id — JWT required
app.delete('/api/contacts/:id', verifyToken, (req, res) => {
  const db = readDB();
  db.contacts = (db.contacts || []).filter(c => c.id !== req.params.id);
  writeDB(db);
  console.log(`🗑️  Deleted contact: ${req.params.id}`);
  res.json({ success: true });
});

// ── Scholarships API (replaces json-server) ───────────────────

app.get('/scholarships', (req, res) => {
  res.json(readDB().scholarships || []);
});

app.get('/scholarships/:id', (req, res) => {
  const scholarship = (readDB().scholarships || []).find(s => s.id === req.params.id);
  if (!scholarship) return res.status(404).json({ error: 'Not found' });
  res.json(scholarship);
});

app.post('/scholarships', verifyToken, (req, res) => {
  const db = readDB();
  const newScholarship = { id: Date.now().toString(), ...req.body };
  db.scholarships = [...(db.scholarships || []), newScholarship];
  writeDB(db);
  res.status(201).json(newScholarship);
});

app.put('/scholarships/:id', verifyToken, (req, res) => {
  const db = readDB();
  const index = (db.scholarships || []).findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.scholarships[index] = { ...db.scholarships[index], ...req.body };
  writeDB(db);
  res.json(db.scholarships[index]);
});

app.delete('/scholarships/:id', verifyToken, (req, res) => {
  const db = readDB();
  db.scholarships = (db.scholarships || []).filter(s => s.id !== req.params.id);
  writeDB(db);
  res.json({ success: true });
});

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});
