# 03 - Puertos Asíncronos y Persistencia

Implementación avanzada que ilustra la **Arquitectura Hexagonal (Ports & Adapters)** aplicada a formularios con **microform**, **React Hook Form** y **shadcn/ui**.

![03 - Puertos Asíncronos y Persistencia](./screenshot.png)

## Características Demostradas

1. **Arquitectura Hexagonal (Puertos y Adaptadores)**:
   - Desacoplamiento total entre la lógica de negocio y las capas de infraestructura (almacenamiento local, APIs remotas, UI de notificaciones).
2. **Persistencia Automática de Borradores (`usePersistence`)**:
   - Conexión reactiva entre campos de React Hook Form y un `StorageAdapter` implementado con `window.localStorage`.
   - Auto-guarda los cambios en tiempo real y restaura el borrador de forma transparente al recargar la página.
3. **Búsqueda Asíncrona Remota (`useAsyncQuery`)**:
   - Fuente de datos paginada con debounce de 200ms y estados de carga.
   - Permite seleccionar un registro remoto y volcarlo directamente al formulario activo.
4. **Flujo de Envío Unificado (`handleSubmitFlow`)**:
   - Orquestador del ciclo de vida del formulario: ejecuta la mutación (`MutationPort`), reporta resultados vía `NotifyPort` (toasts interactivos), invalida cachés de consulta y limpia los borradores persistidos al completar con éxito.

## Ejecución Local

Proyecto autónomo e independiente:

```bash
# 1. Instalar dependencias
bun install

# 2. Iniciar servidor de desarrollo
bun run dev

# 3. Compilar para producción
bun run build
```

## Dependencia

```json
"dependencies": {
  "microform": "github:microx-technologies/microform#v0.2.1"
}
```
