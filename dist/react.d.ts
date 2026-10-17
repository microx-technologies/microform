import { A as QuerySource, j as StorageAdapter, m as FieldType, o as Microform, p as FieldStructure, t as ZodObjectSchema } from "./zod-defaults-BgWJiK9W.js";
import { ReactElement, ReactNode } from "react";
import { Control, ControllerFieldState, ControllerRenderProps, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
//#region src/react/field-grid.d.ts
interface FieldGridProps<T extends string> {
  structure: FieldStructure<T>;
  renderField: (field: FieldType<T>) => ReactNode;
  renderSection?: (section: {
    key: string;
    title?: string;
    description?: string;
  }, children: ReactNode) => ReactNode;
  alignItemsEnd?: boolean;
  children?: ReactNode;
}
export declare function FieldGrid<T extends string>({ structure, renderField, renderSection, alignItemsEnd, children }: FieldGridProps<T>): ReactNode;
//#endregion
//#region src/react/form-fields.d.ts
interface FormFieldsItemArgs<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  rhf: ControllerRenderProps<TFieldValues, TName>;
  fieldState: ControllerFieldState;
  required: boolean;
  invalid: boolean;
}
interface FormFieldsProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  structure: FieldStructure<TName>;
  control: Control<TFieldValues>;
  renderItem: (field: FieldType<TName>, args: FormFieldsItemArgs<TFieldValues, TName>) => ReactNode;
  schema?: ZodObjectSchema;
  disabled?: boolean;
}
export declare function FormFields<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ structure, control, renderItem, schema, disabled }: FormFieldsProps<TFieldValues, TName>): ReactNode;
//#endregion
//#region src/react/infer-field.d.ts
interface InferFieldInputProps<Value = any> {
  type: string;
  value?: Value;
  inputValue?: string;
  onChange?: (val: Value | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
  name?: string;
  microform?: Microform<string>;
  fieldProps?: Record<string, unknown>;
  onUnknownType?: (type: string) => ReactNode;
}
export declare function InferFieldInput<Value = any>({ type, value, inputValue, onChange, onBlur, disabled, name, microform, fieldProps, onUnknownType }: InferFieldInputProps<Value>): ReactNode;
//#endregion
//#region src/react/provider.d.ts
export declare function MicroformProvider({ value, children }: {
  value: Microform<string>;
  children: ReactNode;
}): ReactElement;
export declare function useMicroformOptional(): Microform<string> | null;
export declare function useMicroform(): Microform<string>;
//#endregion
//#region src/react/struct-form.d.ts
type StructFormSubmitMode = "button" | "auto";
interface StructFormProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  structure: FieldStructure<TName>;
  form: UseFormReturn<TFieldValues>;
  renderItem: FormFieldsProps<TFieldValues, TName>["renderItem"];
  schema?: ZodObjectSchema;
  onSubmit: (data: TFieldValues) => void | Promise<void>;
  submitMode?: StructFormSubmitMode;
  submitLabel?: string;
  disabled?: boolean;
  children?: ReactNode;
}
export declare function StructForm<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>>({ structure, form, renderItem, schema, onSubmit, submitMode, submitLabel, disabled, children }: StructFormProps<TFieldValues, TName>): ReactNode;
//#endregion
//#region src/react/use-async-query.d.ts
interface UseAsyncQueryArgs<TItem> {
  source: QuerySource<TItem>;
  search?: string;
  page?: number;
  pageSize?: number;
  debounceMs?: number;
  enabled?: boolean;
}
interface UseAsyncQueryResult<TItem> {
  data: TItem[];
  total?: number;
  isLoading: boolean;
  error?: unknown;
  refetch: () => void;
}
export declare function useAsyncQuery<TItem>({ source, search, page, pageSize, debounceMs, enabled }: UseAsyncQueryArgs<TItem>): UseAsyncQueryResult<TItem>;
//#endregion
//#region src/react/use-infer-item.d.ts
interface UseInferItemArgs<Value = any> {
  persistKey?: string;
  storage?: StorageAdapter;
  prefix?: string;
  onChange?: (val: Value | undefined) => void;
}
interface UseInferItemResult<Value = any> {
  persistOnChange: ((val: Value | undefined) => void) | undefined;
}
/**
 * Headless item logic (core con slots): wraps `onChange` with persistence
 * write. The adapter owns label/description/error/required markup and calls
 * `persistOnChange` instead of raw `onChange`.
 *
 * Storage is injected per use (Option A): no globals, no registry wiring.
 * Without `storage` + `persistKey` it returns `onChange` untouched.
 */
export declare function useInferItem<Value = any>({ persistKey, storage, prefix, onChange }: UseInferItemArgs<Value>): UseInferItemResult<Value>;
//#endregion
//#region src/react/use-persistence.d.ts
interface UsePersistenceArgs<TFieldValues extends FieldValues = FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  persistKey?: string;
  storage: StorageAdapter;
  prefix?: string;
  onRestore?: (value: string | number | string[]) => void;
}
export declare function usePersistence<TFieldValues extends FieldValues = FieldValues>({ control, name, persistKey, storage, prefix, onRestore }: UsePersistenceArgs<TFieldValues>): void;
//#endregion
export type { FieldGridProps, FormFieldsItemArgs, FormFieldsProps, InferFieldInputProps, StructFormProps, StructFormSubmitMode, UseAsyncQueryArgs, UseAsyncQueryResult, UseInferItemArgs, UseInferItemResult, UsePersistenceArgs };
//# sourceMappingURL=react.d.ts.map