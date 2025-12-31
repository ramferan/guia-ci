<script>
  import { onMount, onDestroy } from "svelte";
  import { auth } from "./lib/firebase";
  import { onAuthStateChanged } from "firebase/auth";

  import FlowNavigator from "./lib/components/FlowNavigator.svelte";
  import Login from "./lib/components/Login.svelte";
  import AdminPanel from "./lib/components/AdminPanel.svelte";

  let currentRoute = window.location.hash;
  let user = null;
  let loadingAuth = true;

  onMount(() => {
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      user = currentUser;
      loadingAuth = false;
    });

    // Route Listener
    const handleHashChange = () => {
      currentRoute = window.location.hash;
    };
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      unsubscribeAuth();
      window.removeEventListener("hashchange", handleHashChange);
    };
  });
</script>

<main class="container">
  {#if currentRoute === "#/admin"}
    {#if loadingAuth}
      <div class="loading-screen">Cargando...</div>
    {:else if user}
      <AdminPanel />
    {:else}
      <Login />
    {/if}
  {:else}
    <!-- Public View -->
    <header>
      <h1>Guía de Consentimiento</h1>
      <p>Ley 41/2002 de Autonomía del Paciente</p>
    </header>

    <FlowNavigator />
  {/if}
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
