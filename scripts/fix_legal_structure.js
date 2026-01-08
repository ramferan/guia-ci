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
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixLegalStructure() {
    console.log('🔧 Arreglando estructura de campos legales...\n');

    try {
        const nodesSnap = await getDocs(collection(db, 'nodes'));
        let fixed = 0;

        for (const nodeDoc of nodesSnap.docs) {
            const data = nodeDoc.data();

            if (!data.lawQuote) {
                console.log(`⏭️  Skipping ${nodeDoc.id} (no lawQuote)`);
                continue;
            }

            // Extract law reference from lawQuote
            // Format: "Ley 41/2002, Art. 4: \"text...\""
            // or "R.D. 415/2022 Art. Único, 3: \"text...\""
            const match = data.lawQuote.match(/^([^:]+):\s*(.+)$/);

            if (!match) {
                console.log(`⚠️  Could not parse ${nodeDoc.id}: ${data.lawQuote.substring(0, 50)}`);
                continue;
            }

            const lawReference = match[1].trim(); // "Ley 41/2002, Art. 4"
            const lawText = match[2].trim().replace(/^[""]|[""]$/g, ''); // Remove quotes

            const nodeRef = doc(db, 'nodes', nodeDoc.id);
            await updateDoc(nodeRef, {
                lawTitle: lawReference,
                lawQuote: lawText
            });

            console.log(`✅ Fixed ${nodeDoc.id}`);
            console.log(`   Title: ${lawReference}`);
            console.log(`   Quote: ${lawText.substring(0, 50)}...`);
            fixed++;
        }

        console.log(`\n🎉 ¡Arreglo completado!`);
        console.log(`📊 Nodos arreglados: ${fixed}`);

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

fixLegalStructure()
    .then(() => {
        console.log('\n✨ Proceso finalizado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Proceso fallido:', error);
        process.exit(1);
    });
