<script>
    import { slide } from "svelte/transition";
    import { db } from "../firebase";
    import {
        doc,
        getDoc,
        collection,
        getDocs,
        query,
        where,
    } from "firebase/firestore";
    import { onMount, afterUpdate } from "svelte";

    export let type = ""; // ID of the concept section
    export let isOpen = false;

    let current = null;
    let loading = false;
    let lastType = "";

    async function fetchInfo() {
        if (!type || type === lastType) return;
        loading = true;
        try {
            const docRef = doc(db, "concept_sections", type);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const sectionData = docSnap.data();

                // Fetch items for this section
                const itemsQuery = query(
                    collection(db, "concept_items"),
                    where("sectionId", "==", type),
                );
                const itemsSnap = await getDocs(itemsQuery);
                const items = itemsSnap.docs.map((d) => d.data());
                items.sort((a, b) => (a.order || 0) - (b.order || 0));

                current = { ...sectionData, items };
                lastType = type;
            } else {
                current = null;
            }
        } catch (e) {
            console.error("Error fetching contextual info:", e);
            current = null;
        } finally {
            loading = false;
        }
    }

    $: if (isOpen && type) {
        fetchInfo();
    }
</script>

{#if isOpen}
    <div class="contextual-info" transition:slide>
        {#if loading}
            <p>Cargando información...</p>
        {:else if current}
            <h5>{current.title}</h5>
            {#if current.description}
                <p>{current.description}</p>
            {/if}
            {#if current.items && current.items.length > 0}
                <ul>
                    {#each current.items as item}
                        <li><strong>{item.label}:</strong> {item.summary}</li>
                    {/each}
                </ul>
            {/if}
        {/if}
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
