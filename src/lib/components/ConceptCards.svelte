<script>
    import { fade, fly } from "svelte/transition";
    import { onMount } from "svelte";
    import {
        collection,
        getDocs,
        query,
        orderBy,
        where,
    } from "firebase/firestore";
    import { db } from "../firebase";
    import FlowNavigator from "./FlowNavigator.svelte";
    import LegalBox from "./LegalBox.svelte";
    import EditModal from "./EditModal.svelte";

    export let isAdmin = false;

    let concepts = [];
    let activeTabIndex = 0;
    let currentCardIndex = 0;
    let isReordering = false;

    // Editing state
    let editingItem = null;
    let editingSection = null;
    let editingNewNode = false;

    async function loadData() {
        try {
            const sectionsSnap = await getDocs(
                query(collection(db, "concept_sections"), orderBy("order")),
            );

            if (sectionsSnap.empty) return;

            const loadedConcepts = [];
            for (const sectionDoc of sectionsSnap.docs) {
                const sectionData = sectionDoc.data();
                const itemsQuery = query(
                    collection(db, "concept_items"),
                    where("sectionId", "==", sectionData.id || sectionDoc.id),
                );
                const itemsSnap = await getDocs(itemsQuery);
                const items = itemsSnap.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                items.sort(
                    (a, b) =>
                        (Number(a["order"]) || 0) - (Number(b["order"]) || 0),
                );

                loadedConcepts.push({
                    id: sectionDoc.id,
                    ...sectionData,
                    items: items,
                });
            }

            // Ensure "Guía Interactiva" is always the 4th tab if not already present
            if (!loadedConcepts.find((c) => c.id === "guia")) {
                loadedConcepts.push({
                    id: "guia",
                    title: "Guía Interactiva",
                    description:
                        "Herramienta interactiva para la toma de decisiones clínicas y legales.",
                    items: [],
                });
            }

            concepts = loadedConcepts;
        } catch (error) {
            console.error("Error loading concepts:", error);
        }
    }

    onMount(async () => {
        await loadData();
    });

    $: activeSection =
        concepts && concepts.length > 0 ? concepts[activeTabIndex] : null;
    $: initials =
        activeSection && activeSection.id === "ci"
            ? "CI"
            : activeSection && activeSection.id === "ip"
              ? "IP"
              : activeSection && activeSection.id === "jerarquia"
                ? "JH"
                : "GI";

    $: isGuideMode =
        activeSection && activeSection.id === "guia" && currentCardIndex > 0;

    $: activeItem =
        activeSection && currentCardIndex >= 2
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
        if (!activeSection) return;
        const totalCards =
            activeSection.id === "guia"
                ? 2
                : (activeSection.items?.length || 0) + 2;
        currentCardIndex = (currentCardIndex + 1) % totalCards;
    }

    function prevCard() {
        if (!activeSection) return;
        const totalCards =
            activeSection.id === "guia"
                ? 2
                : (activeSection.items?.length || 0) + 2;
        currentCardIndex = (currentCardIndex - 1 + totalCards) % totalCards;
    }

    function handleEditItem(item) {
        editingItem = { ...item };
    }

    function handleEditSection(section) {
        editingSection = { ...section };
    }

    function handleNewSection() {
        editingSection = {
            id: "new-section-" + Date.now(),
            title: "",
            description: "",
            order:
                concepts.length > 0
                    ? (Number(concepts[concepts.length - 1].order) || 0) + 1
                    : 1,
        };
    }

    function handleNewItem(sectionId) {
        const section = concepts.find((c) => c.id === sectionId);
        const lastOrder =
            section?.items?.length > 0
                ? Number(section.items[section.items.length - 1].order) || 0
                : 0;

        editingItem = {
            id: "new-item-" + Date.now(),
            sectionId: sectionId,
            label: "",
            summary: "",
            lawTitle: "",
            lawQuote: "",
            order: lastOrder + 1,
        };
    }

    function handleNewNode() {
        editingNewNode = true;
    }

    async function moveItem(item, direction) {
        if (!activeSection) return;
        const items = activeSection.items;
        const index = items.findIndex((i) => i.id === item.id);

        if (direction === "up" && index > 0) {
            await swapOrder("concept_items", item, items[index - 1]);
        } else if (direction === "down" && index < items.length - 1) {
            await swapOrder("concept_items", item, items[index + 1]);
        }
    }

    async function swapOrder(collectionName, item1, item2) {
        const { updateDoc, doc } = await import("firebase/firestore");
        const order1 = Number(item1.order) || 0;
        const order2 = Number(item2.order) || 0;

        const ref1 = doc(db, collectionName, item1.id);
        const ref2 = doc(db, collectionName, item2.id);

        try {
            await updateDoc(ref1, { order: order2 });
            await updateDoc(ref2, { order: order1 });
            await loadData();
        } catch (error) {
            console.error("Error swapping order:", error);
        }
    }

    async function handleSectionDeleted(event) {
        const section = event.detail;
        const { deleteDoc, doc } = await import("firebase/firestore");

        // Clean up items for this section
        const itemsToDelete = section.items || [];
        for (const item of itemsToDelete) {
            try {
                await deleteDoc(doc(db, "concept_items", item.id));
            } catch (error) {
                console.error("Error deleting orphaned item:", error);
            }
        }
    }

    function onSaveSuccess() {
        loadData();
        editingItem = null;
        editingSection = null;
    }
