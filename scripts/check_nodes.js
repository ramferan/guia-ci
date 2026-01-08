import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

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

async function checkNodes() {
    console.log('🔍 Verificando estructura de nodos...\n');

    try {
        const nodesSnap = await getDocs(collection(db, 'nodes'));

        for (const nodeDoc of nodesSnap.docs) {
            const data = nodeDoc.data();
            console.log(`\n📄 Node: ${nodeDoc.id}`);
            console.log(`   Type: ${data.type}`);
            console.log(`   Has legal: ${!!data.legal}`);
            console.log(`   Has lawTitle: ${!!data.lawTitle}`);
            console.log(`   Has lawQuote: ${!!data.lawQuote}`);
            if (data.lawTitle) console.log(`   lawTitle: "${data.lawTitle}"`);
            if (data.lawQuote) console.log(`   lawQuote: "${data.lawQuote.substring(0, 50)}..."`);
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }

    process.exit(0);
}

checkNodes();
