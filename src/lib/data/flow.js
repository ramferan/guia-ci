
export const decisionFlow = {
    initialNode: 'start',
    nodes: {
        start: {
            id: 'start',
            type: 'question',
            infoType: 'ci',
            question: '¿Qué tipo de actuación es?',
            description: 'Seleccione el contexto de la intervención sanitaria.',
            legal: 'Ley 41/2002, Art. 8: "Toda actuación en el ámbito de la salud de un paciente necesita el consentimiento libre y voluntario del afectado."',
            options: [
                { label: 'Actuación Programada', nextId: 'consentimiento_programado', style: 'primary' },
                { label: 'Actuación de Urgencia', nextId: 'urgencia_check', style: 'urgent' }
            ]
        },
        consentimiento_programado: {
            id: 'consentimiento_programado',
            type: 'result',
            infoType: 'ci',
            title: 'Solicitar Consentimiento Informado',
            content: 'En actuaciones programadas, es imprescindible recabar el Consentimiento Informado del paciente previamente.',
            legal: 'Ley 41/2002, Art. 4: "Los pacientes tienen derecho a conocer, con motivo de cualquier actuación... toda la información disponible sobre la misma."',
            action: 'Finalizar'
        },
        urgencia_check: {
            id: 'urgencia_check',
            type: 'question',
            infoType: 'jerarquia',
            question: '¿Cuál es el estado del paciente?',
            description: 'Evalúe la capacidad del paciente para tomar decisiones.',
            legal: 'Ley 41/2002, Art. 9.2.b: "Los facultativos podrán llevar a cabo las intervenciones indispensables... cuando existe riesgo inmediato grave para la integridad física o psíquica."',
            options: [
                { label: 'Paciente consciente y capaz', nextId: 'consentimiento_urgencia' },
                { label: 'Paciente no facultado (inconsciente/incapaz)', nextId: 'instrucciones_check' }
            ]
        },
        consentimiento_urgencia: {
            id: 'consentimiento_urgencia',
            type: 'result',
            title: 'Solicitar Consentimiento Informado',
            content: 'Si el paciente está consciente y capaz, se debe informar y solicitar su consentimiento, incluso en situaciones de urgencia, adaptando la información a las circunstancias.',
            legal: 'R.D. 415/2022 Art. Único, 3: "Aun en situaciones de urgencia, si el paciente conserva su capacidad, debe ser informado y prestar su consentimiento."',
            action: 'Finalizar'
        },
        instrucciones_check: {
            id: 'instrucciones_check',
            type: 'question',
            question: '¿Existen Instrucciones Previas?',
            description: 'Consulte si el paciente tiene registradas instrucciones previas o voluntades anticipadas.',
            legal: 'Ley 41/2002, Art. 11: "Por el documento de instrucciones previas, una persona manifiesta anticipadamente su voluntad... para que ésta se cumpla en el momento en que no sea capaz de expresarla personalmente."',
            options: [
                { label: 'SÍ tiene', nextId: 'seguir_instrucciones' },
                { label: 'NO tiene', nextId: 'consultar_allegados' }
            ]
        },
        seguir_instrucciones: {
            id: 'seguir_instrucciones',
            type: 'result',
            title: 'Seguir Instrucciones Previas',
            content: 'El equipo médico debe actuar conforme a lo establecido en las instrucciones previas del paciente.',
            legal: 'Ley 4/2017, Art. 14.1: "Se respetarán las instrucciones previas otorgadas por el paciente conforme a la normativa vigente."',
            action: 'Finalizar'
        },
        consultar_allegados: {
            id: 'consultar_allegados',
            type: 'result',
            title: 'Consultar a los Allegados',
            content: 'Ante la ausencia de instrucciones previas, consulte a los familiares o allegados para conocer la voluntad presunta del paciente. Si no es posible, el médico actuará en beneficio de la salud del paciente.',
            legal: 'Ley 41/2002, Art. 9.3.a: "Cuando el paciente no sea capaz... el consentimiento lo prestarán sus representantes legales o personas vinculadas por razones familiares o de hecho."',
            action: 'Finalizar'
        }
    }
};
