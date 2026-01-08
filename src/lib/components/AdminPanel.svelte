<script>
    import { db, auth } from "../firebase";
    import {
        collection,
        doc,
        getDocs,
        updateDoc,
        setDoc,
        onSnapshot,
    } from "firebase/firestore";
    import { onMount } from "svelte";
    import { signOut } from "firebase/auth";

    let nodes = [];
    let conceptSections = [];
    let users = [];
    let loading = true;
    let activeTab = "nodes"; // 'nodes', 'concepts', 'users'
    let selectedNode = null;
    let selectedConcept = null;
    let saveStatus = "";
    let migrationStatus = ""; // '', 'migrating', 'success', 'error'

    onMount(() => {
        // Real-time listener for nodes
        const unsubscribeNodes = onSnapshot(
            collection(db, "nodes"),
            (snapshot) => {
                let loadedNodes = [];
                snapshot.forEach((doc) => {
                    loadedNodes.push({ id: doc.id, ...doc.data() });
                });
                loadedNodes.sort((a, b) => (a.id === "start" ? -1 : 1));
                nodes = loadedNodes;
            },
        );

        // Real-time listener for concept sections
        const unsubscribeConcepts = onSnapshot(
            collection(db, "concept_sections"),
            (snapshot) => {
                let loaded = [];
                snapshot.forEach((doc) => {
                    loaded.push({ id: doc.id, ...doc.data() });
                });
                loaded.sort((a, b) => a.order - b.order);
                conceptSections = loaded;
            },
        );

        // Real-time listener for users
        const unsubscribeUsers = onSnapshot(
            collection(db, "users"),
            (snapshot) => {
                let loaded = [];
                snapshot.forEach((doc) => {
                    loaded.push({ id: doc.id, ...doc.data() });
                });
                users = loaded;
                loading = false;
            },
        );

        return () => {
            unsubscribeNodes();
            unsubscribeConcepts();
            unsubscribeUsers();
        };
    });

    async function handleSaveNode() {
        if (!selectedNode) return;
        saveStatus = "saving";
        try {
            // Clean empty options
            if (selectedNode.type === "question" && selectedNode.options) {
                selectedNode.options = selectedNode.options.filter(
                    (o) => o.label.trim() !== "" || o.nextId !== "",
                );
            }

            const nodeRef = doc(db, "nodes", selectedNode.id);
            await setDoc(nodeRef, selectedNode); // Use setDoc to support new nodes too
            saveStatus = "success";
            setTimeout(() => (saveStatus = ""), 2000);
        } catch (e) {
            console.error(e);
            saveStatus = "error";
        }
    }

    function handleNewNode() {
        selectedNode = {
            id: "nuevo-nodo-" + Date.now().toString().slice(-4),
            type: "question",
            question: "",
            description: "",
            options: [],
            lawTitle: "",
            lawQuote: "",
        };
        saveStatus = "";
    }

    function addOption() {
        if (!selectedNode.options) selectedNode.options = [];
        selectedNode.options = [
            ...selectedNode.options,
            { label: "", nextId: "" },
        ];
    }

    function removeOption(index) {
        selectedNode.options = selectedNode.options.filter(
            (_, i) => i !== index,
        );
    }

    async function handleUpdateUserRole(userId, newRole) {
        try {
            await updateDoc(doc(db, "users", userId), { role: newRole });
        } catch (e) {
            console.error("Error updating role:", e);
        }
    }

    function handleLogout() {
        signOut(auth);
    }
</script>

