# 02 - Controles Personalizados y OCP

Demostración del principio **Open/Closed (OCP)**: el núcleo de **microform** permanece cerrado a modificaciones, pero 100% abierto a extensiones en el espacio de usuario.

![02 - Controles Personalizados](./screenshot.png)

## Características Demostradas

1. **Extensibilidad sin Modificar el Core**:
   - Nuevos controles creados en la aplicación mediante `defineControl` e integrados sin tocar el paquete de `microform`.
   - Sistema de tipos seguro de extremo a extremo sin recurrir a `any`.
2. **Controles Creados en este Ejemplo**:
   - **`color_picker`**: Selector visual con paleta rápida de tonos y disparador nativo de color.
   - **`tag_input`**: Entrada de etiquetas interactivas (tags/chips) con soporte de teclado (Enter, coma, Backspace y borrado individual).
   - **`rating`**: Calificación de 1 a 5 estrellas con efectos hover dinámicos y badge de puntuación.
   - **`switch_toggle`**: Encapsulación del componente `Switch` oficial de shadcn/ui con título, descripción y layout en tarjeta.
3. **Composición en el Registry**:
   - Agrupación de controles vía `createMicroform({ controls: [...] })` e inyección mediante `MicroformProvider`.
4. **Grid y Secciones**:
   - Uso de `FieldSection` y `FieldRow` con spans de columnas personalizados (`colspan: 7` y `colspan: 5` para la fila superior).

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
