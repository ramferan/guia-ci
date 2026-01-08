<script>
  import ContextualInfo from "./ContextualInfo.svelte";

  export let title = "";
  export let content = "";
  export let legal = "";
  export let infoType = ""; // 'ci', 'ip', 'jerarquia'
  export let onBack = null;
  export let onExitFlow = null;

  let isHelpOpen = false;
</script>

<div class="card result-card">
  <div class="card-header">
    {#if onBack && false}
      <button class="btn-back" on:click={onBack}>&lt; Volver</button>
    {/if}

    {#if onExitFlow && false}
      <button
        class="btn-reset-cover"
        title="Volver a la portada de la Guía"
        on:click={onExitFlow}
      >
        GI
      </button>
    {/if}

    {#if infoType}
      <button
        class="btn-help"
        class:active={isHelpOpen}
        on:click={() => (isHelpOpen = !isHelpOpen)}
        title="Ver información adicional"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
          />
        </svg>
      </button>
    {/if}
  </div>

  <div class="icon-wrapper">
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
        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  </div>

  <h2>{title}</h2>
  <p>{content}</p>

  <ContextualInfo type={infoType} isOpen={isHelpOpen} />

  {#if legal}
    <div class="legal-box">
      <div class="legal-header">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          class="legal-svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z"
          />
        </svg>
        <strong>Marco Legal:</strong>
      </div>
      {legal}
    </div>
  {/if}

  {#if onExitFlow}
    <button class="btn-goto-index" on:click={onExitFlow}>
      &lt; Volver a la portada
    </button>
  {/if}
</div>

<style>
  .result-card {
    text-align: center;
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

  .legal-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.4rem;
  }

  .legal-svg {
    width: 20px;
    height: 20px;
    color: var(--color-primary);
  }

  .btn-reset-cover {
    position: absolute;
    top: 3rem;
    right: 3rem;
    width: 38px;
    height: 38px;
    background: var(--color-primary);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 900;
    box-shadow: var(--shadow-md);
    transition: all 0.2s;
    border: 2px solid white;
    z-index: 10;
    cursor: pointer;
    text-decoration: none;
  }

  .btn-reset-cover:hover {
    transform: scale(1.1);
    background: var(--color-primary-dark);
  }

  .legal-box strong {
    display: block;
    font-size: 0.8rem;
    color: var(--color-primary-dark);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .btn-help {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #f1f5f9;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
    border: 1px solid #e2e8f0;
  }

  .btn-help svg {
    width: 16px;
    height: 16px;
  }

  .btn-help:hover,
  .btn-help.active {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
    transform: scale(1.1);
  }

  .btn-back {
    background: none;
    color: var(--color-text-muted);
    font-size: 0.9rem;
    padding: 0;
    width: auto;
    font-weight: 500;
  }
  .btn-goto-index {
    align-self: center;
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
