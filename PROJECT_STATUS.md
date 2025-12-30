# Estado del Proyecto y Próximos Pasos

## 🟢 Estado Actual (v1.0)
La aplicación es funcional y cumple con los requisitos del MVP (Producto Mínimo Viable).

### ✅ Hecho
- [x] **Core de la App**: Implementado en Svelte + Vite.
- [x] **Flujo de Decisión**: Lógica completa según diagrama (Programada vs Urgencia).
- [x] **Marco Legal**: Citas de la Ley 41/2002 integradas en cada tarjeta.
- [x] **Navegación**: Sistema de "Volver" y "Reiniciar".
- [x] **UI/UX**: Diseño visual limpio y accesible.
- [x] **Datos**: Lógica separada en `src/lib/data/flow.js` para facilitar edición.

## 🚀 Configuración del Despliegue Automático (CI/CD)
Para que GitHub Actions despliegue la web automáticamente en Firebase Hosting al hacer push a `main`:

1. **Crear proyecto en Firebase**:
   - Ve a [console.firebase.google.com](https://console.firebase.google.com).
   - Crea un proyecto nuevo (ej: `guia-consentimiento-hospital`).

2. **Obtener Token de Despliegue (Service Account)**:
   - En tu terminal local, ejecuta: `firebase init hosting:github`.
   - Sigue los pasos (te pedirá loguearte).
   - **IMPORTANTE**: Si no quieres hacerlo por consola, ve a la configuración del repositorio en GitHub -> Settings -> Secrets -> Actions -> New Repository Secret.
   - Nombre: `FIREBASE_SERVICE_ACCOUNT_GUIA_CI` (o el nombre que hayas puesto en el archivo `.yml`).
   - Valor: El JSON de la cuenta de servicio de Firebase.

3. **Verificar Archivos**:
   - Asegúrate de que `firebase.json` está en la raíz (ya creado).
   - Asegúrate de que `.github/workflows/deploy.yml` está creado.

## 🔮 Roadmap (Futuro)

### Fase 2: Gestión de Contenidos (CMS)
*Objetivo: Que el equipo médico edite los textos sin tocar código.*
- **Opción A (Sencilla)**: Conectar `flow.js` con un Google Sheet. La app lee del Sheet al cargar.
- **Opción B (Profesional)**: Usar un Headless CMS (Decap CMS o Sanity) que permita editar visualmente y guarde el JSON.

### Fase 3: Analítica y Usuarios
*Objetivo: Saber cómo se usa la herramienta.*
- **Analítica**: Integrar Google Analytics para ver qué caminos son los más consultados.
- **Registro**: Si se requiere auditoría legal ("El Dr. X consultó esta guía a las 14:00"), añadir Login con Firebase Auth.
