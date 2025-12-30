<script>
  export let title = "";
  export let content = "";
  export let legal = "";
  export let onRestart = () => {};
  export let onBack = null;
</script>

<div class="card result-card">
  {#if onBack}
    <div style="text-align: left; margin-bottom: 1rem;">
      <button class="btn-back" on:click={onBack}>← Volver</button>
    </div>
  {/if}

  <div class="icon-wrapper">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>

  <h2>{title}</h2>
  <p>{content}</p>

  {#if legal}
    <div class="legal-box">
      <strong>⚖️ Marco Legal:</strong>
      {legal}
    </div>
  {/if}

  <button
    class="btn btn-outline"
    on:click={onRestart}
    style="margin-top: 2rem;"
  >
    Volver al inicio
  </button>
</div>

<style>
  .result-card {
    text-align: center;
    border-top: 5px solid var(--color-primary);
  }

  .icon-wrapper {
    background-color: #ecfdf5;
    color: var(--color-primary);
    width: 64px;
    height: 64px;
    border-radius: 50%;
    margin: 0 auto 1.5rem auto;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 32px;
    height: 32px;
  }

  h2 {
    color: var(--color-text-main);
    margin-bottom: 1rem;
  }

  p {
    color: var(--color-text-muted);
    line-height: 1.6;
    font-size: 1.1rem;
  }

  .legal-box {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #f1f5f9;
    border-left: 4px solid var(--color-text-muted);
    font-size: 0.9rem;
    color: var(--color-text-main);
    text-align: left;
    border-radius: 0 0.5rem 0.5rem 0;
  }

  .btn-back {
    background: none;
    color: var(--color-text-muted);
    font-size: 0.9rem;
    padding: 0;
    width: auto;
    font-weight: 500;
  }
  .btn-back:hover {
    color: var(--color-primary);
    text-decoration: underline;
  }
</style>
