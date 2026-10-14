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
import { basicControls } from "./controls";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Label } from "./components/ui/label";

const profileSchema = z.object({
  fullName: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  experienceYears: z.number().min(0).default(1),
  role: z.enum(["frontend", "backend", "fullstack", "devops"]),
  bio: z.string().optional(),
  receiveNewsletter: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const structure: FieldStructure<keyof ProfileFormValues> = [
  {
    kind: "section",
    key: "personal",
    title: "Información Personal",
    description: "Datos de contacto y perfil profesional",
    children: [
      {
        fields: [
          {
            type: "text",
            name: "fullName",
            label: "Nombre Completo",
            placeholder: "Ej. Ada Lovelace",
            colspan: 8,
          },
          {
            type: "number",
            name: "experienceYears",
            label: "Años de Exp.",
            placeholder: "3",
            colspan: 4,
          },
        ],
      },
      {
        fields: [
          {
            type: "email",
            name: "email",
            label: "Correo Electrónico",
            placeholder: "ada@example.com",
            colspan: 6,
          },
          {
            type: "select",
            name: "role",
            label: "Especialidad / Rol",
            colspan: 6,
            options: [
              { value: "frontend", label: "Frontend Developer" },
              { value: "backend", label: "Backend Developer" },
              { value: "fullstack", label: "Fullstack Engineer" },
              { value: "devops", label: "DevOps / SRE" },
            ],
          },
        ],
      },
    ],
  },
  {
    kind: "section",
    key: "details",
    title: "Detalles Adicionales",
    description: "Trayectoria y preferencias",
    children: [
      {
        type: "textarea",
        name: "bio",
        label: "Biografía",
        placeholder: "Resumen de tu experiencia...",
      },
      {
        type: "checkbox",
        name: "receiveNewsletter",
        label: "Preferencias",
        placeholder: "Deseo recibir novedades y actualizaciones técnicas",
      },
    ],
  },
];

const microform = createMicroform({
  controls: basicControls,
});

export default function App() {
  const defaultValues = React.useMemo(() => createFormDefaults(profileSchema), []);

  const form = useForm<ProfileFormValues>({
    defaultValues,
  });

  const onSubmit = (data: ProfileFormValues) => {
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
                schema={profileSchema}
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
