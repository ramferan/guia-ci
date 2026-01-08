<script>
    import { fade, fly } from "svelte/transition";
    import FlowNavigator from "./FlowNavigator.svelte";

    const concepts = [
        {
            id: "ci",
            title: "C. Informado",
            items: [
                {
                    label: "Definición",
                    summary:
                        "Es la conformidad que da el paciente para que se realice una intervención médica tras ser debidamente informado.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 3",
                    lawQuote:
                        'La "conformidad libre, voluntaria y consciente de un paciente, manifestada en el pleno uso de sus facultades después de recibir la información adecuada, para que tenga lugar una actuación que afecta a su salud".',
                },
                {
                    label: "Formalización",
                    summary:
                        "Por lo general es un acuerdo verbal, pero en casos de riesgo o cirugía debe ser por escrito.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 8.2",
                    lawQuote:
                        "El consentimiento será verbal por regla general. Sin embargo, se prestará por escrito en casos de intervención quirúrgica, procedimientos diagnósticos y terapéuticos invasores y procedimientos que suponen riesgos o inconvenientes de notoria y previsible repercusión negativa sobre la salud y su integridad física o psíquica.",
                },
                {
                    label: "Obligatoriedad",
                    summary:
                        "Toda intervención requiere el permiso previo del paciente tras entender sus opciones.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art 8.1",
                    lawQuote:
                        "Toda actuación en el ámbito de la salud de un paciente necesita el consentimiento libre y voluntario del afectado, una vez que, recibida la información prevista en el artículo 4, haya valorado las opciones propias del caso.",
                },
                {
                    label: "Derecho a la información",
                    summary:
                        "El paciente tiene derecho a saber todo sobre su salud, pero también puede elegir no ser informado.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 4",
                    lawQuote:
                        "Los pacientes tienen derecho a conocer, con motivo de cualquier actuación en el ámbito de su salud, toda la información disponible sobre la misma, salvando los supuestos exceptuados por Ley. Toda persona tiene derecho a que se respete su voluntad de no ser informada.",
                },
                {
                    label: "Respeto a las decisiones",
                    summary:
                        "El paciente es quien tiene la última palabra sobre qué opción clínica prefiere.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 8.3",
                    lawQuote:
                        "Todo paciente o usuario tiene derecho a decidir libremente, después de recibir la información adecuada, entre las opciones clínicas disponibles.",
                },
                {
                    label: "Límites del consentimiento",
                    summary:
                        "En urgencias vitales o riesgos para la salud pública, el médico puede actuar sin consentimiento previo.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 9.2",
                    lawQuote:
                        "Los facultativos podrán llevar a cabo las intervenciones indispensables sin necesidad de consentimiento en caso de riesgo para la salud pública o riesgo inmediato grave para la integridad física o psíquica del enfermo.",
                },
            ],
        },
        {
            id: "ip",
            title: "I. Previas",
            items: [
                {
                    label: "Concepto",
                    summary:
                        "Es un documento para asegurar que se respete tu voluntad médica cuando ya no puedas expresarla.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 11.1",
                    lawQuote:
                        "Por este documento, una persona mayor de edad, capaz y libre, manifiesta anticipadamente su voluntad, para que ésta sea tenida en cuenta en el momento en que se encuentre en una situación en que las circunstancias no le permitan expresar personalmente su voluntad.",
                },
                {
                    label: "Registro Nacional",
                    summary:
                        "Existe una base de datos centralizada para que tus instrucciones sean visibles en cualquier hospital de España.",
                    lawTitle:
                        "R.D. 415/2022 por el que se regula el Registro Nacional de Instrucciones Previas",
                    lawQuote:
                        "Para asegurar la eficacia en todo el territorio de las instrucciones previas, se creó el Registro Nacional de Instrucciones Previas en el Ministerio de Sanidad.",
                },
                {
                    label: "Responsabilidad Médica",
                    summary:
                        "El médico tiene el deber profesional de buscar si tienes instrucciones registradas y aplicarlas.",
                    lawTitle:
                        "Ley 3/2005 de Medidas en Materia de Seguridad Sanitaria (C. La Mancha), Art. 8.1",
                    lawQuote:
                        "El médico tiene la obligación de consultar si existen instrucciones previas en la historia clínica o en el registro y respetarlas conforme a la normativa vigente.",
                },
                {
                    label: "Deber de Respetar",
                    summary:
                        "Tus deseos escritos son de obligado cumplimiento, salvo que vayan en contra de la ley.",
                    lawTitle:
                        "Ley 4/2017 de derechos y garantías de las personas en el proceso de morir (C. La Mancha), Art. 14.1",
                    lawQuote:
                        "Se respetarán las instrucciones conforme a la normativa vigente, salvo que resulten contrarias al ordenamiento jurídico o a la buena práctica clínica (lex artis).",
                },
                {
                    label: "Maneras de Formular",
                    summary:
                        "Puedes crear tus instrucciones ante testigos, ante el personal administrativo o ante un notario.",
                    lawTitle:
                        "Ley 3/2005 de Medidas en Materia de Seguridad Sanitaria (C. La Mancha), Art. 5.2",
                    lawQuote:
                        "Las instrucciones previas podrán formalizarse ante el funcionariado de la administración sanitaria, ante tres testigos cumpliendo los requisitos legales, o mediante acta notarial.",
                },
                {
                    label: "Consulta a Allegados",
                    summary:
                        "Si no hay instrucciones escritas, se pregunta a la familia qué es lo que el paciente querría realmente.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 9.2",
                    lawQuote:
                        "En caso de ausencia de I.P., se consultará a los allegados para conocer la voluntad clara e inequívoca del paciente, no las opiniones personales de los mismos.",
                },
            ],
        },
        {
            id: "jerarquia",
            title: "Jerarquía",
            items: [
                {
                    label: "Escalera de decisión",
                    summary:
                        "La ley establece un orden estricto de consulta para respetar la autonomía del paciente en todo momento.",
                    lawTitle: "Procedimiento CEH / Ley 41/2002",
                    lawQuote:
                        "1. Voluntad actual (CI) > 2. Instrucciones Previas (IP) > 3. Representantes o Allegados > 4. Beneficio de la Salud (Criterio médico profesional).",
                },
                {
                    label: "Paso 1: Consentimiento",
                    summary:
                        "Si el paciente es capaz y está consciente, su decisión actual es lo único que cuenta.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 8",
                    lawQuote:
                        "Toda actuación en el ámbito de la salud de un paciente necesita el consentimiento libre y voluntario del afectado.",
                },
                {
                    label: "Paso 2: Instr. Previas",
                    summary:
                        "Si el paciente no puede hablar, se comprueba si dejó algo escrito en el Registro oficial.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 11",
                    lawQuote:
                        "Se manifiesta anticipadamente su voluntad para que sea tenida en cuenta cuando no pueda expresarla personalmente.",
                },
                {
                    label: "Paso 3: Allegados",
                    summary:
                        "Si no hay IP, se pregunta a familiares lo que el paciente querría, no lo que ellos quieran.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 9.3",
                    lawQuote:
                        "El consentimiento lo prestarán sus representantes legales o personas vinculadas por razones familiares o de hecho.",
                },
                {
                    label: "Paso 4: Beneficio Médico",
                    summary:
                        "Si nada de lo anterior es posible (urgencia vital), el médico actúa para salvar la vida.",
                    lawTitle:
                        "Ley 41/2002 básica reguladora de la autonomía del paciente, Art. 9.2",
                    lawQuote:
                        "Los facultativos podrán llevar a cabo las intervenciones indispensables sin necesidad de consentimiento en caso de riesgo inmediato grave.",
                },
            ],
        },
        {
            id: "guia",
            title: "Guía Interactiva",
            items: [],
        },
    ];

    let activeTabIndex = 0;
    let currentCardIndex = 0;

    $: activeSection = concepts[activeTabIndex];
    $: initials =
        activeSection.id === "ci"
            ? "CI"
            : activeSection.id === "ip"
              ? "IP"
              : activeSection.id === "jerarquia"
                ? "J"
                : "GI";

    $: isGuideMode = activeSection.id === "guia" && currentCardIndex > 0;

    // activeItem maps to index - 2 (Card 2 is Item 0)
    $: activeItem =
        currentCardIndex >= 2
            ? activeSection.items[currentCardIndex - 2]
            : null;

    function handleExitFlow() {
        goToCard(0);
    }

    function changeTab(index) {
        activeTabIndex = index;
        currentCardIndex = 0;
    }

    function goToCard(index) {
        currentCardIndex = index;
    }

    function nextCard() {
        const totalCards =
            activeSection.id === "guia" ? 2 : activeSection.items.length + 2;
        currentCardIndex = (currentCardIndex + 1) % totalCards;
    }

    function prevCard() {
        const totalCards =
            activeSection.id === "guia" ? 2 : activeSection.items.length + 2;
        currentCardIndex = (currentCardIndex - 1 + totalCards) % totalCards;
    }
