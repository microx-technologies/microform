import { a as readPersistedValue, f as resolveRenderer, h as isFieldSection, m as isFieldRow, o as writePersistedValue, p as inferInputValue, s as MAX_COLUMNS, t as buildRequiredMap } from "./zod-defaults-xkRPyCZ4.js";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Controller, useWatch } from "react-hook-form";

//#region src/react/field-grid.tsx
function renderNodes(nodes, renderField, renderSection, alignItemsEnd, children, keyPrefix) {
	return nodes.map((item, index) => {
		if (isFieldSection(item)) {
			const key = item.key ?? `${keyPrefix}section-${index}`;
			const inner = renderNodes(item.children, renderField, renderSection, alignItemsEnd, null, `${key}-`);
			const body = /* @__PURE__ */ jsxs(Fragment, { children: [
				item.title ? /* @__PURE__ */ jsx("div", {
					"data-section-title": "",
					children: item.title
				}) : null,
				item.description ? /* @__PURE__ */ jsx("div", {
					"data-section-description": "",
					children: item.description
				}) : null,
				inner
			] });
			if (renderSection) return renderSection({
				key,
				title: item.title,
				description: item.description
			}, body);
			return /* @__PURE__ */ jsx("div", {
				"data-section": key,
				children: body
			}, key);
		}
		if (!isFieldRow(item)) return /* @__PURE__ */ jsx("div", {
			"data-field": item.name,
			children: renderField(item)
		}, item.name);
		const rowId = item.fields.map((field) => field.name).join("+");
		const isLastNode = index === nodes.length - 1;
		return /* @__PURE__ */ jsxs("div", {
			"data-row": "",
			"data-columns": item.columns ?? 12,
			"data-align": alignItemsEnd ? "end" : "start",
			children: [item.fields.map((field) => /* @__PURE__ */ jsx("div", {
				"data-field": field.name,
				"data-colspan": field.colspan ?? 1,
				children: renderField(field)
			}, field.name)), isLastNode ? children : null]
		}, `row-${rowId}`);
	});
}
function FieldGrid({ structure, renderField, renderSection, alignItemsEnd = false, children }) {
	return /* @__PURE__ */ jsx(Fragment, { children: renderNodes(structure, renderField, renderSection, alignItemsEnd, children, "") });
}

//#endregion
//#region src/react/form-fields.tsx
function FormFields({ structure, control, renderItem, schema, disabled }) {
	const requiredMap = useMemo(() => schema ? buildRequiredMap(schema) : void 0, [schema]);
	return /* @__PURE__ */ jsx(FieldGrid, {
		structure,
		renderField: (item) => /* @__PURE__ */ jsx(Controller, {
			control,
			name: item.name,
			disabled,
			render: ({ field, fieldState }) => /* @__PURE__ */ jsx(Fragment, { children: renderItem(item, {
				rhf: field,
				fieldState,
				required: requiredMap?.get(item.name) ?? false,
				invalid: fieldState.invalid
			}) })
		})
	});
}

//#endregion
//#region src/react/provider.tsx
const MicroformContext = createContext(null);
function MicroformProvider({ value, children }) {
	return /* @__PURE__ */ jsx(MicroformContext.Provider, {
		value,
		children
	});
}
function useMicroformOptional() {
	return useContext(MicroformContext);
}
function useMicroform() {
	const microform = useContext(MicroformContext);
	if (!microform) throw new Error("useMicroform() requiere <MicroformProvider value={microform}>.");
	return microform;
}

//#endregion
//#region src/react/infer-field.tsx
function InferFieldInput({ type, value, inputValue, onChange, onBlur, disabled, name, microform, fieldProps, onUnknownType }) {
	const contextual = useMicroformOptional();
	const registry = microform ?? contextual;
	if (!registry) throw new Error("InferFieldInput requiere <MicroformProvider> o prop `microform`.");
	const renderer = resolveRenderer(registry, type);
	if (!renderer) return onUnknownType?.(type) ?? null;
	return renderer({
		props: {
			type,
			...fieldProps
		},
		value,
		inputValue: inputValue ?? inferInputValue(value),
		onChange,
		onBlur,
		disabled,
		name
	});
}

