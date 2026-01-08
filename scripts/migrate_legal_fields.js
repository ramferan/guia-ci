import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

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

async function migrateLegalFields() {
    console.log('🚀 Iniciando migración de campos legales...\n');

    try {
        const nodesSnap = await getDocs(collection(db, 'nodes'));
        let updated = 0;
        let skipped = 0;

        for (const nodeDoc of nodesSnap.docs) {
            const data = nodeDoc.data();

            // Skip if no legal field or already has lawTitle/lawQuote
            if (!data.legal || data.lawTitle || data.lawQuote) {
                skipped++;
                continue;
            }

            // For now, we'll keep the legal field as is and add it to lawQuote
            // The lawTitle can be added manually or we can parse it if there's a pattern
            const nodeRef = doc(db, 'nodes', nodeDoc.id);

            await updateDoc(nodeRef, {
                lawTitle: 'Marco Legal',
                lawQuote: data.legal,
                // Keep the original legal field for backwards compatibility
            });

            console.log(`✅ Updated node: ${nodeDoc.id}`);
            updated++;
        }

        console.log('\n🎉 ¡Migración completada!');
        console.log(`📊 Resumen:`);
        console.log(`  - Nodos actualizados: ${updated}`);
        console.log(`  - Nodos omitidos: ${skipped}`);

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        throw error;
    }
}

// Ejecutar migración
migrateLegalFields()
    .then(() => {
        console.log('\n✨ Proceso finalizado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Proceso fallido:', error);
        process.exit(1);
    });
