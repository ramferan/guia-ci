<script>
    import { db } from "../firebase";
    import { doc, setDoc } from "firebase/firestore";
    import { createEventDispatcher } from "svelte";

    export let node = { id: "" }; // Node from Firestore to edit
    export let collectionName = "nodes"; // 'nodes', 'concept_items', etc.
    export let fields = []; // List of fields to edit: { name, label, type: 'text'|'textarea' }

    const dispatch = createEventDispatcher();
    let loading = false;
    let _editData = node ? Object.assign({}, node) : {}; // Renamed shadow variable

    function addOption() {
        if (!_editData.options) _editData.options = [];
        _editData.options = [..._editData.options, { label: "", nextId: "" }];
    }

    function removeOption(index) {
        _editData.options = _editData.options.filter((_, i) => i !== index);
    }

    async function handleSave() {
        if (loading) return;
        loading = true;
        try {
            // Clean empty options before saving if it's a question
            if (_editData.type === "question" && _editData.options) {
                _editData.options = _editData.options.filter(
                    (o) => o.label.trim() !== "" || o.nextId !== "",
                );
            }

            const docRef = doc(db, collectionName, node.id || _editData.id);
            await setDoc(docRef, _editData, { merge: true });
            dispatch("save", _editData);
            dispatch("close");
        } catch (error) {
            console.error("Error saving document:", error);
            alert("Error al guardar los cambios: " + error.message);
        } finally {
            loading = false;
        }
    }

    async function handleDelete() {
        if (
            !confirm(
                "¿Estás seguro de que deseas eliminar este elemento? Esta acción no se puede deshacer.",
            )
        )
            return;

        loading = true;
        try {
            const { deleteDoc } = await import("firebase/firestore");
            const docRef = doc(db, collectionName, node.id);
            await deleteDoc(docRef);
            dispatch("delete", node);
            dispatch("save"); // Trigger reload
            dispatch("close");
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("Error al eliminar: " + error.message);
        } finally {
            loading = false;
        }
    }

    function close() {
        dispatch("close");
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="modal-backdrop" on:click|self={close}>
    <div class="modal-content">
        <header>
            <h3>Editar Contenido</h3>
            <button class="close-btn" on:click={close}>&times;</button>
        </header>

        <form on:submit|preventDefault={handleSave}>
            {#each fields as field}
                <div class="form-group">
                    <label for={field.name}>{field.label}</label>
                    {#if field.type === "textarea"}
                        <textarea
                            id={field.name}
                            bind:value={_editData[field.name]}
                            rows="4"
                        ></textarea>
                    {:else if field.type === "select"}
                        <select
                            id={field.name}
                            bind:value={_editData[field.name]}
                        >
                            <option value="">(Ninguna)</option>
                            {#each field.options || [] as opt}
                                <option value={opt.value}>{opt.label}</option>
                            {/each}
                        </select>
                    {:else if field.type === "options"}
                        <div class="options-editor">
                            <div class="options-header">
                                <span>Configuración de Flujo</span>
                                <button
                                    type="button"
                                    class="btn-add"
                                    on:click={addOption}>+ Añadir Opción</button
                                >
                            </div>
                            {#each _editData[field.name] || [] as option, i}
                                <div class="option-group-card">
                                    <div class="option-group-header">
                                        <span class="option-label-tag"
                                            >Opción #{i + 1}</span
                                        >
                                        <button
                                            type="button"
                                            class="btn-trash"
                                            on:click={() => removeOption(i)}
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
                                    <div class="option-group-content">
                                        <div class="field-item">
                                            <span class="mini-caption"
                                                >Respuesta (Etiqueta):</span
                                            >
                                            <input
                                                type="text"
                                                bind:value={option.label}
                                                placeholder="Ej: Si / No / Paciente consciente..."
                                            />
                                        </div>
                                        <div class="field-item">
                                            <span class="mini-caption"
                                                >Destino (Ir a):</span
                                            >
                                            <select bind:value={option.nextId}>
                                                <option value=""
                                                    >(Sin destino / Fin de
                                                    flujo)</option
                                                >
                                                {#each field.nodeOptions || [] as nodeOption}
                                                    <option
                                                        value={nodeOption.value}
                                                        >{nodeOption.label}</option
                                                    >
                                                {/each}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            {/each}
                            {#if !_editData[field.name]?.length}
                                <p class="empty-msg">
                                    No hay opciones. Este nodo actuará como un
                                    bloque final a menos que añadas opciones.
                                </p>
                            {/if}
                        </div>
                    {:else}
                        <input
                            id={field.name}
                            type="text"
                            bind:value={_editData[field.name]}
                        />
                    {/if}
                </div>
            {/each}

            <div class="modal-actions">
                {#if node && node.id && !node.id.startsWith("new-") && !node.id.startsWith("nuevo-")}
                    <button
                        type="button"
                        class="btn-delete"
                        on:click={handleDelete}
                        disabled={loading}
                    >
                        Eliminar
                    </button>
                {/if}
                <div class="right-actions">
                    <button type="button" class="btn-cancel" on:click={close}
                        >Cancelar</button
                    >
                    <button type="submit" class="btn-save" disabled={loading}>
                        {loading ? "Guardando..." : "Guardar Cambios"}
                    </button>
                </div>
            </div>
        </form>
    </div>
</div>

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
    }

    .modal-content {
        background: white;
        padding: 2rem;
        border-radius: 12px;
        width: 95%;
        max-width: 600px;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        position: relative;
    }

    header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    header h3 {
        margin: 0;
        color: var(--color-primary-dark);
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #64748b;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.4rem;
        font-weight: 600;
        color: #475569;
        font-size: 0.9rem;
    }

    input,
    textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        font-family: inherit;
    }

    .modal-actions {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid #f1f5f9;
    }

    .right-actions {
        display: flex;
        gap: 1rem;
    }

    .btn-delete {
        background: white;
        color: #ef4444;
        border: 1px solid #fecaca;
        padding: 0.75rem 1.25rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-delete:active {
        transform: translateY(0);
    }

    .btn-save {
        background: var(--color-primary);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
    }

    .btn-cancel {
        background: #f1f5f9;
        color: #64748b;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
    }

    .options-editor {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1.25rem;
        background: #f8fafc;
        border-radius: 12px;
        border: 1px solid #e2e8f0;
    }

    .options-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-weight: 700;
        font-size: 0.85rem;
        color: #475569;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .option-group-card {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 0.75rem;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .option-group-header {
        background: #f8fafc;
        padding: 0.6rem 1rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e2e8f0;
    }

    .option-label-tag {
        font-size: 0.75rem;
        font-weight: 800;
        color: #64748b;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .btn-trash {
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

    .btn-trash:hover {
        background: #fee2e2;
        color: #ef4444;
    }

    .btn-trash svg {
        width: 16px;
        height: 16px;
    }

    .option-group-content {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .field-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .mini-caption {
        font-size: 0.65rem;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
    }

    .option-group-content input,
    .option-group-content select {
        width: 100%;
        padding: 0.6rem;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font-size: 0.9rem;
    }

    .btn-add {
        background: var(--color-primary);
        color: white;
        border: none;
        padding: 0.4rem 0.8rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;
    }

    .empty-msg {
        font-size: 0.85rem;
        color: #94a3b8;
        text-align: center;
        font-style: italic;
        margin: 0.5rem 0;
    }
</style>
