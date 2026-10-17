import { A as QuerySource, C as FileLike, D as MutationPort, E as FetchArgs, O as NotifyAdapter, S as FieldValue, T as forwardScalarValue, _ as isFieldSection, a as AnyRenderer, b as FieldRendererFn, c as resolveRenderer, d as FieldRow, f as FieldSection, g as isFieldRow, h as StructureNode, i as unwrapZodType, j as StorageAdapter, k as QueryResult, l as BaseField, m as FieldType, n as buildRequiredMap, o as Microform, p as FieldStructure, r as createFormDefaults, s as createMicroform, t as ZodObjectSchema, u as ControlFieldConfig, v as AsyncConfig, w as forwardArrayValue, x as FieldRendererProps, y as FieldControlDefinition } from "./zod-defaults-BgWJiK9W.js";
import { z } from "zod";
//#region src/adapters/memory-storage.d.ts
export declare function createMemoryStorage(seed?: Record<string, string>): StorageAdapter & {
  dump: () => Record<string, string>;
};
//#endregion
//#region src/catalog/options.d.ts
interface BaseOption<V extends string> {
  key: string;
  value: V;
  label: string;
}
interface SelectOption<V extends string = string> extends BaseOption<V> {}
interface PersonOption<V extends string = string> extends BaseOption<V> {
  subtitle?: string;
  avatarUrl?: string;
  initials?: string;
}
interface DrawerSelectOption<V extends string = string> extends PersonOption<V> {
  triggerLabel?: string;
}
interface CheckboxGroupOption<V extends string = string> extends BaseOption<V> {
  subtitle?: string;
  badge?: string;
  disabled?: boolean;
}
interface ModalPickerSettings<T = Record<string, unknown>> {
  getOption: (item: T) => PersonOption;
  modalTitle?: string;
  modalDescription?: string;
}
type AsyncCheckboxGroupData = CheckboxGroupOption[] | {
  items?: Record<string, unknown>[];
  totalItems?: number;
};
//#endregion
//#region src/catalog/configs.d.ts
/**
 * Canonical async contract: promise-based, framework-agnostic.
 * Consume with `useAsyncQuery({ source })` in `microform/react`.
 * Migration from hook-based sources (urql `useQuery`, react-query):
 * expose `{ fetch: async ({search,page,pageSize,signal}) => ({items,total}) }`
 * via `createAsyncSource` + `asQuerySource`, or wrap any client fetch.
 */
type AsyncSource<TItem = unknown> = QuerySource<TItem>;
interface TextConfig {
  type: "text";
}
interface EmailConfig {
  type: "email";
  autoComplete?: string;
}
interface PasswordConfig {
  type: "password";
  autoComplete?: string;
}
interface TextareaConfig {
  type: "textarea";
}
interface NumberConfig {
  type: "number";
}
interface SearchConfig {
  type: "search";
}
interface CalendarSettings {
  minDate?: string;
  maxDate?: string;
}
interface CalendarConfig {
  type: "calendar";
  calendarConfig?: CalendarSettings;
}
type SelectConfig = {
  type: "select";
  options: SelectOption[];
} | {
  type: "async_select";
  asyncSource: AsyncSource<SelectOption>;
  allOptionLabel?: string;
};
type ComboboxConfig = {
  type: "combobox";
  options: SelectOption[];
} | {
  type: "async_combobox";
  asyncSource: AsyncSource<SelectOption>;
};
type CheckboxGroupConfig = {
  type: "checkbox_group";
  options?: CheckboxGroupOption[];
  emptyMessage?: string;
} | {
  type: "async_checkbox_group";
  asyncSource: AsyncSource<CheckboxGroupOption>;
  getOption?: (item: Record<string, unknown>) => CheckboxGroupOption;
  options?: CheckboxGroupOption[];
  emptyMessage?: string;
};
/**
 * Minimal core: only primitive, UI-agnostic configs.
 * Specialized controls (rich_text, person_select, modal_picker,
 * drawer_select, upload_file, avatar_upload) are intentionally NOT
 * built-ins — see `src/examples/custom-controls.ts` for copy-paste
 * recipes to `defineControl` + `register` them in userland.
 */
