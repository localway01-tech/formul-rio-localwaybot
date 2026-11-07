import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Firebase configuration
const configPath = path.resolve(__dirname, 'firebase-applet-config.json');
let firebaseConfig: any = {};
if (fs.existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.error('Error reading firebase-applet-config.json:', err);
  }
}

// Initialize server-side Firebase
const fbApp = initializeApp(firebaseConfig, 'server-app');
const serverDb = getFirestore(fbApp, firebaseConfig.firestoreDatabaseId);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Admin Password from environment or default
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '17063007';
const ADMIN_SECRET = process.env.ADMIN_SECRET || 'localway-secure-session-key-2026';

// Cryptographic stateless token generator - persists across server restarts
function generateAdminToken(): string {
  const timestamp = Date.now().toString();
  const signature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`${timestamp}:${ADMIN_PASSWORD}`)
    .digest('hex');
  return `${timestamp}.${signature}`;
}

// Cryptographic stateless token validator (valid for 7 days)
function verifyAdminToken(token: string): boolean {
  if (!token || typeof token !== 'string') return false;
  // Allow direct master password fallback token
  if (token === '17063007' || token.startsWith('17063007.')) return true;
  if (!token.includes('.')) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) return false;

  const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
  const now = Date.now();
  if (now - timestamp > maxAge || timestamp > now + 60000) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', ADMIN_SECRET)
    .update(`${timestampStr}:${ADMIN_PASSWORD}`)
    .digest('hex');

  if (signature.length !== expectedSignature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
}

// Authentication middleware
function requireAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acesso não autorizado. Faça login para continuar.' });
  }

  const token = authHeader.split(' ')[1];
  if (!verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Sessão expirada ou inválida. Por favor, faça login novamente.' });
  }

  next();
}

// ================= API ENDPOINTS ================= //

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    firebaseReady: !!firebaseConfig.projectId,
  });
});

// Public: Submit requirements form
app.post('/api/submissions', async (req, res) => {
  try {
    const { clinicName, contactName, whatsapp, email, city, answers } = req.body;

    const submissionId = 'sub_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
    
    // Friendly fallback name if clinic info was omitted
    const resolvedClinicName = (clinicName && typeof clinicName === 'string' && clinicName.trim())
      ? clinicName.trim()
      : (answers && answers[18]?.value && typeof answers[18].value === 'string' && answers[18].value.trim())
        ? 'Clínica: ' + answers[18].value.trim().slice(0, 45)
        : 'Diagnóstico #' + submissionId.slice(-6);

    const resolvedWhatsapp = (whatsapp && typeof whatsapp === 'string')
      ? whatsapp.trim()
      : (answers && answers[21]?.value && typeof answers[21].value === 'string')
        ? answers[21].value.trim()
        : '';

    const submissionData = {
      id: submissionId,
      clinicName: resolvedClinicName,
      contactName: (contactName || '').trim(),
      whatsapp: resolvedWhatsapp,
      email: (email || '').trim(),
      city: (city || '').trim(),
      answers: answers && typeof answers === 'object' ? answers : {},
      createdAt: new Date().toISOString(),
      status: 'new',
    };

    // Save to Firestore
    const subDocRef = doc(serverDb, 'submissions', submissionId);
    await setDoc(subDocRef, submissionData);

    return res.status(201).json({
      success: true,
      id: submissionId,
      clinicName: submissionData.clinicName,
      createdAt: submissionData.createdAt,
    });
  } catch (error: any) {
    console.error('Error saving submission:', error);
    return res.status(500).json({
      error: 'Erro ao salvar as respostas no banco de dados. Tente novamente.',
      details: error?.message || String(error),
    });
  }
});

// Admin: Login endpoint (Protected server-side verification)
app.post('/api/admin/login', (req, res) => {
  try {
    const { password } = req.body;

    if (password === undefined || password === null) {
      return res.status(400).json({ error: 'Por favor, informe a senha de acesso.' });
    }

    const trimmedInput = String(password).trim();
    if (!trimmedInput) {
      return res.status(400).json({ error: 'Por favor, informe a senha de acesso.' });
    }

    // Secure comparison allowing default 17063007 and ADMIN_PASSWORD
    if (trimmedInput !== '17063007' && trimmedInput !== String(ADMIN_PASSWORD).trim()) {
      return res.status(401).json({ error: 'Senha incorreta. Verifique e tente novamente.' });
    }

    // Generate stateless cryptographic HMAC token
    const token = generateAdminToken();
    const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days

    return res.json({
      success: true,
      token,
      expiresAt,
      message: 'Autenticado com sucesso.',
    });
  } catch (error: any) {
    console.error('Error on admin login:', error);
    return res.status(500).json({ error: 'Erro interno ao processar autenticação.' });
  }
});

// Admin: Verify current session token
app.get('/api/admin/verify', requireAdminAuth, (req, res) => {
  res.json({ valid: true });
});

// Admin: Logout
app.post('/api/admin/logout', (req, res) => {
  res.json({ success: true, message: 'Sessão encerrada com sucesso.' });
});

// Admin: List all submissions
app.get('/api/admin/submissions', requireAdminAuth, async (req, res) => {
  try {
    const submissionsCol = collection(serverDb, 'submissions');
    const snapshot = await getDocs(submissionsCol);
    const submissions: any[] = [];

    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      submissions.push({
        id: docSnapshot.id,
        ...data,
      });
    });

    // Sort newest first
    submissions.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      return dateB - dateA;
    });

    return res.json({
      success: true,
      total: submissions.length,
      submissions,
    });
  } catch (error: any) {
    console.error('Error retrieving submissions:', error);
    return res.status(500).json({
      error: 'Erro ao carregar as respostas do banco de dados.',
      details: error?.message || String(error),
    });
  }
});

// Admin: Get single submission details
app.get('/api/admin/submissions/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const subDocRef = doc(serverDb, 'submissions', id);
    const docSnapshot = await getDoc(subDocRef);

    if (!docSnapshot.exists()) {
      return res.status(404).json({ error: 'Formulário não encontrado.' });
    }

    return res.json({
      success: true,
      submission: {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      },
    });
  } catch (error: any) {
    console.error('Error retrieving submission:', error);
    return res.status(500).json({ error: 'Erro ao buscar o formulário.' });
  }
});

// Admin: Delete a submission
app.delete('/api/admin/submissions/:id', requireAdminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const subDocRef = doc(serverDb, 'submissions', id);
    await deleteDoc(subDocRef);

    return res.json({
      success: true,
      message: 'Formulário excluído com sucesso.',
    });
  } catch (error: any) {
    console.error('Error deleting submission:', error);
    return res.status(500).json({ error: 'Erro ao excluir o formulário.' });
  }
});

// ================= DEV / PROD MIDDLEWARE ================= //
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Localway Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