</script>

<section class="concept-navigation">
    <div class="tabs-wrapper">
        <div class="tabs conceptual-tabs">
            {#each concepts.slice(0, 3) as section, i}
                <button
                    class="tab-btn"
                    class:active={activeTabIndex === i}
                    on:click={() => changeTab(i)}
                >
                    {section.title}
                </button>
            {/each}
        </div>

        <div class="tabs guide-tabs">
            <button
                class="tab-btn tab-guide"
                class:active={activeTabIndex === 3}
                on:click={() => changeTab(3)}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    class="tab-icon"
                >
                    <path
                        fill-rule="evenodd"
                        d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                        clip-rule="evenodd"
                    />
                </svg>
                {concepts[3].title}
            </button>
        </div>
    </div>

    <div class="carousel-container" class:is-flow={isGuideMode}>
        {#if !isGuideMode}
            <button
                class="nav-arrow left"
                on:click={prevCard}
                aria-label="Anterior"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    ><path
                        fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd"
                    /></svg
                >
            </button>
        {/if}

        <div class="card-display">
            {#if isGuideMode}
                <div in:fade class="flow-wrapper">
                    <div class="flow-inner">
                        <FlowNavigator onExitFlow={handleExitFlow} />
                    </div>
                </div>
            {:else}
                {#key `${activeTabIndex}-${currentCardIndex}`}
                    <div
                        in:fly={{ x: 20, duration: 300 }}
                        out:fade={{ duration: 150 }}
                        class="card carousel-card"
                    >
                        {#if currentCardIndex > 0}
                            <button
                                class="btn-reset-cover"
                                title="Volver a la portada de {activeSection.title}"
                                on:click={() => goToCard(0)}
                            >
                                {initials}
                            </button>
                        {/if}
                        {#if currentCardIndex === 0}
                            <!-- Title Card -->
                            <div class="title-card">
                                <div class="icon-hero">
                                    {#if activeSection.id === "ci"}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="hero-svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                            />
                                        </svg>
                                    {:else if activeSection.id === "ip"}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.2"
                                            stroke="currentColor"
                                            class="hero-svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                                            />
                                        </svg>
                                    {:else if activeSection.id === "jerarquia"}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.2"
                                            stroke="currentColor"
                                            class="hero-svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M12 3v17.25m0 0a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM12 3a1.125 1.125 0 110-2.25A1.125 1.125 0 1012 3zm0 0c6.21 0 11.25 5.04 11.25 11.25S18.21 25.5 12 25.5 0.75 20.46.75 14.25 5.79 3 12 3zM12 3a9 9 0 100 18 9 9 0 000-18z"
                                            />
                                        </svg>
                                    {:else if activeSection.id === "guia"}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                            class="hero-svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                                            />
                                        </svg>
                                    {/if}
                                </div>
                                <h3>{activeSection.title}</h3>
                                <p class="subtitle">
                                    {activeSection.id === "guia"
                                        ? "Herramienta interactiva para la toma de decisiones clínicas."
                                        : "Información Fundamental y Marco Legal"}
                                </p>
                                <button
                                    class="btn btn-primary"
                                    on:click={nextCard}
                                >
                                    {activeSection.id === "guia"
                                        ? "Comenzar Guía"
                                        : "Empezar consulta"}
                                </button>
                            </div>
                        {:else if currentCardIndex === 1}
                            <!-- Index Card -->
                            <div class="index-card">
                                <div class="index-header">
                                    <h4>{activeSection.title}</h4>
                                    <div class="index-separator">
                                        <span class="separator-line"></span>
                                        <span class="separator-text"
                                            >Índice de contenidos</span
                                        >
                                        <span class="separator-line"></span>
                                    </div>
                                </div>
                                <div class="index-grid">
                                    {#each activeSection.items as item, i}
                                        <button
                                            class="index-item"
                                            on:click={() => goToCard(i + 2)}
                                        >
                                            <span class="index-num"
                                                >{i + 1}</span
                                            >
                                            <span class="index-label"
                                                >{item.label}</span
                                            >
                                            <span class="index-arrow">→</span>
                                        </button>
                                    {/each}
                                </div>
                            </div>
                        {:else if activeItem}
                            <!-- Detail Card -->
                            <div class="detail-card">
                                <div class="card-content">
                                    <div class="card-title-row">
                                        <span class="card-num"
                                            >{currentCardIndex - 1}</span
                                        >
                                        <h4>{activeItem.label}</h4>
                                    </div>
                                    <p>{activeItem.summary}</p>
                                </div>

                                <div class="legal-box">
                                    <div class="legal-header">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="2"
                                            stroke="currentColor"
                                            class="legal-svg"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
                                            />
                                        </svg>
                                        <strong
                                            >Marco Legal: {activeItem.lawTitle}</strong
                                        >
                                    </div>
                                    <p class="quote">{activeItem.lawQuote}</p>
                                </div>

                                <button
                                    class="btn-goto-index"
                                    on:click={() => goToCard(1)}
                                >
                                    &lt; Volver al índice
                                </button>
                            </div>
                        {/if}
                    </div>
                {/key}
            {/if}
        </div>

        {#if !isGuideMode}
            <button
                class="nav-arrow right"
                on:click={nextCard}
                aria-label="Siguiente"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    ><path
                        fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"
                    /></svg
                >
            </button>
        {/if}
    </div>

    {#if activeSection.id !== "guia"}
        <div class="indicators">
            <!-- Dot for Title -->
            <button
                class="dot"
                class:active={currentCardIndex === 0}
                on:click={() => goToCard(0)}
                aria-label="Portada"
            ></button>
            <!-- Dot for Index -->
            <button
                class="dot"
                class:active={currentCardIndex === 1}
                on:click={() => goToCard(1)}
                aria-label="Índice"
            ></button>
            <!-- Dots for items -->
            {#each activeSection.items as _, i}
                <button
                    class="dot"
                    class:active={currentCardIndex === i + 2}
                    on:click={() => goToCard(i + 2)}
                    aria-label="Página {i + 1}"
                ></button>
            {/each}
        </div>
    {/if}
</section>

<style>
    .carousel-card {
        padding: 2rem;
        background: white;
        min-height: 320px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 0;
        text-align: left;
        box-shadow: var(--shadow-md);
        position: relative;
    }

    .btn-reset-cover {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        width: 38px;
        height: 38px;
        background: var(--color-primary);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.7rem;
        font-weight: 900;
        box-shadow: var(--shadow-md);
        transition: all 0.2s;
        border: 2px solid white;
        z-index: 10;
        cursor: pointer;
    }

    .btn-reset-cover:hover {
        transform: scale(1.1);
        background: var(--color-primary-dark);
        box-shadow: var(--shadow-md);
    }

    .concept-navigation {
        margin-top: 3rem;
        padding: 2rem 1.5rem;
        background: #f1f5f9;
        border-radius: var(--radius-xl);
        width: 100%;
        max-width: 850px;
        margin-left: auto;
        margin-right: auto;
    }

    .title-card {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }

    .icon-hero {
        margin-bottom: 0.5rem;
        color: var(--color-primary);
    }

    .hero-svg {
        width: 80px;
        height: 80px;
    }

    .title-card h3 {
        margin: 0;
        color: var(--color-primary-dark);
        font-size: 1.8rem;
        font-weight: 800;
    }

    .subtitle {
        color: var(--color-text-muted);
        font-size: 1rem;
        margin-bottom: 1.5rem;
    }

    .index-card {
        padding: 0.5rem;
        width: 100%;
    }

    .index-header {
        margin-bottom: 2rem;
        text-align: center;
    }

    .index-header h4 {
        font-size: 1.5rem;
        margin-bottom: 0.75rem;
        color: var(--color-primary-dark);
        font-weight: 800;
    }

    .index-separator {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-top: 0.5rem;
    }

    .separator-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(
            to right,
            transparent,
            #cbd5e1,
            transparent
        );
    }

    .separator-text {
        font-size: 0.7rem;
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 700;
        color: var(--color-primary);
        opacity: 0.8;
    }

    .index-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
    }

    .index-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem;
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        text-align: left;
        transition: all 0.2s;
        color: var(--color-text-main);
    }

    .index-item:hover {
        background: white;
        border-color: var(--color-primary);
        transform: translateY(-2px);
        box-shadow: var(--shadow-sm);
    }

    .index-item .index-num {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        background: var(--color-primary);
        color: white;
        border-radius: 50%;
        font-size: 0.7rem;
        font-weight: 700;
    }

    .index-label {
        font-size: 0.85rem;
        font-weight: 600;
        flex: 1;
    }

    .index-arrow {
        color: var(--color-primary);
        font-weight: 700;
        opacity: 0.5;
    }

    .index-item:hover .index-arrow {
        opacity: 1;
        transform: translateX(2px);
    }

    .btn-goto-index {
        align-self: flex-start;
        background: none;
        color: var(--color-primary);
        font-size: 0.85rem;
        padding: 0;
        margin-top: 1rem;
        font-weight: 600;
        width: auto;
    }

    .btn-goto-index:hover {
        text-decoration: underline;
    }

    .tabs-wrapper {
        display: flex;
        gap: 1rem;
        margin-bottom: 2rem;
        align-items: center;
    }

    .tabs {
        display: flex;
        background: #e2e8f0;
        padding: 4px;
        border-radius: 12px;
    }

    .conceptual-tabs {
        flex: 2;
    }

    .guide-tabs {
        flex: 1;
        background: rgba(var(--color-primary-rgb), 0.15);
    }

    .tab-btn {
        flex: 1;
        padding: 0.6rem;
        border-radius: 9px;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-text-muted);
        background: transparent;
        transition: all 0.2s;
        white-space: nowrap;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .tab-btn.active {
        background: white;
        color: var(--color-primary);
        box-shadow: var(--shadow-sm);
    }

    .tab-btn.tab-guide {
        background: white;
        color: var(--color-primary);
        border: 2px solid var(--color-primary);
        box-shadow: 0 2px 4px rgba(var(--color-primary-rgb), 0.1);
    }

    .tab-btn.tab-guide.active {
        background: var(--color-primary);
        color: white;
        box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
    }

    .tab-icon {
        width: 18px;
        height: 18px;
        margin-right: 6px;
    }

    .carousel-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        width: 100%;
        gap: 1.5rem;
        min-height: 320px;
        position: relative;
    }

    .carousel-container.is-flow {
        justify-content: center;
    }

    .flow-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .flow-inner {
        position: relative;
        width: 100%;
        max-width: 540px; /* Slightly wider than navigator to accommodate buttons */
        padding-top: 1rem;
    }

    .card-display {
        flex: 1;
        position: relative;
    }

    h4 {
        margin: 0;
        color: var(--color-primary-dark);
        font-size: 1.25rem;
    }

    p {
        font-size: 1rem;
        line-height: 1.6;
        color: var(--color-text-main);
        margin-bottom: 0.5rem;
    }

    .legal-box {
        margin-top: 1.5rem;
        padding: 1rem;
        background-color: #f8fafc;
        border-left: 4px solid var(--color-primary);
        border-radius: 0 0.5rem 0.5rem 0;
    }

    .legal-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.4rem;
    }

    .legal-svg {
        width: 40px;
        height: 40px;
        color: var(--color-primary);
    }

    .legal-box strong {
        display: block;
        font-size: 0.8rem;
        color: var(--color-primary-dark);
    }

    .quote {
        font-size: 0.85rem;
        font-style: italic;
        color: var(--color-text-muted);
        line-height: 1.5;
        margin: 0;
    }

    .card-title-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 0.75rem;
    }

    .card-num {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 24px;
        height: 24px;
        background: #f1f5f9;
        color: var(--color-primary);
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 800;
    }

    .nav-arrow {
        background: white;
        color: var(--color-text-muted);
        width: 44px;
        height: 44px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-md);
        transition: all 0.2s;
        cursor: pointer;
        flex-shrink: 0;
        border: 1px solid #e2e8f0;
    }

    .nav-arrow:hover {
        color: var(--color-primary);
        box-shadow: var(--shadow-md);
    }

    .nav-arrow svg {
        width: 24px;
        height: 24px;
    }

    .indicators {
        display: flex;
        justify-content: center;
        gap: 8px;
        margin-top: 2rem;
    }

    .dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #cbd5e1;
        transition: all 0.3s;
        padding: 0;
    }

    .dot.active {
        background: var(--color-primary);
        width: 24px;
        border-radius: 4px;
    }

    @media (max-width: 640px) {
        .index-grid {
            grid-template-columns: 1fr;
        }

        .tabs-wrapper {
            flex-direction: column;
            gap: 0.5rem;
        }

        .conceptual-tabs,
        .guide-tabs {
            width: 100%;
        }
    }
</style>
