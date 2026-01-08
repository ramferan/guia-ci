<script>
    export let title = "Marco Legal:";
    export let content = "";
</script>

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
        <strong>{title}</strong>
    </div>
    <slot>
        {#if content}
            <p class="legal-content">{content}</p>
        {/if}
    </slot>
</div>

<style>
    .legal-box {
        margin-top: 1.5rem;
        padding: 1rem;
        background-color: #f8fafc;
        border-left: 4px solid var(--color-primary);
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
        flex-shrink: 0;
    }

    .legal-box strong {
        font-size: 0.8rem;
        color: var(--color-primary-dark);
    }

    .legal-content {
        font-size: 0.9rem;
        color: var(--color-text-main);
        line-height: 1.6;
        margin: 0;
    }
</style>
