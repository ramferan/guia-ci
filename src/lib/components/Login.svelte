<script>
    import { auth } from "../firebase";
    import { signInWithEmailAndPassword } from "firebase/auth";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    async function handleLogin() {
        error = "";
        loading = true;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Auth state change will be handled by parent
        } catch (e) {
            console.error(e);
            error = "Error al iniciar sesión. Verifica tus credenciales.";
            if (e.code === "auth/invalid-credential") {
                error = "Correo o contraseña incorrectos.";
            }
        } finally {
            loading = false;
        }
    }
</script>

<div class="login-container">
    <h2>Acceso Administrador</h2>
    <form on:submit|preventDefault={handleLogin}>
        <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input
                type="email"
                id="email"
                bind:value={email}
                required
                placeholder="admin@ejemplo.com"
            />
        </div>

        <div class="form-group">
            <label for="password">Contraseña</label>
            <input
                type="password"
                id="password"
                bind:value={password}
                required
                placeholder="••••••••"
            />
        </div>

        {#if error}
            <div class="error-msg">{error}</div>
        {/if}

        <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Iniciar Sesión"}
        </button>
    </form>
</div>

<style>
    .login-container {
        max-width: 400px;
        margin: 4rem auto;
        padding: 2rem;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }

    h2 {
        text-align: center;
        color: var(--color-primary-dark);
        margin-bottom: 2rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
    }

    input {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid #e2e8f0;
        border-radius: 6px;
        box-sizing: border-box;
    }

    button {
        width: 100%;
        padding: 0.75rem;
        background: var(--color-primary);
        color: white;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
    }

    button:hover {
        background: var(--color-primary-dark);
    }
    button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    .error-msg {
        color: #dc2626;
        font-size: 0.9rem;
        margin-top: 0.5rem;
        text-align: center;
    }
</style>
