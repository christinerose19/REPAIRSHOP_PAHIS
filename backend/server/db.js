import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DB_DIR, 'users.json');

// Ensure DB directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Function to initialize default users
async function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const adminHash = await bcrypt.hash('admin123', 10);
    const customerHash = await bcrypt.hash('customer123', 10);

    const defaultUsers = [
      {
        id: 'U-001',
        fullName: 'Admin User',
        email: 'admin@macmac.com',
        password: adminHash,
        role: 'Admin'
      },
      {
        id: 'U-002',
        fullName: 'Customer User',
        email: 'customer@macmac.com',
        password: customerHash,
        role: 'Customer'
      }
    ];

    fs.writeFileSync(DB_FILE, JSON.stringify({ users: defaultUsers }, null, 2), 'utf8');
  }
}

export async function getUsers() {
  await initDb();
  const data = fs.readFileSync(DB_FILE, 'utf8');
  return JSON.parse(data).users;
}

export async function saveUser(user) {
  await initDb();
  const users = await getUsers();
  users.push(user);
  fs.writeFileSync(DB_FILE, JSON.stringify({ users }, null, 2), 'utf8');
}
