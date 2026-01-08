import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function cleanQuotes() {
    const collections = ['nodes', 'concept_items'];

    for (const colName of collections) {
        console.log(`🧹 Cleaning quotes in collection: ${colName}...`);
        const snapshot = await getDocs(collection(db, colName));

        for (const document of snapshot.docs) {
            const data = document.data();
            if (data.lawQuote && typeof data.lawQuote === 'string') {
                let cleaned = data.lawQuote.trim();
                // Remove surrounding quotes if they exist
                if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
                    cleaned = cleaned.substring(1, cleaned.length - 1);
                    await updateDoc(doc(db, colName, document.id), { lawQuote: cleaned });
                    console.log(`  ✅ Cleaned quotes in ${colName}/${document.id}`);
                }
            }
        }
    }
}

cleanQuotes().then(() => {
    console.log('✨ Cleanup finished');
    process.exit(0);
}).catch(err => {
    console.error('💥 Cleanup failed:', err);
    process.exit(1);
});
