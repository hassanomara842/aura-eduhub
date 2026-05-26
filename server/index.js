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
const PORT = 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'baura_jwt_super_secret_2025';
const DB_PATH    = path.join(__dirname, '..', 'db.json');

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
app.use(express.json());

// ── Admin credentials (from .env, hashed at startup) ─────────
const RAW_ADMINS = [
  { username: process.env.ADMIN_USER   || 'admin',   password: process.env.ADMIN_PASS   || 'baura@2025', role: 'مدير' },
  { username: process.env.MANAGER_USER || 'manager', password: process.env.MANAGER_PASS || 'baura@mgr1', role: 'مسئول' },
];

const ADMINS = RAW_ADMINS.map(({ username, password, role }) => ({
  username,
  role,
  passwordHash: bcrypt.hashSync(password, 10),
}));

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

// ══════════════════════════════════════════════════════════════
// ROUTES
// ══════════════════════════════════════════════════════════════

// POST /api/login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'بيانات ناقصة' });

  const admin = ADMINS.find(a => a.username === username.trim());
  if (!admin || !bcrypt.compareSync(password.trim(), admin.passwordHash)) {
    return res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
  }

  const token = jwt.sign({ username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '8h' });
  console.log(`✅ Login: ${admin.username} (${admin.role})`);
  res.json({ token, username: admin.username, role: admin.role });
});

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

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`\n🔐 Auth server → http://localhost:${PORT}`);
  console.log(`   POST   /api/login           (public)`);
  console.log(`   GET    /api/contacts         (JWT required)`);
  console.log(`   POST   /api/contacts         (public)`);
  console.log(`   DELETE /api/contacts/:id     (JWT required)\n`);
});
