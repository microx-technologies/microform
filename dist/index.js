import { a as readPersistedValue, c as flattenStructure, d as createMicroform, f as resolveRenderer, h as isFieldSection, i as createPersistenceKey, l as validateColumns, m as isFieldRow, n as createFormDefaults, o as writePersistedValue, p as inferInputValue, r as unwrapZodType, s as MAX_COLUMNS, t as buildRequiredMap, u as validateStructure } from "./zod-defaults-xkRPyCZ4.js";

//#region src/adapters/memory-storage.ts
function createMemoryStorage(seed = {}) {
	const map = new Map(Object.entries(seed));
	return {
		get: (key) => map.get(key) ?? null,
		set: (key, value) => {
			map.set(key, value);
		},
		remove: (key) => {
			map.delete(key);
		},
		dump: () => Object.fromEntries(map)
	};
}

//#endregion
//#region src/catalog/configs.ts
const BUILT_IN_TYPES = [
	"text",
	"email",
	"password",
	"textarea",
	"number",
	"search",
	"calendar",
	"select",
	"combobox",
	"checkbox_group",
	"async_select",
	"async_combobox",
	"async_checkbox_group"
];

//#endregion
//#region src/catalog/enum-options.ts
function createEnumOptions(labels) {
	return Object.keys(labels).map((value) => ({
		key: value.toLowerCase(),
		value,
		label: labels[value] ?? value
	}));
}
function getOptionLabel(labels, value) {
	return labels[value] ?? value;
}

//#endregion
//#region src/core/control.ts
function forwardScalarValue(onChange) {
	if (!onChange) return void 0;
	return (val) => onChange(val);
}
function forwardArrayValue(onChange) {
	if (!onChange) return void 0;
	return (val) => onChange(val);
}

//#endregion
//#region src/core/define-control.ts
function defineControl(def) {
	return def;
}

//#endregion
//#region src/data/extract-items.ts
function hasItemsArray(value) {
	return typeof value === "object" && value !== null && "items" in value && Array.isArray(value.items);
}
function extractItemsFromData(data) {
	if (!data || typeof data !== "object") return null;
	if (Array.isArray(data)) return data;
	for (const value of Object.values(data)) {
		if (hasItemsArray(value)) return value.items;
		if (Array.isArray(value)) return value;
	}
	return null;
}

//#endregion
//#region src/data/async-source.ts
function createAsyncSource(options) {
	const pageSize = options.pageSize ?? 50;
	return { fetch: async (search = "", page = 1) => {
		const rawData = await options.fetch({
			search,
			page,
			pageSize
		});
		const result = rawData;
		let data;
		if (options.mapItem) {
			const items = rawData ? extractItemsFromData(rawData) : null;
			data = items ? items.map((item) => options.mapItem(item)) : [];
		} else if (options.transform) data = rawData ? options.transform(rawData) : [];
		else data = [];
		let totalItems;
		if (rawData !== null && rawData !== void 0) {
			if (options.getTotal) totalItems = options.getTotal(rawData);
			else if (typeof result === "object" && result !== null) {
				if (typeof result.total === "number") totalItems = result.total;
				else if (typeof result.totalItems === "number") totalItems = result.totalItems;
				else if (typeof result.totalCount === "number") totalItems = result.totalCount;
			}
		}
		return {
			data,
			totalItems
		};
	} };
}
/**
* Adapts a `PromiseAsyncSource<T[]>` (e.g. built with `createAsyncSource`
* + `mapItem`) to the canonical list-shaped `QuerySource<T>`.
* `pageSize`/`signal` from `FetchArgs` are forwarded to `fetch` when the
* underlying source accepts them; `createAsyncSource` fixes `pageSize` at
* creation time, so per-call `pageSize` is informational there.
*/
function asQuerySource(source) {
	return { fetch: async (args) => {
		const res = await source.fetch(args.search ?? "", args.page ?? 1);
		return {
			items: res.data,
			total: res.totalItems
		};
	} };
}

//#endregion
//#region src/data/clean.ts
function cleanVars(val, opts) {
	if ((opts?.empty ?? "omit") === "null") return cleanNull(val);
	return cleanOmit(val);
}
function cleanOmit(val) {
	if (val === null || val === void 0) return void 0;
	if (typeof val === "string") return val.trim() === "" ? void 0 : val;
	if (Array.isArray(val)) {
		const cleaned = val.map((item) => cleanOmit(item)).filter((item) => item !== void 0);
		return cleaned.length > 0 ? cleaned : void 0;
	}
	if (typeof val === "object") {
		const out = {};
		for (const [key, value] of Object.entries(val)) {
			const cleaned = cleanOmit(value);
			if (cleaned !== void 0) out[key] = cleaned;
		}
		return Object.keys(out).length > 0 ? out : void 0;
	}
	return val;
}
function cleanNull(val) {
	if (val === null || val === void 0) return val;
	if (typeof val === "string") return val.trim() === "" ? null : val;
	if (Array.isArray(val)) return val.map((item) => cleanNull(item));
	if (typeof val === "object") {
		const result = {};
		for (const [key, value] of Object.entries(val)) if (typeof value === "string" && value.trim() === "") result[key] = null;
		else if (typeof value === "object" && value !== null) result[key] = cleanNull(value);
		else result[key] = value;
		return result;
	}
	return val;
}