//#endregion
//#region src/react/struct-form.tsx
function StructForm({ structure, form, renderItem, schema, onSubmit, submitMode = "button", submitLabel = "Guardar", disabled, children }) {
	return /* @__PURE__ */ jsxs("form", {
		onSubmit: form.handleSubmit(onSubmit),
		children: [
			/* @__PURE__ */ jsx(FormFields, {
				structure,
				control: form.control,
				renderItem,
				schema,
				disabled
			}),
			children,
			submitMode === "button" ? /* @__PURE__ */ jsx("button", {
				type: "submit",
				children: submitLabel
			}) : null
		]
	});
}

//#endregion
//#region src/react/use-async-query.ts
function useAsyncQuery({ source, search = "", page = 1, pageSize = 50, debounceMs = 250, enabled = true }) {
	const [data, setData] = useState([]);
	const [total, setTotal] = useState(void 0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(void 0);
	const [nonce, setNonce] = useState(0);
	const gen = useRef(0);
	useEffect(() => {
		if (!enabled) return;
		const myGen = ++gen.current;
		setIsLoading(true);
		const controller = new AbortController();
		const timer = setTimeout(() => {
			source.fetch({
				search,
				page,
				pageSize,
				signal: controller.signal
			}).then((res) => {
				if (gen.current !== myGen) return;
				setData(res.items);
				setTotal(res.total);
				setError(void 0);
			}).catch((err) => {
				if (gen.current !== myGen) return;
				if (err instanceof DOMException && err.name === "AbortError") return;
				setError(err);
			}).finally(() => {
				if (gen.current !== myGen) return;
				setIsLoading(false);
			});
		}, debounceMs);
		return () => {
			clearTimeout(timer);
			controller.abort();
		};
	}, [
		source,
		search,
		page,
		pageSize,
		debounceMs,
		enabled,
		nonce
	]);
	return {
		data,
		total,
		isLoading,
		error,
		refetch: () => setNonce((n) => n + 1)
	};
}

//#endregion
//#region src/react/use-infer-item.ts
/**
* Headless item logic (core con slots): wraps `onChange` with persistence
* write. The adapter owns label/description/error/required markup and calls
* `persistOnChange` instead of raw `onChange`.
*
* Storage is injected per use (Option A): no globals, no registry wiring.
* Without `storage` + `persistKey` it returns `onChange` untouched.
*/
function useInferItem({ persistKey, storage, prefix, onChange }) {
	const persistOnChange = useCallback((val) => {
		onChange?.(val);
		if (storage && persistKey) writePersistedValue(storage, persistKey, val, prefix);
	}, [
		onChange,
		persistKey,
		prefix,
		storage
	]);
	if (!onChange) return { persistOnChange: void 0 };
	if (!storage || !persistKey) return { persistOnChange: onChange };
	return { persistOnChange };
}

//#endregion
//#region src/react/use-persistence.ts
function usePersistence({ control, name, persistKey, storage, prefix, onRestore }) {
	const value = useWatch({
		control,
		name
	});
	const restoreRef = useRef(onRestore);
	restoreRef.current = onRestore;
	useEffect(() => {
		if (!persistKey) return;
		const restored = readPersistedValue(storage, persistKey, prefix);
		if (restored !== void 0) restoreRef.current?.(restored);
	}, [
		persistKey,
		prefix,
		storage
	]);
	useEffect(() => {
		if (!persistKey) return;
		writePersistedValue(storage, persistKey, value, prefix);
	}, [
		persistKey,
		prefix,
		storage,
		value
	]);
}

//#endregion
export { FieldGrid, FormFields, InferFieldInput, MicroformProvider, StructForm, useAsyncQuery, useInferItem, useMicroform, useMicroformOptional, usePersistence };
//# sourceMappingURL=react.js.map