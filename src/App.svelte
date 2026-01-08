<script>
  import { onMount, onDestroy } from "svelte";
  import { auth, db } from "./lib/firebase";
  import { onAuthStateChanged } from "firebase/auth";
  import { doc, getDoc } from "firebase/firestore";

  import FlowNavigator from "./lib/components/FlowNavigator.svelte";
  import Login from "./lib/components/Login.svelte";
  import AdminPanel from "./lib/components/AdminPanel.svelte";
  import ConceptCards from "./lib/components/ConceptCards.svelte";

  let currentPath = window.location.pathname;
  let user = null;
  let userRole = null; // 'admin', 'editor', 'viewer', null
  let loadingAuth = true;

  async function fetchUserRole(uid) {
    try {
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        userRole = userDoc.data().role;
      } else {
        userRole = "viewer"; // Default for unknown users
      }
    } catch (e) {
      console.error("Error fetching role:", e);
      userRole = "viewer";
    }
  }

  onMount(() => {
    // Auth Listener
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      user = currentUser;
      if (currentUser) {
        await fetchUserRole(currentUser.uid);
      } else {
        userRole = null;
      }
      loadingAuth = false;
    });

    // Route Listener (Path routing)
    const handleLocationChange = () => {
      currentPath = window.location.pathname;
    };

    window.addEventListener("popstate", handleLocationChange);

    // Custom event to handle programmatic navigation
    window.addEventListener("pushstate", handleLocationChange);

    return () => {
      unsubscribeAuth();
      window.removeEventListener("popstate", handleLocationChange);
      window.removeEventListener("pushstate", handleLocationChange);
    };
  });

  // Helper for clean navigation
  function navigate(path) {
    window.history.pushState({}, "", path);
    window.dispatchEvent(new Event("pushstate"));
  }
</script>

<main class="container">
  {#if currentPath === "/admin"}
    {#if loadingAuth}
      <div class="loading-screen">Cargando...</div>
    {:else if user}
      {#if userRole === "admin"}
        <AdminPanel />
      {:else}
        <div class="unauthorized">
          <h2>Acceso Restringido</h2>
          <p>Tu cuenta ({user.email}) no tiene permisos de administrador.</p>
          <p>Contacta con un administrador para solicitar el rol.</p>
          <button class="btn btn-secondary" on:click={() => navigate("/")}
            >Volver al Inicio</button
          >
          <button class="btn btn-outline" on:click={() => auth.signOut()}
            >Cerrar Sesión</button
          >
        </div>
      {/if}
    {:else}
      <Login />
    {/if}
  {:else}
    <!-- Public View -->
    <header class="app-header">
      <div class="header-main">
        <h1>Guía de Consentimiento</h1>
        <p>Ley 41/2002 de Autonomía del Paciente</p>
      </div>
      <div class="header-actions">
        <button
          class="btn-user-profile"
          on:click={() => navigate("/admin")}
          title={user ? "Panel de Administración" : "Acceso Administrador"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="user-icon"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
        </button>
      </div>
    </header>

    <ConceptCards isAdmin={userRole === "admin"} />
  {/if}
</main>

<style>
  .app-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 2rem;
  }

  .btn-user-profile {
    background: white;
    border: 1px solid #e2e8f0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-primary);
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: var(--shadow-sm);
  }

  .btn-user-profile:hover {
    background: #f8fafc;
    border-color: var(--color-primary);
    transform: scale(1.05);
  }

  .user-icon {
    width: 24px;
    height: 24px;
  }

  .unauthorized {
    text-align: center;
    padding: 4rem 2rem;
    max-width: 500px;
    margin: 0 auto;
  }

  .unauthorized h2 {
    color: #dc2626;
    margin-bottom: 1rem;
  }

  .unauthorized p {
    margin-bottom: 1rem;
  }

  .unauthorized .btn {
    margin: 0.5rem;
  }

  .btn-secondary {
    background-color: #64748b;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }

  .btn-outline {
    background-color: transparent;
    border: 1px solid #cbd5e1;
    color: #64748b;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
  }
</style>
