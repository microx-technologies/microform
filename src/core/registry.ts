import type { FieldRendererFn } from "./control";

// biome-ignore lint/suspicious/noExplicitAny: registry stores renderers with any Value per control
export type AnyRenderer = FieldRendererFn<any, any, any>;

export interface Microform<TType extends string = string> {
  register: <T extends TType>(type: T, renderer: AnyRenderer) => void;
  registerAll: (renderers: Partial<Record<TType, AnyRenderer>>) => void;
  resolve: (type: string) => AnyRenderer | undefined;
  has: (type: string) => boolean;
  types: () => TType[];
}

export function createMicroform<BuiltIn extends string, Custom extends string = never>(options: {
  controls: ReadonlyArray<{ type: BuiltIn; renderer: AnyRenderer }>;
}): Microform<BuiltIn | Custom> {
  const map = new Map<string, AnyRenderer>();

  for (const control of options.controls) {
    map.set(control.type, control.renderer);
  }

  return {
    register(type, renderer) {
      map.set(type, renderer);
    },
    registerAll(renderers) {
      for (const [type, renderer] of Object.entries(renderers) as [BuiltIn | Custom, FieldRendererFn | undefined][]) {
        if (renderer) map.set(type, renderer);
      }
    },
    resolve(type) {
      return map.get(type);
    },
    has(type) {
      return map.has(type);
    },
    types() {
      return [...map.keys()] as (BuiltIn | Custom)[];
    },
  };
}

export function resolveRenderer<TType extends string>(
  microform: Pick<Microform<TType>, "resolve">,
  type: TType,
): AnyRenderer | undefined {
  return microform.resolve(type);
}
