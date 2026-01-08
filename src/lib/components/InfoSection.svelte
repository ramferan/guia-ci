<script>
    export let title = "";
    export let definition = "";
    export let steps = [];
    export let laws = "";
</script>

<div class="info-section">
    <div class="header">
        <div class="icon">
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
                    d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.835a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
            </svg>
        </div>
        <h3>{title}</h3>
    </div>

    <div class="content">
        {#if definition}
            <p class="definition">{definition}</p>
        {/if}

        {#if steps && steps.length > 0}
            <div class="steps-container">
                <h4>Pasos a seguir:</h4>
                <ol class="steps-list">
                    {#each steps as step}
                        <li>{step}</li>
                    {/each}
                </ol>
            </div>
        {/if}

        {#if laws}
            <div class="laws-box">
                <strong>⚖️ Detalle Legal:</strong>
                <p>{laws}</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .info-section {
        background: #fdfdfd;
        border: 1px solid #e2e8f0;
        border-radius: var(--radius-lg);
        padding: 1.5rem;
        margin-top: 1.5rem;
        text-align: left;
        box-shadow: var(--shadow-sm);
    }

    .header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;
        border-bottom: 2px solid #f1f5f9;
        padding-bottom: 0.75rem;
    }

    .icon {
        color: var(--color-accent);
        width: 24px;
        height: 24px;
    }

    h3 {
        margin: 0;
        font-size: 1.1rem;
        color: var(--color-primary-dark);
    }

    .definition {
        font-size: 0.95rem;
        color: var(--color-text-main);
        line-height: 1.5;
        margin-bottom: 1.25rem;
        font-weight: 500;
    }

    h4 {
        font-size: 0.9rem;
        margin: 0 0 0.5rem 0;
        color: var(--color-text-muted);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .steps-list {
        margin: 0;
        padding-left: 1.25rem;
        font-size: 0.95rem;
        color: var(--color-text-main);
    }

    .steps-list li {
        margin-bottom: 0.5rem;
        line-height: 1.4;
    }

    .laws-box {
        margin-top: 1.25rem;
        padding: 0.75rem;
        background-color: #f8fafc;
        border-radius: 0.5rem;
        font-size: 0.85rem;
        color: var(--color-text-muted);
        border: 1px dashed #cbd5e1;
    }

    .laws-box strong {
        color: var(--color-text-main);
        display: block;
        margin-bottom: 0.25rem;
    }

    .laws-box p {
        margin: 0;
    }
</style>