<div class="admin-layout">
    <header>
        <div class="header-main">
            <h3>Panel de Administración</h3>
            <div class="tabs">
                <button
                    class:active={activeTab === "nodes"}
                    on:click={() => (activeTab = "nodes")}>Nodos Guía</button
                >
                <button
                    class:active={activeTab === "concepts"}
                    on:click={() => (activeTab = "concepts")}>Fichas</button
                >
                <button
                    class:active={activeTab === "users"}
                    on:click={() => (activeTab = "users")}>Usuarios</button
                >
            </div>
        </div>
        <button class="logout-btn" on:click={handleLogout}>Cerrar Sesión</button
        >
    </header>

    {#if loading}
        <p>Cargando datos...</p>
    {:else}
        <div class="content">
            <!-- Sidebar List -->
            <div class="sidebar">
                <button class="new-btn" on:click={handleNewNode}>
                    + Nuevo Nodo
                </button>
                <div class="sidebar-list">
                    {#each nodes as node}
                        <button
                            class:active={selectedNode?.id === node.id}
                            on:click={() => {
                                selectedNode = { ...node };
                                saveStatus = "";
                            }}
                        >
                            <span class="node-id-text">{node.id}</span>
                            <span class="type-badge">{node.type}</span>
                        </button>
                    {/each}
                </div>
            </div>
            <!-- Editor Area -->
            <div class="editor">
                {#if activeTab === "nodes"}
                    {#if selectedNode}
                        <div class="editor-header">
                            <h2>Editando: {selectedNode.id}</h2>
                            <div class="id-editor">
                                <label for="node-id">ID Manual:</label>
                                <input
                                    id="node-id"
                                    type="text"
                                    bind:value={selectedNode.id}
                                    placeholder="id-unico"
                                />
                            </div>
                        </div>

                        <div class="field">
                            <label for="node-type">Tipo</label>
                            <select
                                id="node-type"
                                bind:value={selectedNode.type}
                            >
                                <option value="question">Pregunta</option>
                                <option value="result">Resultado</option>
                            </select>
                        </div>

                        {#if selectedNode.type === "question"}
                            <div class="field">
                                <label for="node-question">Pregunta</label>
                                <textarea
                                    id="node-question"
                                    rows="2"
                                    bind:value={selectedNode.question}
                                ></textarea>
                            </div>
                            <div class="field">
                                <label for="node-description">Descripción</label
                                >
                                <textarea
                                    id="node-description"
                                    rows="2"
                                    bind:value={selectedNode.description}
                                ></textarea>
                            </div>
                        {:else}
                            <div class="field">
                                <label for="node-title">Título</label>
                                <input
                                    id="node-title"
                                    type="text"
                                    bind:value={selectedNode.title}
                                />
                            </div>
                            <div class="field">
                                <label for="node-content">Contenido</label>
                                <textarea
                                    id="node-content"
                                    rows="4"
                                    bind:value={selectedNode.content}
                                ></textarea>
                            </div>
                        {/if}

                        <div class="field-group">
                            <div class="field">
                                <label for="node-lawTitle"
                                    >Ref. Legal (Título)</label
                                >
                                <input
                                    id="node-lawTitle"
                                    type="text"
                                    bind:value={selectedNode.lawTitle}
                                />
                            </div>
                            <div class="field">
                                <label for="node-lawQuote"
                                    >Cita Legal (Texto)</label
                                >
                                <textarea
                                    id="node-lawQuote"
                                    rows="4"
                                    bind:value={selectedNode.lawQuote}
                                ></textarea>
                            </div>
                        </div>

                        <div class="field">
                            <label for="node-infoType"
                                >Ayuda Contextual (Deprecada)</label
                            >
                            <select
                                id="node-infoType"
                                bind:value={selectedNode.infoType}
                            >
                                <option value="">(Ninguna)</option>
                                {#each conceptSections as section}
                                    <option value={section.id}
                                        >{section.title}</option
                                    >
                                {/each}
                            </select>
                        </div>

                        {#if selectedNode.type === "question"}
                            <div class="field">
                                <label>Destinos de las Opciones</label>
                                <div class="options-admin-list">
                                    {#each selectedNode.options || [] as option, i}
                                        <div class="option-block-admin">
                                            <div class="option-block-header">
                                                <span class="opt-index"
                                                    >Opción #{i + 1}</span
                                                >
                                                <button
                                                    class="btn-trash-admin"
                                                    on:click={() =>
                                                        removeOption(i)}
                                                    title="Eliminar opción"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        class="w-4 h-4"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                                                        />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div class="option-block-body">
                                                <div class="opt-field-group">
                                                    <label>Respuesta:</label>
                                                    <input
                                                        type="text"
                                                        bind:value={
                                                            option.label
                                                        }
                                                        placeholder="Texto que verá el usuario..."
                                                    />
                                                </div>
                                                <div class="opt-field-group">
                                                    <label>Destino:</label>
                                                    <select
                                                        bind:value={
                                                            option.nextId
                                                        }
                                                    >
                                                        <option value=""
                                                            >(Sin destino)</option
                                                        >
                                                        {#each nodes as n}
                                                            <option value={n.id}
                                                                >{n.id} - {n.question ||
                                                                    n.title ||
                                                                    ""}</option
                                                            >
                                                        {/each}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    {/each}
                                </div>
                                <button class="btn-add-opt" on:click={addOption}
                                    >+ Añadir Nueva Opción</button
                                >
                            </div>
                        {/if}

                        <div class="actions">
                            <button
                                class="save-btn"
                                on:click={handleSaveNode}
                                disabled={saveStatus === "saving"}
                            >
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
                {:else if activeTab === "concepts"}
                    <h2>Edición de Fichas</h2>
                    <p>En desarrollo...</p>
                {:else if activeTab === "users"}
                    <h2>Gestión de Usuarios</h2>
                    <div class="users-table-container">
                        <table class="users-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>UID</th>
                                    <th>Rol</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each users as user}
                                    <tr>
                                        <td>{user.email}</td>
                                        <td><code>{user.id}</code></td>
                                        <td>
                                            <select
                                                value={user.role}
                                                on:change={(e) =>
                                                    handleUpdateUserRole(
                                                        user.id,
                                                        e.currentTarget.value,
                                                    )}
                                            >
                                                <option value="admin"
                                                    >Administrador</option
                                                >
                                                <option value="editor"
                                                    >Editor</option
                                                >
                                                <option value="viewer"
                                                    >Lector</option
                                                >
                                            </select>
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
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

    .header-main {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .tabs {
        display: flex;
        gap: 0.5rem;
    }

    .tabs button {
        background: #334155;
        color: #cbd5e1;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        font-size: 0.9rem;
    }

    .tabs button:hover {
        background: #475569;
        color: white;
    }

    .tabs button.active {
        background: var(--color-primary);
        color: white;
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
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    .sidebar-list button {
        width: 100%;
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
    .sidebar-list button:hover {
        background: #f1f5f9;
    }
    .sidebar-list button.active {
        background: #e2e8f0;
        font-weight: bold;
        border-left: 3px solid var(--color-primary);
    }
    .new-btn {
        background: var(--color-primary);
        color: white;
        margin: 1rem;
        padding: 0.75rem;
        border-radius: 8px;
        text-align: center;
        font-weight: 700;
        cursor: pointer;
        border: none;
        box-shadow: var(--shadow-sm);
    }
    .new-btn:hover {
        background: var(--color-primary-dark);
        transform: translateY(-1px);
    }
    .node-id-text {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 140px;
    }
    .type-badge {
        font-size: 0.65rem;
        background: #e2e8f0;
        color: #475569;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: 700;
        text-transform: uppercase;
    }

    .editor-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 2px solid #f1f5f9;
    }

    .id-editor {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.9rem;
    }

    .id-editor input {
        width: 150px !important;
        font-family: monospace;
        font-weight: 700;
        color: var(--color-primary);
    }

    /* Options Admin Editor Stacked */
    .options-admin-list {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        margin-bottom: 1rem;
    }

    .option-block-admin {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: var(--shadow-sm);
    }

    .option-block-header {
        background: #f8fafc;
        padding: 0.5rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e2e8f0;
    }

    .opt-index {
        font-size: 0.75rem;
        font-weight: 800;
        color: #94a3b8;
        text-transform: uppercase;
    }

    .option-block-body {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .opt-field-group {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .opt-field-group label {
        font-size: 0.7rem !important;
        margin: 0 !important;
        color: #64748b !important;
    }

    .btn-trash-admin {
        background: transparent;
        color: #94a3b8;
        border: none;
        padding: 0.3rem;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all 0.2s;
    }

    .btn-trash-admin:hover {
        background: #fee2e2;
        color: #ef4444;
    }

    .btn-trash-admin svg {
        width: 16px;
        height: 16px;
    }

    .btn-add-opt {
        background: white;
        color: var(--color-primary);
        border: 2px dashed var(--color-primary);
        padding: 0.75rem;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        width: 100%;
        transition: all 0.2s;
    }

    .btn-add-opt:hover {
        background: var(--color-primary-light);
        color: white;
        border-color: transparent;
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
        color: #ef4444;
        margin-left: 1rem;
        font-weight: bold;
    }

    /* Users Table */
    .users-table-container {
        background: white;
        border-radius: 8px;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
        overflow: hidden;
        margin-top: 1rem;
    }

    .users-table {
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }

    .users-table th,
    .users-table td {
        padding: 1rem;
        border-bottom: 1px solid #e2e8f0;
    }

    .users-table th {
        background: #f8fafc;
        font-weight: 600;
        color: #475569;
    }

    .users-table select {
        padding: 0.4rem;
        border-radius: 4px;
        border: 1px solid #cbd5e1;
        font-size: 0.9rem;
    }

    code {
        background: #f1f5f9;
        padding: 0.2rem 0.4rem;
        border-radius: 4px;
        font-family: monospace;
        font-size: 0.85rem;
    }
</style>
