import * as React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  createFormDefaults,
  handleSubmitFlow,
  type MutationPort,
} from "microform";
import { useAsyncQuery, usePersistence } from "microform/react";
import { createLocalStorageAdapter } from "./adapters/local-storage";
import { toastManager, toastNotifyAdapter, type ToastItem } from "./adapters/toast";
import { userQuerySource, type UserRecord } from "./adapters/users-source";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Search,
  Loader2,
  ArrowRight,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

const storage = createLocalStorageAdapter();

const userFormSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico no válido"),
  notes: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

export default function App() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [isSubmittingMutation, setIsSubmittingMutation] = useState(false);

  useEffect(() => {
    return toastManager.subscribe(setToasts);
  }, []);

  const {
    data: users,
    total,
    isLoading: isSearchLoading,
    refetch,
  } = useAsyncQuery({
    source: userQuerySource,
    search: searchQuery,
    page,
    pageSize: 3,
    debounceMs: 200,
  });

  const totalPages = total ? Math.ceil(total / 3) : 1;

  const defaultValues = React.useMemo(() => createFormDefaults(userFormSchema), []);

  const form = useForm<UserFormValues>({
    defaultValues,
  });

  usePersistence({
    control: form.control,
    name: "name",
    storage,
    persistKey: "draft_user_name",
    onRestore: (val) => form.setValue("name", String(val)),
  });

  usePersistence({
    control: form.control,
    name: "email",
    storage,
    persistKey: "draft_user_email",
    onRestore: (val) => form.setValue("email", String(val)),
  });

  usePersistence({
    control: form.control,
    name: "notes",
    storage,
    persistKey: "draft_user_notes",
    onRestore: (val) => form.setValue("notes", String(val)),
  });

  const handleSelectUser = (u: UserRecord) => {
    form.setValue("userId", u.id);
    form.setValue("name", u.name);
    form.setValue("email", u.email);
    form.setValue("notes", `${u.role} en ${u.company}`);
  };

  const onSubmit = async (values: UserFormValues) => {
    setIsSubmittingMutation(true);

    const mockMutation: MutationPort["mutate"] = async (cleanedVars) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return { data: { success: true, updated: cleanedVars } };
    };

    await handleSubmitFlow({
      mutation: mockMutation,
      vars: values,
      notify: toastNotifyAdapter,
      successMessage: "Cambios guardados con éxito",
      resetForm: () => {
        storage.remove?.("form-persist:draft_user_name");
        storage.remove?.("form-persist:draft_user_email");
        storage.remove?.("form-persist:draft_user_notes");
        form.reset(defaultValues);
      },
      invalidate: () => {
        refetch();
      },
    });

    setIsSubmittingMutation(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 space-y-6">
      {/* Toast container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-xs w-full">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-3 rounded-lg shadow-lg border text-sm flex items-start gap-2 ${
              t.type === "success"
                ? "bg-slate-900 text-white border-slate-800"
                : "bg-red-900 text-white border-red-800"
            }`}
          >
            {t.type === "success" ? (
              <CheckCircle className="size-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="size-4 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs flex-1">{t.message}</div>
          </div>
        ))}
      </div>

      {/* Tarjeta de Búsqueda Asíncrona */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Buscar Usuarios (Async Source)</CardTitle>
            {isSearchLoading && <Loader2 className="size-4 animate-spin text-muted-foreground" />}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="size-4 absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, correo o empresa..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-9 h-9 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-2.5 border border-border rounded-lg bg-card hover:bg-muted/50 transition-colors flex items-center justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email} · {u.company}</div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleSelectUser(u)}
                  className="h-7 px-2 text-xs gap-1 shrink-0"
                >
                  Cargar <ArrowRight className="size-3" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <span>Página {page} de {totalPages}</span>
            <div className="flex gap-1">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="h-6 px-2 text-[11px]"
              >
                Ant.
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="h-6 px-2 text-[11px]"
              >
                Sig.
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta de Formulario con Persistencia */}
      <Card className="shadow-sm">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Edición con Persistencia</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Nombre Completo <span className="text-red-500 font-bold ml-1">*</span>
              </Label>
              <Input id="name" {...form.register("name")} placeholder="Nombre completo" />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">
                Correo Electrónico <span className="text-red-500 font-bold ml-1">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                {...form.register("email")}
                placeholder="usuario@dominio.com"
              />
              {form.formState.errors.email && (
                <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notes">Notas</Label>
              <Input
                id="notes"
                {...form.register("notes")}
                placeholder="Notas u observaciones"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                storage.remove?.("form-persist:draft_user_name");
                storage.remove?.("form-persist:draft_user_email");
                storage.remove?.("form-persist:draft_user_notes");
                form.reset(defaultValues);
              }}
            >
              Limpiar
            </Button>
            <Button type="submit" disabled={isSubmittingMutation}>
              {isSubmittingMutation ? "Guardando..." : "Guardar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