</script>

<section class="concept-navigation">
    <div class="tabs-wrapper">
        <div class="tabs conceptual-tabs">
            {#each concepts.slice(0, 3) as section, i}
                <div
                    class="tab-btn"
                    class:active={activeTabIndex === i}
                    on:click={() => changeTab(i)}
                    role="button"
                    tabindex="0"
                    on:keydown={(e) => e.key === "Enter" && changeTab(i)}
                >
                    {section.title}
                    {#if isAdmin && activeTabIndex === i}
                        <button
                            class="tab-delete-btn"
                            on:click|stopPropagation={() => {
                                if (
                                    confirm(
                                        "¿Estás seguro de que deseas eliminar esta sección y TODOS sus contenidos? Esta acción no se puede deshacer.",
                                    )
                                ) {
                                    handleSectionDeleted({ detail: section });
                                    // Also delete the section itself
                                    (async () => {
                                        const { deleteDoc, doc } = await import(
                                            "firebase/firestore"
                                        );
                                        await deleteDoc(
                                            doc(
                                                db,
                                                "concept_sections",
                                                section.id,
                                            ),
                                        );
                                        loadData();
                                    })();
                                }
                            }}
                            title="Borrar sección y contenidos"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                />
                            </svg>
                        </button>
                    {/if}
                </div>
            {/each}

            {#if isAdmin}
                <button
                    class="tab-btn add-tab-btn"
                    on:click={handleNewSection}
                    title="Añadir nueva categoría"
                >
                    + Nueva
                </button>
            {/if}
        </div>

        {#if concepts && concepts.length > 3}
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
        {/if}
    </div>

    {#if activeSection}
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
                            {#if isAdmin}
                                <button
                                    class="admin-add-node-btn"
                                    on:click={handleNewNode}
                                >
                                    + Crear Nuevo Paso del Algoritmo
                                </button>
                            {/if}
                            <FlowNavigator
                                onExitFlow={handleExitFlow}
                                {isAdmin}
                            />
                        </div>
                    </div>
                {:else}
                    {#key `${activeTabIndex}-${currentCardIndex}`}
                        <div
                            in:fly={{ x: 20, duration: 300 }}
                            out:fade={{ duration: 150 }}
                            class="card carousel-card"
                        >
                            <div class="card-actions-top">
                                {#if currentCardIndex > 0}
                                    <button
                                        class="btn-reset-cover"
                                        title="Volver a la portada de {activeSection.title}"
                                        on:click={() => goToCard(0)}
                                    >
                                        {initials}
                                    </button>
                                {/if}

                                {#if isAdmin}
                                    <button
                                        class="edit-btn-top-inner"
                                        class:active={isReordering &&
                                            currentCardIndex === 1}
                                        on:click|stopPropagation={() => {
                                            if (currentCardIndex === 0) {
                                                handleEditSection(
                                                    activeSection,
                                                );
                                            } else if (currentCardIndex === 1) {
                                                isReordering = !isReordering;
                                            } else {
                                                handleEditItem(activeItem);
                                            }
                                        }}
                                        title={currentCardIndex === 0
                                            ? "Editar sección"
                                            : currentCardIndex === 1
                                              ? isReordering
                                                  ? "Finalizar reordenación"
                                                  : "Reordenar fichas"
                                              : "Editar elemento"}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                            />
                                        </svg>
                                    </button>
                                {/if}
                            </div>
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
                                    <div
                                        class="header-content title-card-header"
                                    >
                                        <h3>
                                            {activeSection.title ||
                                                "Sección sin título"}
                                        </h3>
                                        {#if activeSection.description}
                                            <p class="section-description">
                                                {activeSection.description}
                                            </p>
                                        {:else}
                                            <p class="subtitle">
                                                {activeSection.id === "guia"
                                                    ? "Herramienta interactiva para la toma de decisiones clínicas."
                                                    : "Información Fundamental y Marco Legal"}
                                            </p>
                                        {/if}
                                    </div>
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
                                                >{isReordering
                                                    ? "Modo Reordenar"
                                                    : "Índice de contenidos"}</span
                                            >
                                            <span class="separator-line"></span>
                                        </div>
                                    </div>
                                    <div
                                        class="index-grid"
                                        class:reordering={isReordering}
                                    >
                                        {#each activeSection.items || [] as item, i}
                                            <div class="index-item-container">
                                                <button
                                                    class="index-item"
                                                    on:click={() =>
                                                        !isReordering &&
                                                        goToCard(i + 2)}
                                                    disabled={isReordering}
                                                >
                                                    <span class="index-num"
                                                        >{i + 1}</span
                                                    >
                                                    <span class="index-label"
                                                        >{item.label}</span
                                                    >
                                                    {#if !isReordering}
                                                        <span
                                                            class="index-arrow"
                                                            >→</span
                                                        >
                                                    {/if}
                                                </button>

                                                {#if isAdmin && isReordering}
                                                    <div
                                                        class="index-admin-controls"
                                                    >
                                                        <button
                                                            class="move-btn"
                                                            on:click|stopPropagation={() =>
                                                                moveItem(
                                                                    item,
                                                                    "up",
                                                                )}
                                                            disabled={i === 0}
                                                            title="Subir"
                                                        >
                                                            ▲
                                                        </button>
                                                        <button
                                                            class="move-btn"
                                                            on:click|stopPropagation={() =>
                                                                moveItem(
                                                                    item,
                                                                    "down",
                                                                )}
                                                            disabled={i ===
                                                                activeSection
                                                                    .items
                                                                    .length -
                                                                    1}
                                                            title="Bajar"
                                                        >
                                                            ▼
                                                        </button>
                                                    </div>
                                                {/if}
                                            </div>
                                        {/each}

                                        {#if isAdmin && activeSection.id !== "guia" && !isReordering}
                                            <button
                                                class="index-item add-item-btn"
                                                on:click={() =>
                                                    handleNewItem(
                                                        activeSection.id,
                                                    )}
                                            >
                                                <span class="index-num">+</span>
                                                <span class="index-label"
                                                    >Añadir Nueva Ficha</span
                                                >
                                            </button>
                                        {/if}
                                    </div>
                                </div>
                            {:else if activeItem}
                                <!-- Item Card -->
                                <div class="item-card">
                                    <div class="card-num">
                                        <div class="num-circle">
                                            {currentCardIndex - 1}
                                        </div>
                                        <div class="header-content">
                                            <h4>{activeItem.label}</h4>
                                        </div>
                                    </div>
                                    <p>{activeItem.summary}</p>

                                    {#if activeItem.lawQuote}
                                        <LegalBox
                                            title={activeItem.lawTitle}
                                            content={activeItem.lawQuote}
                                        />
                                    {/if}

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

        {#if (activeSection.items?.length || 0) > 0 || activeSection.id === "guia"}
            <div class="indicators">
                <button
                    class="dot"
                    class:active={currentCardIndex === 0}
                    on:click={() => goToCard(0)}
                    aria-label="Portada"
                ></button>
                <button
                    class="dot"
                    class:active={currentCardIndex === 1}
                    on:click={() => goToCard(1)}
                    aria-label="Índice"
                ></button>
                {#each activeSection.items || [] as _, i}
                    <button
                        class="dot"
                        class:active={currentCardIndex === i + 2}
                        on:click={() => goToCard(i + 2)}
                        aria-label="Página {i + 1}"
                    ></button>
                {/each}
            </div>
        {/if}
    {:else}
        <div class="loading-concepts">
            <p>Cargando contenidos...</p>
        </div>
    {/if}
</section>

{#if editingItem}
    <EditModal
        node={editingItem}
        collectionName="concept_items"
        fields={[
            { name: "label", label: "Etiqueta / Título", type: "text" },
            { name: "summary", label: "Resumen explicativo", type: "textarea" },
            { name: "lawTitle", label: "Ref. Legal (Título)", type: "text" },
            { name: "lawQuote", label: "Cita Legal (Texto)", type: "textarea" },
        ]}
        on:close={() => (editingItem = null)}
        on:save={onSaveSuccess}
    />
{/if}

{#if editingSection}
    <EditModal
        node={editingSection}
        collectionName="concept_sections"
        fields={[
            { name: "title", label: "Título de la Sección", type: "text" },
            {
                name: "description",
                label: "Descripción / Resumen",
                type: "textarea",
            },
        ]}
        on:close={() => (editingSection = null)}
        on:save={onSaveSuccess}
        on:delete={handleSectionDeleted}
    />
{/if}

{#if editingNewNode}
    <EditModal
        node={{ id: "nuevo-nodo-" + Date.now(), type: "question", options: [] }}
        collectionName="nodes"
        fields={[
            { name: "id", label: "ID Técnico del Nodo", type: "text" },
            {
                name: "type",
                label: "Tipo",
                type: "select",
                options: [
                    { value: "question", label: "Pregunta" },
                    { value: "result", label: "Resultado" },
                ],
            },
            { name: "question", label: "Pregunta / Título", type: "text" },
            { name: "description", label: "Descripción", type: "textarea" },
            { name: "lawTitle", label: "Ref. Legal", type: "text" },
            { name: "lawQuote", label: "Cita Legal", type: "textarea" },
        ]}
        on:close={() => (editingNewNode = false)}
        on:save={() => location.reload()}
    />
{/if}

<style>
    .carousel-card {
        padding: 2.5rem;
        background: white;
        min-height: 320px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-bottom: 0;
        text-align: left;
        box-shadow: var(--shadow-md);
        position: relative;
        border-radius: var(--radius-lg);
    }

    .card-actions-top {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;
        display: flex;
        gap: 0.5rem;
        z-index: 10;
    }

    .btn-reset-cover {
        background: white;
        border: 1px solid #e2e8f0;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-primary);
        font-size: 0.75rem;
        font-weight: 800;
        cursor: pointer;
        transition: all 0.2s;
        box-shadow: var(--shadow-sm);
    }

    .btn-reset-cover:hover {
        background: #f8fafc;
        border-color: var(--color-primary);
        transform: scale(1.1);
    }

    .edit-btn-top-inner {
        width: 38px;
        height: 38px;
        background: white;
        border: 1px solid #e2e8f0;
        color: var(--color-secondary);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: var(--shadow-sm);
        transition: all 0.2s;
        cursor: pointer;
    }

    .edit-btn-top-inner:hover {
        transform: scale(1.1);
        border-color: var(--color-secondary);
        background: #fffafa;
    }

    .edit-btn-top-inner svg {
        width: 18px;
        height: 18px;
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
        flex: 1;
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
        cursor: pointer;
    }

    .index-item-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: relative;
    }

    .index-admin-controls {
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .move-btn {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 0.65rem;
        cursor: pointer;
        transition: all 0.2s;
        color: var(--color-primary);
    }

    .move-btn:hover:not(:disabled) {
        background: var(--color-primary);
        color: white;
        border-color: var(--color-primary);
    }

    .move-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
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
        min-width: 24px;
        height: 24px;
        background: var(--color-primary);
        color: white;
        border-radius: 50%;
        font-size: 0.75rem;
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

    .add-item-btn {
        background: #f1f5f9;
        border: 2px dashed #cbd5e1;
        color: var(--color-primary);
        font-weight: 700;
        opacity: 0.7;
    }

    .add-item-btn:hover {
        opacity: 1;
        border-color: var(--color-primary);
        background: white;
    }

    .add-tab-btn {
        background: rgba(255, 255, 255, 0.4) !important;
        border: 1px dashed var(--color-primary);
        color: var(--color-primary);
        font-weight: 800;
    }

    .add-tab-btn:hover {
        background: white !important;
        border-style: solid;
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
        cursor: pointer;
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

    .tab-delete-btn {
        background: rgba(239, 68, 68, 0.1);
        color: #ef4444;
        border: none;
        padding: 4px;
        border-radius: 4px;
        margin-left: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        opacity: 0.6;
    }

    .tab-delete-btn:hover {
        background: #ef4444;
        color: white;
        opacity: 1;
    }

    .tab-delete-btn svg {
        width: 14px;
        height: 14px;
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
    }

    .tab-btn.tab-guide.active {
        background: var(--color-primary);
        color: white;
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
        min-height: 350px;
        position: relative;
    }

    .carousel-container.is-flow {
        justify-content: center;
        align-items: flex-start;
    }

    .flow-wrapper {
        display: flex;
        justify-content: center;
        width: 100%;
    }

    .flow-inner {
        position: relative;
        width: 100%;
        max-width: 580px;
        padding-top: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .admin-add-node-btn {
        background: white;
        color: var(--color-primary);
        border: 2px dashed var(--color-primary);
        padding: 1rem;
        border-radius: 12px;
        font-weight: 700;
        cursor: pointer;
        transition: all 0.2s;
    }

    .admin-add-node-btn:hover {
        background: var(--color-primary);
        color: white;
    }

    .card-display {
        flex: 1;
        position: relative;
    }

    h4 {
        margin: 0;
        color: var(--color-primary-dark);
        font-size: 1.4rem;
        font-weight: 800;
    }

    p {
        font-size: 1.05rem;
        line-height: 1.6;
        color: var(--color-text-main);
        margin-bottom: 1rem;
    }

    .card-num {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        width: fit-content;
    }

    .num-circle {
        color: var(--color-primary);
        background: rgba(var(--color-primary-rgb), 0.1);
        border-radius: 8px;
        font-size: 0.85rem;
        font-weight: 800;
        padding: 6px 12px;
        flex-shrink: 0;
    }

    .nav-arrow {
        background: white;
        color: var(--color-text-muted);
        width: 48px;
        height: 48px;
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
        transform: scale(1.1);
    }

    .nav-arrow svg {
        width: 24px;
        height: 24px;
    }

    .indicators {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 2.5rem;
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: #cbd5e1;
        transition: all 0.3s;
        padding: 0;
        cursor: pointer;
        border: none;
    }

    .dot.active {
        background: var(--color-primary);
        width: 30px;
        border-radius: 5px;
    }

    .loading-concepts {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 350px;
        color: var(--color-text-muted);
        font-weight: 500;
    }

    @media (max-width: 640px) {
        .index-grid {
            grid-template-columns: 1fr;
        }

        .tabs-wrapper {
            flex-direction: column;
            gap: 0.5rem;
        }

        .carousel-container {
            gap: 0.5rem;
        }

        .nav-arrow {
            width: 36px;
            height: 36px;
        }
    }
</style>
