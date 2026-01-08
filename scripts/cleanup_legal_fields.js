import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteField } from 'firebase/firestore';

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

async function cleanupLegalFields() {
    console.log('🧹 Iniciando limpieza de campos legales obsoletos...\n');

    try {
        const nodesSnap = await getDocs(collection(db, 'nodes'));
        let cleaned = 0;
        let skipped = 0;

        for (const nodeDoc of nodesSnap.docs) {
            const data = nodeDoc.data();

            // Skip if no legal field (already cleaned)
            if (!data.legal) {
                skipped++;
                continue;
            }

            // Delete the obsolete legal field
            const nodeRef = doc(db, 'nodes', nodeDoc.id);

            await updateDoc(nodeRef, {
                legal: deleteField()
            });

            console.log(`✅ Cleaned node: ${nodeDoc.id}`);
            cleaned++;
        }

        console.log('\n🎉 ¡Limpieza completada!');
        console.log(`📊 Resumen:`);
        console.log(`  - Nodos limpiados: ${cleaned}`);
        console.log(`  - Nodos omitidos: ${skipped}`);

    } catch (error) {
        console.error('❌ Error durante la limpieza:', error);
        throw error;
    }
}

// Ejecutar limpieza
cleanupLegalFields()
    .then(() => {
        console.log('\n✨ Proceso finalizado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Proceso fallido:', error);
        process.exit(1);
    });