type ControlConfig = TextConfig | EmailConfig | PasswordConfig | TextareaConfig | NumberConfig | SearchConfig | CalendarConfig | SelectConfig | ComboboxConfig | CheckboxGroupConfig;
type BuiltInType = ControlConfig["type"];
export declare const BUILT_IN_TYPES: readonly BuiltInType[];
//#endregion
//#region src/catalog/enum-options.d.ts
interface EnumOption<T extends string = string> {
  key: string;
  value: T;
  label: string;
}
export declare function createEnumOptions<T extends string = never>(labels: [T] extends [never] ? "You must provide an explicit generic type argument" : Record<NoInfer<T>, string>): EnumOption<T>[];
export declare function getOptionLabel(labels: Record<string, string>, value: string): string;
//#endregion
//#region src/core/define-control.d.ts
interface ControlDefinition<Type extends string, Config extends {
  type: Type;
}, Props = Record<string, unknown>, Value = any, Element = unknown> {
  type: Type;
  config?: Config;
  renderer: FieldRendererFn<Props, Value, Element>;
}
export declare function defineControl<const Type extends string, Config extends {
  type: Type;
}, Props = Record<string, unknown>, Value = any, Element = unknown>(def: ControlDefinition<Type, Config, Props, Value, Element>): ControlDefinition<Type, Config, Props, Value, Element>;
//#endregion
//#region src/core/infer.d.ts
export declare function inferInputValue(value: FieldValue | unknown): string | undefined;
//#endregion
//#region src/core/structure.d.ts
export declare const MAX_COLUMNS = 12;
export declare function validateColumns(n: number): boolean;
export declare function flattenStructure<T extends string>(structure: FieldStructure<T>): FieldType<T>[];
/**
 * Headless structural validation. Returns human-readable errors
 * (empty = valid). Checks columns range, colspan range + colspan<=columns,
 * non-empty rows/sections. Duplicate names are NOT errors (same field may
 * appear once; adapters may warn separately).
 */
export declare function validateStructure<T extends string>(structure: FieldStructure<T>): string[];
//#endregion
//#region src/data/async-source.d.ts
interface AsyncSourceResult<T> {
  data: T;
  totalItems?: number;
}
interface PromiseAsyncSource<T> {
  fetch: (search?: string, page?: number) => Promise<AsyncSourceResult<T>>;
}
type RawFetch = (args: FetchArgs) => Promise<unknown>;
export declare function createAsyncSource<TItem>(options: {
  fetch: RawFetch;
  pageSize?: number;
  mapItem: (item: unknown) => TItem;
  getTotal?: (rawData: NonNullable<unknown>) => number | undefined;
}): PromiseAsyncSource<TItem[]>;
export declare function createAsyncSource<TOutput>(options: {
  fetch: RawFetch;
  pageSize?: number;
  transform: (rawData: NonNullable<unknown>) => TOutput;
  getTotal?: (rawData: NonNullable<unknown>) => number | undefined;
}): PromiseAsyncSource<TOutput>;
/**
 * Adapts a `PromiseAsyncSource<T[]>` (e.g. built with `createAsyncSource`
 * + `mapItem`) to the canonical list-shaped `QuerySource<T>`.
 * `pageSize`/`signal` from `FetchArgs` are forwarded to `fetch` when the
 * underlying source accepts them; `createAsyncSource` fixes `pageSize` at
 * creation time, so per-call `pageSize` is informational there.
 */
export declare function asQuerySource<T>(source: PromiseAsyncSource<T[]>): QuerySource<T>;
//#endregion
//#region src/data/clean.d.ts
type EmptyStrategy = "omit" | "null";
export declare function cleanVars(val: string, opts?: {
  empty?: EmptyStrategy;
}): string | undefined | null;
export declare function cleanVars<T>(val: T, opts?: {
  empty?: EmptyStrategy;
}): T | undefined;
//#endregion
//#region src/data/extract-items.d.ts
export declare function extractItemsFromData(data: unknown): unknown[] | null;
//#endregion
//#region src/data/persistence.d.ts
export declare function createPersistenceKey(persistKey: string, prefix?: string): string;
export declare function readPersistedValue(storage: StorageAdapter, persistKey: string, prefix?: string): string | number | string[] | undefined;
export declare function writePersistedValue(storage: StorageAdapter, persistKey: string, value: FieldValue | unknown, prefix?: string): void;
//#endregion
//#region src/data/submit.d.ts
interface MutationErrorLike {
  message?: unknown;
  graphQLErrors?: Array<{
    message?: unknown;
  } | unknown>;
  networkError?: {
    message?: unknown;
  } | unknown;
}
export declare function formatMutationError(error: MutationErrorLike | Error | unknown): string;
interface SubmitFlowArgs {
  mutation: MutationPort["mutate"];
  vars: Record<string, unknown>;
  notify: NotifyAdapter;
  onSuccess?: () => void;
  resetForm?: () => void;
  invalidate?: () => void;
  successMessage?: string;
  errorMessage?: string;
}
export declare function handleSubmitFlow(args: SubmitFlowArgs): Promise<boolean>;
//#endregion
//#region src/examples/custom-controls.d.ts
/**
 * Copy-paste recipes for specialized controls.
 * NOT built-ins: define + register them in userland.
 *
 * ```ts
 * import { createMicroform } from "microform";
 * import { richTextControl } from "microform/examples/custom-controls";
 *
 * const microform = createMicroform({
 *   controls: [richTextControl({ renderer: (ctx) => renderLexical(ctx) })],
 * });
 * ```
 */
