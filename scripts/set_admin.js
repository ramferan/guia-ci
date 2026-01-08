import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// Firebase config - loaded from .env file
const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Uso: node scripts/set_admin.js <uid> <email>');
    process.exit(1);
}

const [uid, email] = args;

async function setAdmin() {
    console.log(`🔑 Configurando admin para: ${email} (${uid})...`);

    try {
        await setDoc(doc(db, 'users', uid), {
            email: email,
            role: 'admin'
        });

        console.log('✅ Usuario configurado como admin exitosamente.');
    } catch (error) {
        console.error('❌ Error al configurar admin:', error);
    }

    process.exit(0);
}

setAdmin();
