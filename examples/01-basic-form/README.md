# 01 - Formulario Básico

Ejemplo base de integración entre **microform**, **React Hook Form**, esquemas **Zod** y componentes oficiales de **shadcn/ui** con **Tailwind CSS**.

![01 - Formulario Básico](./screenshot.png)

## Características Demostradas

1. **Inferencia Automática de Defaults (`createFormDefaults`)**:
   - Extrae recursivamente los valores iniciales tipados directamente desde el esquema Zod (`z.string()`, `z.number()`, `z.boolean()`, `z.enum()`), eliminando código repetitivo.
2. **Detección de Campos Requeridos (`buildRequiredMap`)**:
   - `FormFields` detecta de manera estática qué campos son obligatorios u opcionales según el esquema Zod y los expone mediante el argumento `required`.
3. **Grid Layout Declarativo de 12 Columnas**:
   - Soporte nativo para `FieldSection` (títulos y descripciones de sección) y `FieldRow` (distribución en columnas vía `colspan`).
   - Por defecto, `columns` es opcional y adopta el estándar de 12 columnas (`MAX_COLUMNS = 12`).
4. **Componentes Oficiales de shadcn/ui**:
   - Configurado con `components.json` y dependencias oficiales de `@radix-ui/react-*`, `lucide-react` y variables semánticas de Tailwind CSS v4.
   - Controles base implementados: `text`, `email`, `number`, `textarea`, `select`, `checkbox`.

## Ejecución Local

Este ejemplo es completamente autónomo y no depende de monorepo workspaces:

```bash
# 1. Instalar dependencias
bun install

# 2. Iniciar servidor de desarrollo
bun run dev

# 3. Compilar para producción
bun run build
```

## Dependencia

El proyecto consume la versión publicada en GitHub:

```json
"dependencies": {
  "microform": "github:microx-technologies/microform#v0.2.1"
}
```