interface RichTextConfig {
  type: "rich_text";
}
export declare function richTextControl(renderer: (ctx: {
  props: RichTextConfig;
  value?: string;
  onChange?: (val: string | undefined) => void;
  disabled?: boolean;
  name?: string;
}) => unknown): ControlDefinition<"rich_text", RichTextConfig, RichTextConfig, string, unknown>;
type PersonSelectConfig = {
  type: "person_select";
  options: PersonOption[];
} | {
  type: "async_person_select";
  asyncSource: QuerySource<PersonOption>;
};
type PersonSelectValue = string;
type ModalPickerConfig = {
  type: "modal_picker";
  options: PersonOption[];
  modalConfig?: ModalPickerSettings;
} | {
  type: "async_modal_picker";
  asyncSource: QuerySource<Record<string, unknown>>;
  modalConfig: ModalPickerSettings;
};
interface DrawerSelectSettings {
  title?: string;
  description?: string;
}
type DrawerSelectTriggerVariant = "default" | "pill";
interface DrawerSelectConfig {
  type: "drawer_select";
  options: DrawerSelectOption[];
  drawerConfig?: DrawerSelectSettings;
  triggerVariant?: DrawerSelectTriggerVariant;
}
interface UploadFileSettings {
  uploadType?: string;
  maxSize?: number;
}
interface UploadFileConfig {
  type: "upload_file";
  config?: UploadFileSettings;
}
type UploadFileValue = FileLike[];
type AvatarUploadFn = (file: FileLike) => Promise<{
  id: string;
}>;
interface AvatarUploadSettings {
  currentImageUrl?: string | null;
  userName?: string;
  uploadFn?: AvatarUploadFn;
}
interface AvatarUploadConfig {
  type: "avatar_upload";
  config?: AvatarUploadSettings;
}
type AvatarUploadValue = string;
//#endregion
//#region src/schema/edit-defaults.d.ts
declare function extractIdsFromArray(items: unknown[], singularKey: string): string[];
interface EditDefaultsOptions {
  relations?: Record<string, string>;
  omitKeys?: string[];
  idKey?: string;
}
export declare function buildEditDefaults<TTarget extends Record<string, unknown>>(schema: z.ZodObject<z.ZodRawShape>, entity: Record<string, unknown> | null | undefined, overrides?: Partial<TTarget>, options?: EditDefaultsOptions): TTarget;
//#endregion
export { type AnyRenderer, type AsyncCheckboxGroupData, type AsyncConfig, type AsyncSource, type AsyncSourceResult, type AvatarUploadConfig, type AvatarUploadFn, type AvatarUploadSettings, type AvatarUploadValue, type BaseField, type BaseOption, type BuiltInType, type CalendarConfig, type CheckboxGroupConfig, type CheckboxGroupOption, type ComboboxConfig, type ControlConfig, type ControlDefinition, type ControlFieldConfig, type DrawerSelectConfig, type DrawerSelectOption, type DrawerSelectSettings, type DrawerSelectTriggerVariant, type EditDefaultsOptions, type EmailConfig, type EmptyStrategy, type EnumOption, type FetchArgs, type FieldControlDefinition, type FieldRendererFn, type FieldRendererProps, type FieldRow, type FieldSection, type FieldStructure, type FieldType, type FieldValue, type FileLike, type Microform, type ModalPickerConfig, type ModalPickerSettings, type MutationErrorLike, type MutationPort, type NotifyAdapter, type NumberConfig, type PasswordConfig, type PersonOption, type PersonSelectConfig, type PersonSelectValue, type PromiseAsyncSource, type QueryResult, type QuerySource, type RichTextConfig, type SearchConfig, type SelectConfig, type SelectOption, type StorageAdapter, type StructureNode, type SubmitFlowArgs, type TextConfig, type TextareaConfig, type UploadFileConfig, type UploadFileSettings, type UploadFileValue, type ZodObjectSchema, buildRequiredMap, createFormDefaults, createMicroform, extractIdsFromArray, forwardArrayValue, forwardScalarValue, isFieldRow, isFieldSection, resolveRenderer, unwrapZodType };
//# sourceMappingURL=index.d.ts.map