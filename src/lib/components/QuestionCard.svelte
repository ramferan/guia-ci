<script>
  import LegalBox from "./LegalBox.svelte";
  import EditModal from "./EditModal.svelte";
  import { db } from "../firebase";
  import { collection, getDocs } from "firebase/firestore";

  export let nodeId = "";
  export let question = "";
  export let description = "";
  export let lawTitle = "";
  export let lawQuote = "";
  export let options = [];
  export let onSelect = (id) => {};
  export let onBack = null; // Function or null
  export let onExitFlow = null; // Function to exit flow
  export let isAdmin = false;

  let isEditing = false;
  let nodeOptions = [];

  async function handleEdit() {
    try {
      const snap = await getDocs(collection(db, "nodes"));
      nodeOptions = snap.docs.map((doc) => ({
        value: doc.id,
        label: `${doc.id} - ${doc.data().question || doc.data().title || ""}`,
      }));
      isEditing = true;
    } catch (e) {
      console.error("Error fetching node options:", e);
      alert("Error al cargar los destinos de las preguntas.");
    }
  }

  function onSaveSuccess() {
    location.reload();
  }
</script>

<div class="card">
  <div class="card-actions-top">
    <div class="nav-group">
      {#if onBack}
        <button class="btn-reset-cover" title="Volver" on:click={onBack}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style="width: 20px; height: 20px;"
          >
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      {/if}

      {#if onExitFlow}
        <button
          class="btn-reset-cover"
          title="Volver a la portada de la Guía"
          on:click={onExitFlow}
        >
          GI
        </button>
      {/if}
    </div>

    <div class="admin-group">
      {#if isAdmin}
        <button
          class="edit-btn-top-inner"
          on:click={handleEdit}
          title="Editar pregunta"
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
  </div>

  <div class="question-header">
    <h2>{question}</h2>
  </div>
  {#if description}
    <p style="color: var(--color-text-muted); margin-bottom: 2rem;">
      {description}
    </p>
  {/if}

  <div class="options-grid">
    {#each options as option}
      <button
        class="btn {option.style === 'urgent' ? 'btn-urgent' : 'btn-primary'}"
        on:click={() => onSelect(option.nextId)}
      >
        {option.label}
      </button>
    {/each}
  </div>

  {#if lawQuote}
    <LegalBox title={lawTitle} content={lawQuote} />
  {/if}

  {#if onExitFlow}
    <button class="btn-goto-index" on:click={onExitFlow}>
      &lt; Volver a la portada
    </button>
  {/if}
</div>

{#if isEditing}
  <EditModal
    node={{
      id: nodeId,
      question,
      description,
      lawTitle,
      lawQuote,
      type: "question",
      options,
    }}
    collectionName="nodes"
    fields={[
      {
        name: "type",
        label: "Tipo de Nodo",
        type: "select",
        options: [
          { value: "question", label: "Pregunta" },
          { value: "result", label: "Resultado" },
        ],
      },
      { name: "question", label: "Pregunta", type: "text" },
      { name: "description", label: "Texto descriptivo", type: "textarea" },
      { name: "lawTitle", label: "Ref. Legal (Título)", type: "text" },
      { name: "lawQuote", label: "Cita Legal (Texto)", type: "textarea" },
      {
        name: "options",
        label: "Destinos de las opciones",
        type: "options",
        nodeOptions: nodeOptions,
      },
    ]}
    on:close={() => (isEditing = false)}
    on:save={onSaveSuccess}
  />
{/if}

<style>
  .question-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .card {
    position: relative;
    padding: 2rem;
    min-height: 350px;
    display: flex;
    flex-direction: column;
  }

  h2 {
    font-size: 1.5rem;
    margin: 0;
    line-height: 1.4;
    color: var(--color-primary-dark);
  }

  .options-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .card-actions-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
    z-index: 20;
  }

  .nav-group,
  .admin-group {
    display: flex;
    gap: 0.5rem;
  }

  .edit-btn-top-inner,
  .btn-reset-cover {
    background: white;
    border: 1px solid #e2e8f0;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: var(--shadow-sm);
    position: static;
    font-weight: 700;
  }

  .edit-btn-top-inner:hover,
  .btn-reset-cover:hover {
    background: #f8fafc;
    border-color: var(--color-primary);
    transform: scale(1.1);
  }

  .edit-btn-top-inner svg {
    width: 18px;
    height: 18px;
  }

  .btn-goto-index {
    align-self: flex-start;
    background: none;
    color: var(--color-primary);
    font-size: 0.85rem;
    padding: 0;
    margin-top: 1.5rem;
    font-weight: 600;
    width: auto;
    cursor: pointer;
  }

  .btn-goto-index:hover {
    text-decoration: underline;
  }
</style>
