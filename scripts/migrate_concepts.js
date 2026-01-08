import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';

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

const concepts = [
    {
        id: "ci",
        title: "C. Informado",
        description: "Fundamentos legales y requisitos para la validez de la conformidad del paciente.",
        order: 1,
        items: [
            {
                label: "Definición",
                summary: "Es la conformidad que da el paciente para que se realice una intervención médica tras ser debidamente informado.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 3",
                lawQuote: 'La conformidad libre, voluntaria y consciente de un paciente, manifestada en el pleno uso de sus facultades después de recibir la información adecuada, para que tenga lugar una actuación que afecta a su salud.',
            },
            {
                label: "Formalización",
                summary: "Por lo general es un acuerdo verbal, pero en casos de riesgo o cirugía debe ser por escrito.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 8.2",
                lawQuote: "El consentimiento será verbal por regla general. Sin embargo, se prestará por escrito en casos de intervención quirúrgica, procedimientos diagnósticos y terapéuticos invasores y procedimientos que suponen riesgos o inconvenientes de notoria y previsible repercusión negativa sobre la salud y su integridad física o psíquica.",
            },
            {
                label: "Obligatoriedad",
                summary: "Toda intervención requiere el permiso previo del paciente tras entender sus opciones.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art 8.1",
                lawQuote: "Toda actuación en el ámbito de la salud de un paciente necesita el consentimiento libre y voluntario del afectado, una vez que, recibida la información prevista en el artículo 4, haya valorado las opciones propias del caso.",
            },
            {
                label: "Derecho a la información",
                summary: "El paciente tiene derecho a saber todo sobre su salud, pero también puede elegir no ser informado.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 4",
                lawQuote: "Los pacientes tienen derecho a conocer, con motivo de cualquier actuación en el ámbito de su salud, toda la información disponible sobre la misma, salvando los supuestos exceptuados por Ley. Toda persona tiene derecho a que se respete su voluntad de no ser informada.",
            },
            {
                label: "Respeto a las decisiones",
                summary: "El paciente es quien tiene la última palabra sobre qué opción clínica prefiere.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 8.3",
                lawQuote: "Todo paciente o usuario tiene derecho a decidir libremente, después de recibir la información adecuada, entre las opciones clínicas disponibles.",
            },
            {
                label: "Límites del consentimiento",
                summary: "En urgencias vitales o riesgos para la salud pública, el médico puede actuar sin consentimiento previo.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 9.2",
                lawQuote: "Los facultativos podrán llevar a cabo las intervenciones indispensables sin necesidad de consentimiento en caso de riesgo para la salud pública o riesgo inmediato grave para la integridad física o psíquica del enfermo.",
            },
        ],
    },
    {
        id: "ip",
        title: "I. Previas",
        description: "Procedimientos para el registro y consulta de las instrucciones y voluntades anticipadas.",
        order: 2,
        items: [
            {
                label: "Concepto",
                summary: "Es un documento para asegurar que se respete tu voluntad médica cuando ya no puedas expresarla.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 11.1",
                lawQuote: "Por este documento, una persona mayor de edad, capaz y libre, manifiesta anticipadamente su voluntad, para que ésta sea tenida en cuenta en el momento en que se encuentre en una situación en que las circunstancias no le permitan expresar personalmente su voluntad.",
            },
            {
                label: "Registro Nacional",
                summary: "Existe una base de datos centralizada para que tus instrucciones sean visibles en cualquier hospital de España.",
                lawTitle: "R.D. 415/2022 por el que se regula el Registro Nacional de Instrucciones Previas",
                lawQuote: "Para asegurar la eficacia en todo el territorio de las instrucciones previas, se creó el Registro Nacional de Instrucciones Previas en el Ministerio de Sanidad.",
            },
            {
                label: "Responsabilidad Médica",
                summary: "El médico tiene el deber profesional de buscar si tienes instrucciones registradas y aplicarlas.",
                lawTitle: "Ley 3/2005 de Medidas en Materia de Seguridad Sanitaria (C. La Mancha), Art. 8.1",
                lawQuote: "El médico tiene la obligación de consultar si existen instrucciones previas en la historia clínica o en el registro y respetarlas conforme a la normativa vigente.",
            },
            {
                label: "Deber de Respetar",
                summary: "Tus deseos escritos son de obligado cumplimiento, salvo que vayan en contra de la ley.",
                lawTitle: "Ley 4/2017 de derechos y garantías de las personas en el proceso de morir (C. La Mancha), Art. 14.1",
                lawQuote: "Se respetarán las instrucciones conforme a la normativa vigente, salvo que resulten contrarias al ordenamiento jurídico o a la buena práctica clínica (lex artis).",
            },
            {
                label: "Maneras de Formular",
                summary: "Puedes crear tus instrucciones ante testigos, ante el personal administrativo o ante un notario.",
                lawTitle: "Ley 3/2005 de Medidas en Materia de Seguridad Sanitaria (C. La Mancha), Art. 5.2",
                lawQuote: "Las instrucciones previas podrán formalizarse ante el funcionariado de la administración sanitaria, ante tres testigos cumpliendo los requisitos legales, o mediante acta notarial.",
            },
            {
                label: "Consulta a Allegados",
                summary: "Si no hay instrucciones escritas, se pregunta a la familia qué es lo que el paciente querría realmente.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 9.2",
                lawQuote: "En caso de ausencia de I.P., se consultará a los allegados para conocer la voluntad clara e inequívoca del paciente, no las opiniones personales de los mismos.",
            },
        ],
    },
    {
        id: "jerarquia",
        title: "Jerarquía",
        description: "Escalera legal de toma de decisiones cuando el paciente no puede decidir por sí mismo.",
        order: 3,
        items: [
            {
                label: "Escalera de decisión",
                summary: "La ley establece un orden estricto de consulta para respetar la autonomía del paciente en todo momento.",
                lawTitle: "Procedimiento CEH / Ley 41/2002",
                lawQuote: "1. Voluntad actual (CI) > 2. Instrucciones Previas (IP) > 3. Representantes o Allegados > 4. Beneficio de la Salud (Criterio médico profesional).",
            },
            {
                label: "Paso 1: Consentimiento",
                summary: "Si el paciente es capaz y está consciente, su decisión actual es lo único que cuenta.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 8",
                lawQuote: "Toda actuación en el ámbito de la salud de un paciente necesita el consentimiento libre y voluntario del afectado.",
            },
            {
                label: "Paso 2: Instr. Previas",
                summary: "Si el paciente no puede decidir ahora, se buscan sus instrucciones previas escritas.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 11",
                lawQuote: "Si el paciente no puede expresar su voluntad, se tendrán en cuenta las instrucciones previas que hubiera manifestado anticipadamente.",
            },
            {
                label: "Paso 3: Representantes",
                summary: "Si no hay instrucciones previas, se consulta a la familia o representante legal del paciente.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 9.3",
                lawQuote: "Se otorgará el consentimiento por representación cuando el paciente no sea capaz de tomar decisiones, a criterio del médico responsable de la asistencia.",
            },
            {
                label: "Paso 4: Beneficio de la Salud",
                summary: "Solo si no hay ninguna indicación previa, el médico decide en beneficio del paciente.",
                lawTitle: "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 9.2",
                lawQuote: "En caso de riesgo inmediato grave para la integridad física o psíquica del enfermo y no es posible conseguir su autorización, los facultativos podrán llevar a cabo las intervenciones clínicas indispensables en favor de su salud.",
            },
        ],
    },
    {
        id: "guia",
        title: "Guía Interactiva",
        description: "Herramienta interactiva para facilitar la toma de decisiones clínicas y legales.",
        order: 4,
        items: [],
    },
];

