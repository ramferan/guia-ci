# Guía de Consentimiento Informado (Ley 41/2002)

Herramienta ágil diseñada para personal sanitario que facilita la navegación por el flujo de consentimiento informado, asegurando el cumplimiento de la normativa vigente en España.

## 🚀 Características
- **Flujo Guiado**: Árbol de decisión interactivo para situaciones programadas y de urgencia.
- **Marco Legal**: Referencias automáticas a la Ley 41/2002 y normativas autonómicas en cada paso.
- **Historial de Navegación**: Posibilidad de retroceder para corregir decisiones.
- **Diseño Premium**: Interfaz limpia y adaptada a dispositivos móviles/tablets para uso en planta.

## 🛠️ Tecnologías
- **Framework**: [Svelte](https://svelte.dev/) (Ligero y rápido).
- **Build Tool**: [Vite](https://vitejs.dev/).
- **Estilos**: Vanilla CSS con variables CSS modernas (Theme "Sanitario").
- **Datos**: Arquitectura basada en JSON (`src/lib/data/flow.js`) para fácil mantenimiento.

## 💻 Instalación y Uso Local

1. **Clonar el repositorio**:
   ```bash
   git clone <tu-repo-url>
   cd guia-ci
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Arrancar servidor de desarrollo**:
   ```bash
   npm run dev
   ```

4. **Construir para producción**:
   ```bash
   npm run build
   ```

## 📦 Despliegue (CI/CD)
Este proyecto está configurado para desplegarse automáticamente en **Firebase Hosting** mediante GitHub Actions.
- **Rama `main`**: Despliegue a Producción.
- **Rama `devel`**: Desarrollo (Pruebas locales).

Para activar el despliegue automático, es necesario configurar el secreto `FIREBASE_SERVICE_ACCOUNT_GUIA_CI` en el repositorio de GitHub.
