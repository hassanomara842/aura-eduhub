const REPLIT_URL = 'https://aura-eduhub--hassanomara842.replit.app';

// ── Scholarships ──────────────────
const API_URL = import.meta.env.VITE_SCHOLARSHIPS_API || `${REPLIT_URL}/scholarships`;

// ── Contacts (Express auth server — protected) ────────────────
const AUTH_SERVER = import.meta.env.VITE_AUTH_API || REPLIT_URL;

// Helper: get JWT token from session
function getAuthHeaders() {
  try {
    const saved = sessionStorage.getItem('baura_admin');
    if (!saved) return { 'Content-Type': 'application/json' };
    const { token } = JSON.parse(saved);
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

// ── Scholarships API ─────────────────────────────────────────
export const getScholarships = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Failed to fetch scholarships');
  return res.json();
};

export const getScholarshipById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch scholarship');
  return res.json();
};

export const createScholarship = async (data) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create scholarship');
  return res.json();
};

export const updateScholarship = async (id, data) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update scholarship');
  return res.json();
};

export const deleteScholarship = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete scholarship');
  return res.json();
};

// ── Contacts API (JWT protected) ─────────────────────────────
export const getContacts = async () => {
  const res = await fetch(`${AUTH_SERVER}/api/contacts`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch contacts');
  return res.json();
};

export const createContact = async (data) => {
  // Public — no auth needed (contact form submissions)
  const res = await fetch(`${AUTH_SERVER}/api/contacts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit contact');
  return res.json();
};

export const deleteContact = async (id) => {
  const res = await fetch(`${AUTH_SERVER}/api/contacts/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete contact');
  return res.json();
};