async function migrateConcepts() {
    console.log('🚀 Iniciando migración de tarjetas conceptuales...\n');

    try {
        // 1. Crear/actualizar secciones
        for (const concept of concepts) {
            const sectionRef = doc(db, 'concept_sections', concept.id);
            await setDoc(sectionRef, {
                id: concept.id,
                title: concept.title,
                description: concept.description || "",
                order: concept.order
            });
            console.log(`✅ Sección creada: ${concept.title}`);

            // 2. Crear items de cada sección
            for (let i = 0; i < concept.items.length; i++) {
                const item = concept.items[i];
                const itemId = `${concept.id}_${i + 1}`;
                const itemRef = doc(db, 'concept_items', itemId);

                await setDoc(itemRef, {
                    sectionId: concept.id,
                    order: i + 1,
                    label: item.label,
                    summary: item.summary,
                    lawTitle: item.lawTitle,
                    lawQuote: item.lawQuote
                });
                console.log(`  ✅ Item creado: ${item.label}`);
            }
            console.log('');
        }

        console.log('🎉 ¡Migración completada exitosamente!');
        console.log('\n📊 Resumen:');
        console.log(`  - Secciones creadas: ${concepts.length}`);
        console.log(`  - Items totales: ${concepts.reduce((sum, c) => sum + c.items.length, 0)}`);

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        throw error;
    }
}

// Ejecutar migración
migrateConcepts()
    .then(() => {
        console.log('\n✨ Proceso finalizado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Proceso fallido:', error);
        process.exit(1);
    });
