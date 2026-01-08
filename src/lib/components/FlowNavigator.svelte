<script>
    import { onMount } from "svelte";
    import { db } from "../firebase";
    import { doc, getDoc, collection, getDocs } from "firebase/firestore";
    import QuestionCard from "./QuestionCard.svelte";
    import ResultCard from "./ResultCard.svelte";
    import { fade, fly } from "svelte/transition";

    let currentNodeId = null;
    let initialNodeId = null;
    let nodes = {};
    let history = [];
    let loading = true;
    let error = null;

    onMount(async () => {
        try {
            const configSnap = await getDoc(doc(db, "config", "flow_settings"));
            if (configSnap.exists()) {
                initialNodeId = configSnap.data().initialNode;
                currentNodeId = initialNodeId;
            }

            const querySnapshot = await getDocs(collection(db, "nodes"));
            querySnapshot.forEach((doc) => {
                nodes[doc.id] = doc.data();
            });

            if (!initialNodeId || Object.keys(nodes).length === 0) {
                error = "No se encontraron datos.";
            }

            loading = false;
        } catch (e) {
            console.error("error", e);
            error = "Error al cargar.";
            loading = false;
        }
    });

    $: currentNode = nodes[currentNodeId];

    function handleSelect(nextId) {
        history = [...history, currentNodeId];
        currentNodeId = nextId;
    }

    function handleBack() {
        if (history.length === 0) return;
        const previousNodeId = history[history.length - 1];
        history = history.slice(0, -1);
        currentNodeId = previousNodeId;
    }

    function handleRestart() {
        history = [];
        currentNodeId = initialNodeId;
    }

    export let onExitFlow = () => {};
</script>

<div class="flow-container">
    {#if loading}
        <div class="loading">Cargando guía...</div>
    {:else if error}
        <div class="error">{error}</div>
    {:else}
        {#key currentNodeId}
            <div in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 200 }}>
                {#if currentNode}
                    {#if currentNode.type === "question"}
                        <QuestionCard
                            question={currentNode.question}
                            description={currentNode.description}
                            legal={currentNode.legal}
                            options={currentNode.options}
                            infoType={currentNode.infoType}
                            onSelect={handleSelect}
                            onBack={history.length > 0 ? handleBack : null}
                            {onExitFlow}
                        />
                    {:else if currentNode.type === "result"}
                        <ResultCard
                            title={currentNode.title}
                            content={currentNode.content}
                            legal={currentNode.legal}
                            infoType={currentNode.infoType}
                            onRestart={handleRestart}
                            onBack={history.length > 0 ? handleBack : null}
                            {onExitFlow}
                        />
                    {/if}
                {/if}
            </div>
        {/key}
    {/if}
</div>

<style>
    .flow-container {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
    }
</style>
