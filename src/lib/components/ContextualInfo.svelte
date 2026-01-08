<script>
    import { slide } from "svelte/transition";

    export let type = ""; // 'ci', 'ip', 'jerarquia'
    export let isOpen = false;

    const data = {
        ci: {
            title: "Sobre el Consentimiento Informado",
            text: "Es el proceso de comunicación entre médico y paciente capaz, donde este último acepta o rechaza una intervención tras entender riesgos y beneficios.",
            steps: [
                "Debe ser libre y voluntario",
                "Verbal por defecto, escrito para riesgos/cirugía",
                "Revocable en cualquier momento",
            ],
        },
        ip: {
            title: "Sobre las Instrucciones Previas",
            text: "Documento legal donde una persona capaz decide hoy qué tratamientos quiere o no recibir en el futuro si pierde la capacidad de decidir.",
            steps: [
                "Se consulta en el Registro oficial",
                "Obliga al médico si es legal y clínico",
                "Nombra un representante si se desea",
            ],
        },
        jerarquia: {
            title: "Jerarquía de Decisión",
            text: "Orden legal que el médico DEBE seguir cuando un paciente no puede decidir por sí mismo:",
            steps: [
                "1. Buscar Instrucciones Previas registradas.",
                "2. Consultar a representantes o allegados.",
                "3. Si nada de lo anterior es posible, actuar en beneficio del paciente.",
            ],
        },
    };

    $: current = data[type];
</script>

{#if isOpen && current}
    <div class="contextual-info" transition:slide>
        <h5>{current.title}</h5>
        <p>{current.text}</p>
        <ul>
            {#each current.steps as step}
                <li>{step}</li>
            {/each}
        </ul>
        <div class="tip">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                class="tip-svg"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 18v-5.25m0 0a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM12 11.25V5.25m0 0a1.125 1.125 0 110 2.25 1.125 1.125 0 010-2.25zM12 25.5c-7.042 0-12.75-5.708-12.75-12.75S4.958 0 12 0s12.75 5.708 12.75 12.75S19.042 25.5 12 25.5z"
                />
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
            </svg>
            <small
                >Consulta la sección de conceptos abajo para ver la cita legal
                completa.</small
            >
        </div>
    </div>
{/if}

<style>
    .contextual-info {
        margin-top: 1rem;
        padding: 1rem;
        background-color: #f0fdfa;
        border: 1px solid #ccfbf1;
        border-radius: 0.75rem;
        text-align: left;
    }

    h5 {
        color: var(--color-primary-dark);
        margin: 0 0 0.5rem 0;
        font-size: 0.95rem;
    }

    p {
        font-size: 0.85rem;
        color: var(--color-text-main);
        margin-bottom: 0.5rem;
        line-height: 1.4;
    }

    ul {
        margin: 0.5rem 0;
        padding-left: 1.2rem;
    }

    li {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        margin-bottom: 0.3rem;
    }

    .tip {
        margin-top: 0.8rem;
        padding-top: 0.6rem;
        border-top: 1px dashed #99f6e4;
        color: var(--color-primary);
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .tip-svg {
        width: 14px;
        height: 14px;
    }
</style>
