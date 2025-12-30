<script>
    import { decisionFlow } from "../data/flow.js";
    import QuestionCard from "./QuestionCard.svelte";
    import ResultCard from "./ResultCard.svelte";
    import { fade, fly } from "svelte/transition";

    let currentNodeId = decisionFlow.initialNode;
    let history = []; // Stack to keep track of visited nodes

    $: currentNode = decisionFlow.nodes[currentNodeId];

    function handleSelect(nextId) {
        history = [...history, currentNodeId]; // Push current node to history
        currentNodeId = nextId;
    }

    function handleBack() {
        if (history.length === 0) return;
        const previousNodeId = history[history.length - 1];
        history = history.slice(0, -1); // Pop from history
        currentNodeId = previousNodeId;
    }

    function handleRestart() {
        history = [];
        currentNodeId = decisionFlow.initialNode;
    }
</script>

<div class="flow-container">
    {#key currentNodeId}
        <div in:fly={{ y: 20, duration: 400 }} out:fade={{ duration: 200 }}>
            {#if currentNode.type === "question"}
                <QuestionCard
                    question={currentNode.question}
                    description={currentNode.description}
                    legal={currentNode.legal}
                    options={currentNode.options}
                    onSelect={handleSelect}
                    onBack={history.length > 0 ? handleBack : null}
                />
            {:else if currentNode.type === "result"}
                <ResultCard
                    title={currentNode.title}
                    content={currentNode.content}
                    legal={currentNode.legal}
                    onRestart={handleRestart}
                    onBack={history.length > 0 ? handleBack : null}
                />
            {/if}
        </div>
    {/key}
</div>

<style>
    .flow-container {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
    }
</style>
