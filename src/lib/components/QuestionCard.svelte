<script>
  export let question = "";
  export let description = "";
  export let legal = "";
  export let options = [];
  export let onSelect = () => {};
  export let onBack = null; // Function or null
</script>

<div class="card">
  {#if onBack}
    <button class="btn-back" on:click={onBack}> ← Volver </button>
  {/if}

  <h2>{question}</h2>
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

  {#if legal}
    <div class="legal-box">
      <strong>⚖️ Marco Legal:</strong>
      {legal}
    </div>
  {/if}
</div>

<style>
  h2 {
    font-size: 1.5rem;
    margin-top: 0;
    margin-bottom: 0.5rem;
    color: var(--color-primary-dark);
  }

  .options-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .legal-box {
    margin-top: 2rem;
    padding: 1rem;
    background-color: #f1f5f9;
    border-left: 4px solid var(--color-text-muted);
    font-size: 0.9rem;
    color: var(--color-text-main);
    border-radius: 0 0.5rem 0.5rem 0;
  }

  .btn-back {
    background: none;
    color: var(--color-text-muted);
    font-size: 0.9rem;
    padding: 0;
    margin-bottom: 1rem;
    display: inline-block;
    width: auto;
    font-weight: 500;
  }
  .btn-back:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }
</style>