//#endregion
//#region src/data/submit.ts
const FALLBACK_MESSAGE = "Ocurrió un error inesperado";
function messageOf(value) {
	if (typeof value === "string") return value === "" ? void 0 : value;
	if (typeof value === "object" && value !== null && "message" in value) {
		const message = value.message;
		if (typeof message === "string" && message !== "") return message;
	}
}
function formatMutationError(error) {
	if (!error) return FALLBACK_MESSAGE;
	if (typeof error === "string") return error;
	if (typeof error === "object") {
		if ("graphQLErrors" in error) {
			const list = error.graphQLErrors;
			if (Array.isArray(list) && list.length > 0) {
				const parts = [];
				for (const entry of list) {
					const part = messageOf(entry);
					if (part !== void 0) parts.push(part);
				}
				if (parts.length > 0) return parts.join("\n");
			}
		}
		if ("networkError" in error) {
			const viaNetwork = messageOf(error.networkError);
			if (viaNetwork !== void 0) return viaNetwork;
		}
		const direct = messageOf(error);
		if (direct !== void 0) return direct;
	}
	const text = String(error);
	if (text !== "" && text !== "[object Object]") return text;
	return FALLBACK_MESSAGE;
}
async function handleSubmitFlow(args) {
	const { mutation, vars, notify, onSuccess, resetForm, invalidate, successMessage, errorMessage } = args;
	try {
		const res = await mutation(cleanVars(vars, { empty: "null" }) ?? {});
		const resError = typeof res === "object" && res !== null && "error" in res ? res.error : void 0;
		if (resError) {
			const detail = formatMutationError(resError);
			if (errorMessage === void 0) notify.error(detail);
			else notify.error(errorMessage, detail);
			return false;
		}
		if (successMessage !== void 0) notify.success(successMessage);
		resetForm?.();
		invalidate?.();
		onSuccess?.();
		return true;
	} catch (err) {
		const detail = formatMutationError(err);
		if (errorMessage === void 0) notify.error(detail);
		else notify.error(errorMessage, detail);
		return false;
	}
}

//#endregion
//#region src/examples/custom-controls.ts
function richTextControl(renderer) {
	return defineControl({
		type: "rich_text",
		renderer
	});
}

//#endregion
//#region src/schema/edit-defaults.ts
function isEntityRef(value) {
	return typeof value === "object" && value !== null && "id" in value && typeof value.id === "string";
}
function isRecord(value) {
	return typeof value === "object" && value !== null && !Array.isArray(value);
}
function extractIdsFromArray(items, singularKey) {
	const ids = [];
	for (const item of items) if (typeof item === "string") ids.push(item);
	else if (typeof item === "number") ids.push(String(item));
	else if (isRecord(item)) {
		const nested = [item[singularKey], ...Object.values(item)].find((candidate) => candidate !== item && isEntityRef(candidate));
		if (nested) ids.push(nested.id);
		else if (isEntityRef(item)) ids.push(item.id);
	} else if (isEntityRef(item)) ids.push(item.id);
	return ids;
}
function buildEditDefaults(schema, entity, overrides, options) {
	const relations = options?.relations ?? {};
	const omitKeys = options?.omitKeys ?? ["__typename"];
	const idKey = options?.idKey ?? "id";
	const omit = new Set(omitKeys);
	const schemaDefaults = {};
	for (const [key, fieldSchema] of Object.entries(schema.shape)) {
		const { defaultValue } = unwrapZodType(fieldSchema);
		if (defaultValue !== void 0) schemaDefaults[key] = defaultValue;
	}
	if (!entity) return {
		...schemaDefaults,
		...overrides
	};
	const result = { ...schemaDefaults };
	for (const [key, value] of Object.entries(entity)) {
		if (key.startsWith("__") || omit.has(key) || typeof value === "function") continue;
		if (value === null) result[key] = void 0;
		else if (Array.isArray(value)) {
			if (key in schema.shape && result[key] === void 0) result[key] = value;
			const mapped = relations[key];
			if (mapped && mapped in schema.shape) {
				const ids = extractIdsFromArray(value, key);
				if (ids.length > 0) {
					result[mapped] = ids;
					continue;
				}
			}
			let singularKey = key;
			if (key.endsWith("ies")) singularKey = `${key.slice(0, -3)}y`;
			else if (key.endsWith("s")) singularKey = key.slice(0, -1);
			for (const relationIdsKey of [`${singularKey}Ids`, `${key}Ids`]) if (relationIdsKey in schema.shape && (result[relationIdsKey] === void 0 || Array.isArray(result[relationIdsKey]))) {
				const ids = extractIdsFromArray(value, singularKey);
				if (ids.length > 0) {
					result[relationIdsKey] = ids;
					break;
				}
			}
		} else if (typeof value !== "object") result[key] = value;
		else if (isRecord(value) && idKey in value && typeof value[idKey] === "string") {
			const relationIdKey = `${key}Id`;
			if (relationIdKey in schema.shape && result[relationIdKey] === void 0) result[relationIdKey] = value[idKey];
		}
	}
	if (overrides) Object.assign(result, overrides);
	return result;
}

//#endregion
export { BUILT_IN_TYPES, MAX_COLUMNS, asQuerySource, buildEditDefaults, buildRequiredMap, cleanVars, createAsyncSource, createEnumOptions, createFormDefaults, createMemoryStorage, createMicroform, createPersistenceKey, defineControl, extractIdsFromArray, extractItemsFromData, flattenStructure, formatMutationError, forwardArrayValue, forwardScalarValue, getOptionLabel, handleSubmitFlow, inferInputValue, isFieldRow, isFieldSection, readPersistedValue, resolveRenderer, richTextControl, unwrapZodType, validateColumns, validateStructure, writePersistedValue };
//# sourceMappingURL=index.js.map