import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createFormDefaults,
  createMicroform,
  type FieldStructure,
} from "microform";
import {
  FormFields,
  InferFieldInput,
  MicroformProvider,
} from "microform/react";
import { customControlsList } from "./controls";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";

const projectSchema = z.object({
  projectName: z.string().min(2, "El nombre del proyecto es obligatorio"),
  accentColor: z.string().default("#3b82f6"),
  satisfactionRating: z
    .number()
    .min(1, "Otorga al menos 1 estrella")
    .default(5),
  techStack: z
    .array(z.string())
    .min(1, "Agrega al menos una tecnología")
    .default(["React", "TypeScript", "Tailwind CSS"]),
  isPublicRepository: z.boolean().default(true),
  enableDeployPreview: z.boolean().default(false),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

const structure: FieldStructure<keyof ProjectFormValues> = [
  {
    kind: "section",
    key: "branding",
    title: "Identidad del Proyecto",
    children: [
      {
        fields: [
          {
            type: "text",
            name: "projectName",
            label: "Nombre del Proyecto",
            placeholder: "Ej. Portal de Analíticas",
            colspan: 7,
          },
          {
            type: "color_picker",
            name: "accentColor",
            label: "Color de Acento",
            colspan: 5,
          },
        ],
      },
    ],
  },
  {
    kind: "section",
    key: "stack-and-rating",
    title: "Stack y Calificación",
    children: [
      {
        type: "tag_input",
        name: "techStack",
        label: "Stack Tecnológico",
        placeholder: "Escribe una tecnología y pulsa Enter",
      },
      {
        type: "rating",
        name: "satisfactionRating",
        label: "Calificación del Equipo",
      },
    ],
  },
  {
    kind: "section",
    key: "toggles",
    title: "Opciones de Publicación",
    children: [
      {
        fields: [
          {
            type: "switch_toggle",
            name: "isPublicRepository",
            label: "Visibilidad",
            title: "Repositorio Público",
            subtitle: "Acceso de lectura a colaboradores",
            colspan: 6,
          },
          {
            type: "switch_toggle",
            name: "enableDeployPreview",
            label: "Automatización",
            title: "Deploy Previews",
            subtitle: "Entorno de prueba en cada Pull Request",
            colspan: 6,
          },
        ],
      },
    ],
  },
];

const microform = createMicroform({
  controls: customControlsList,
});

export default function App() {
  const defaultValues = React.useMemo(() => createFormDefaults(projectSchema), []);

  const form = useForm<ProjectFormValues>({
    defaultValues,
  });

  const onSubmit = (data: ProjectFormValues) => {
    console.log("Submitted:", data);
  };

  return (
    <MicroformProvider value={microform}>
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card className="shadow-sm">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="p-6 space-y-6">
              <FormFields
                structure={structure}
                control={form.control}
                schema={projectSchema}
                renderItem={(field, { rhf, fieldState, required }) => (
                  <div className="space-y-1.5">
                    <Label htmlFor={rhf.name}>
                      {field.label}
                      {required && <span className="text-red-500 font-bold ml-1">*</span>}
                    </Label>
                    <InferFieldInput
                      type={field.type}
                      name={rhf.name}
                      value={rhf.value}
                      onChange={rhf.onChange}
                      onBlur={rhf.onBlur}
                      disabled={field.disabled}
                      fieldProps={field}
                    />
                    {field.description && (
                      <p className="text-xs text-muted-foreground">{field.description}</p>
                    )}
                    {fieldState.error && (
                      <p className="text-xs font-medium text-red-500">
                        {fieldState.error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </CardContent>

            <CardFooter className="flex justify-end gap-2 border-t border-border pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset(defaultValues)}
              >
                Restablecer
              </Button>
              <Button type="submit">Guardar</Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </MicroformProvider>
  );
}
