<script>
    import { db, auth } from "../firebase";
    import {
        collection,
        doc,
        getDocs,
        updateDoc,
        onSnapshot,
    } from "firebase/firestore";
    import { onMount } from "svelte";
    import { signOut } from "firebase/auth";

    let nodes = [];
    let loading = true;
    let selectedNode = null;
    let saveStatus = "";

    onMount(() => {
        // Real-time listener for nodes
        const unsubscribe = onSnapshot(collection(db, "nodes"), (snapshot) => {
            let loadedNodes = [];
            snapshot.forEach((doc) => {
                loadedNodes.push({ id: doc.id, ...doc.data() });
            });
            // Sort to keep 'start' first, then alphabetical or by logic could be better but basic sort for now
            loadedNodes.sort((a, b) => (a.id === "start" ? -1 : 1));
            nodes = loadedNodes;
            loading = false;
        });

        return () => unsubscribe();
    });

    async function handleSave() {
        if (!selectedNode) return;
        saveStatus = "saving";
        try {
            const nodeRef = doc(db, "nodes", selectedNode.id);
            await updateDoc(nodeRef, selectedNode);
            saveStatus = "success";
            setTimeout(() => (saveStatus = ""), 2000);
        } catch (e) {
            console.error(e);
            saveStatus = "error";
        }
    }

    function handleLogout() {
        signOut(auth);
    }
</script>

<div class="admin-layout">
    <header>
        <h3>Panel de Administración</h3>
        <button class="logout-btn" on:click={handleLogout}>Cerrar Sesión</button
        >
    </header>

    {#if loading}
        <p>Cargando datos...</p>
    {:else}
        <div class="content">
            <!-- Sidebar List -->
            <div class="sidebar">
                {#each nodes as node}
                    <button
                        class:active={selectedNode?.id === node.id}
                        on:click={() => {
                            selectedNode = { ...node };
                            saveStatus = "";
                        }}
                    >
                        {node.id}
                        <span class="type-badge">{node.type}</span>
                    </button>
                {/each}
            </div>

            <!-- Editor Area -->
            <div class="editor">
                {#if selectedNode}
                    <h2>Editando: {selectedNode.id}</h2>

                    <div class="field">
                        <label>Tipo</label>
                        <select bind:value={selectedNode.type}>
                            <option value="question">Pregunta</option>
                            <option value="result">Resultado</option>
                        </select>
                    </div>

                    {#if selectedNode.type === "question"}
                        <div class="field">
                            <label>Pregunta</label>
                            <textarea
                                rows="2"
                                bind:value={selectedNode.question}
                            ></textarea>
                        </div>
                        <div class="field">
                            <label>Descripción</label>
                            <textarea
                                rows="2"
                                bind:value={selectedNode.description}
                            ></textarea>
                        </div>
                    {:else}
                        <div class="field">
                            <label>Título</label>
                            <input
                                type="text"
                                bind:value={selectedNode.title}
                            />
                        </div>
                        <div class="field">
                            <label>Contenido</label>
                            <textarea rows="4" bind:value={selectedNode.content}
                            ></textarea>
                        </div>
                    {/if}

                    <div class="field">
                        <label>Referencia Legal</label>
                        <textarea rows="3" bind:value={selectedNode.legal}
                        ></textarea>
                    </div>

                    <!-- Options Editor (Basic JSON for now to avoid complexity) -->
                    {#if selectedNode.type === "question"}
                        <div class="field">
                            <label>Opciones (JSON)</label>
                            <p class="hint">
                                Edita con cuidado el formato JSON.
                            </p>
                            <textarea
                                rows="6"
                                value={JSON.stringify(
                                    selectedNode.options,
                                    null,
                                    2,
                                )}
                                on:input={(e) => {
                                    try {
                                        selectedNode.options = JSON.parse(
                                            e.target.value,
                                        );
                                    } catch (err) {
                                        // Invalid JSON, ignore update
                                    }
                                }}
                            ></textarea>
                        </div>
                    {/if}

                    <div class="actions">
                        <button class="save-btn" on:click={handleSave}>
                            {saveStatus === "saving"
                                ? "Guardando..."
                                : "Guardar Cambios"}
                        </button>
                        {#if saveStatus === "success"}
                            <span class="success-msg">¡Guardado!</span>
                        {/if}
                        {#if saveStatus === "error"}
                            <span class="error-msg">Error al guardar</span>
                        {/if}
                    </div>
                {:else}
                    <div class="empty-state">
                        Selecciona un nodo de la izquierda para editarlo.
                    </div>
                {/if}
            </div>
        </div>
    {/if}
</div>

<style>
    .admin-layout {
        height: 100vh;
        display: flex;
        flex-direction: column;
    }
    header {
        background: #1e293b;
        color: white;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    header h3 {
        margin: 0;
    }
    .logout-btn {
        background: #ef4444;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .content {
        flex: 1;
        display: flex;
        overflow: hidden;
    }

    .sidebar {
        width: 250px;
        background: #f8fafc;
        border-right: 1px solid #e2e8f0;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
    }
    .sidebar button {
        text-align: left;
        padding: 1rem;
        border: none;
        background: transparent;
        border-bottom: 1px solid #eee;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .sidebar button:hover {
        background: #f1f5f9;
    }
    .sidebar button.active {
        background: #e2e8f0;
        font-weight: bold;
        border-left: 3px solid var(--color-primary);
    }
    .type-badge {
        font-size: 0.7rem;
        background: #cbd5e1;
        padding: 2px 6px;
        border-radius: 4px;
    }

    .editor {
        flex: 1;
        padding: 2rem;
        overflow-y: auto;
    }
    .field {
        margin-bottom: 1.5rem;
    }
    .field label {
        display: block;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: #475569;
    }
    .field textarea,
    .field input,
    .field select {
        width: 100%;
        border: 1px solid #cbd5e1;
        padding: 0.5rem;
        border-radius: 6px;
    }
    .hint {
        font-size: 0.8rem;
        color: #64748b;
        margin-top: -0.2rem;
    }

    .save-btn {
        background: var(--color-primary);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 6px;
        font-weight: bold;
        cursor: pointer;
    }
    .success-msg {
        color: green;
        margin-left: 1rem;
        font-weight: bold;
    }
    .error-msg {
        color: red;
        margin-left: 1rem;
        font-weight: bold;
    }
</style>
