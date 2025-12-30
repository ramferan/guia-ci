<script>
  import FlowNavigator from "./lib/components/FlowNavigator.svelte";
</script>

<main class="container">
  <header>
    <h1>Guía de Consentimiento</h1>
    <p>Ley 41/2002 de Autonomía del Paciente</p>
  </header>

  <FlowNavigator />
</main>

<style>
  header {
    text-align: center;
    margin-bottom: 3rem;
  }

  h1 {
    color: var(--color-primary-dark);
    margin: 0;
    font-size: 2rem;
  }

  p {
    color: var(--color-text-muted);
    margin-top: 0.5rem;
    font-weight: 500;
  }
</style>
