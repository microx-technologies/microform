import { z } from "zod";
//#region src/data/ports.d.ts
interface StorageAdapter {
  get: (key: string) => string | null;
  set: (key: string, value: string) => void;
  remove?: (key: string) => void;
}
interface NotifyAdapter {
  success: (message: string) => void;
  error: (message: string, description?: string) => void;
}
interface MutationPort {
  mutate: (variables: Record<string, unknown>) => Promise<unknown>;
}
interface FetchArgs {
  search?: string;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}
interface QueryResult<TItem> {
  items: TItem[];
  total?: number;
}
interface QuerySource<TItem = unknown> {
  fetch: (args: FetchArgs) => Promise<QueryResult<TItem>>;
}
//#endregion
//#region src/core/control.d.ts
interface FileLike {
  readonly name: string;
  readonly size?: number;
  readonly type?: string;
}
type FieldValue = string | number | string[] | FileLike[] | undefined;
interface FieldRendererProps<Props = Record<string, unknown>, Value = any, Element = unknown> {
  props: Props;
  value?: Value;
  inputValue?: string;
  onChange?: (val: Value | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
  name?: string;
  ref?: Element;
}
type FieldRendererFn<Props = Record<string, unknown>, Value = any, Element = unknown> = (context: FieldRendererProps<Props, Value, Element>) => unknown;
interface FieldControlDefinition<Type extends string = string, Props = Record<string, unknown>, Value = any, Element = unknown> {
  type: Type;
  renderer: FieldRendererFn<Props, Value, Element>;
}
declare function forwardScalarValue<Value>(onChange: ((val: Value | undefined) => void) | undefined): ((val: string | number | undefined) => void) | undefined;
declare function forwardArrayValue<Item>(onChange: ((val: Item[] | undefined) => void) | undefined): ((val: Item[] | undefined) => void) | undefined;
/**
 * @deprecated React-layer legacy. Prefer `QuerySource` (promise-based,
 * framework-agnostic) + `useAsyncQuery` in `microform/react`.
 * Kept for migration from hook-based sources (e.g. urql `useQuery` wrappers).
 * New code should expose `{ fetch: (args) => Promise<{items,total?}> }`.
 */
type AsyncConfig<T = unknown> = {
  useQuery: (search?: string, page?: number) => {
    data: T;
    totalItems?: number;
    isLoading: boolean;
  };
};
//#endregion
//#region src/core/field.d.ts
interface BaseField<T extends string> {
  name: T;
  label: string;
  icon?: unknown;
  description?: string;
  placeholder?: string;
  allOptionLabel?: string;
  readonly?: boolean;
  disabled?: boolean;
  persistKey?: string;
  [key: string]: unknown;
}
interface ControlFieldConfig {
  type: string;
  [key: string]: unknown;
}
type FieldType<T extends string> = BaseField<T> & ControlFieldConfig;
interface FieldRow<T extends string> {
  columns?: number;
  fields: (FieldType<T> & {
    colspan?: number;
  })[];
}
interface FieldSection<T extends string> {
  kind: "section";
  key?: string;
  title?: string;
  description?: string;
  children: StructureNode<T>[];
}
type StructureNode<T extends string> = FieldType<T> | FieldRow<T> | FieldSection<T>;
type FieldStructure<T extends string> = StructureNode<T>[];
declare function isFieldRow<T extends string>(item: StructureNode<T>): item is FieldRow<T>;
declare function isFieldSection<T extends string>(item: StructureNode<T>): item is FieldSection<T>;
//#endregion
//#region src/core/registry.d.ts
type AnyRenderer = FieldRendererFn<any, any, any>;
interface Microform<TType extends string = string> {
  register: <T extends TType>(type: T, renderer: AnyRenderer) => void;
  registerAll: (renderers: Partial<Record<TType, AnyRenderer>>) => void;
  resolve: (type: string) => AnyRenderer | undefined;
  has: (type: string) => boolean;
  types: () => TType[];
}
declare function createMicroform<BuiltIn extends string, Custom extends string = never>(options: {
  controls: ReadonlyArray<{
    type: BuiltIn;
    renderer: AnyRenderer;
  }>;
}): Microform<BuiltIn | Custom>;
declare function resolveRenderer<TType extends string>(microform: Pick<Microform<TType>, "resolve">, type: TType): AnyRenderer | undefined;
//#endregion
//#region src/schema/zod-defaults.d.ts
type ZodObjectSchema = z.ZodObject<z.ZodRawShape>;
interface UnwrappedZodType {
  unwrapped: unknown;
  defaultValue?: unknown;
  isOptional: boolean;
}
declare function unwrapZodType(type: unknown): UnwrappedZodType;
declare function createFormDefaults<T extends ZodObjectSchema>(schema: T, overrides?: Partial<z.infer<T>>): z.infer<T>;
declare function buildRequiredMap(schema: ZodObjectSchema): Map<string, boolean>;
//#endregion
export { QuerySource as A, FileLike as C, MutationPort as D, FetchArgs as E, NotifyAdapter as O, FieldValue as S, forwardScalarValue as T, isFieldSection as _, AnyRenderer as a, FieldRendererFn as b, resolveRenderer as c, FieldRow as d, FieldSection as f, isFieldRow as g, StructureNode as h, unwrapZodType as i, StorageAdapter as j, QueryResult as k, BaseField as l, FieldType as m, buildRequiredMap as n, Microform as o, FieldStructure as p, createFormDefaults as r, createMicroform as s, ZodObjectSchema as t, ControlFieldConfig as u, AsyncConfig as v, forwardArrayValue as w, FieldRendererProps as x, FieldControlDefinition as y };
//# sourceMappingURL=zod-defaults-BgWJiK9W.d.ts.map