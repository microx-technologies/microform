import { z } from "zod";

//#region src/core/field.ts
function isFieldRow(item) {
	return "fields" in item;
}
function isFieldSection(item) {
	return typeof item === "object" && item !== null && "kind" in item && item.kind === "section";
}

//#endregion
//#region src/core/infer.ts
function inferInputValue(value) {
	if (value === null || value === void 0) return void 0;
	if (Array.isArray(value)) return void 0;
	return String(value);
}

//#endregion
//#region src/core/registry.ts
function createMicroform(options) {
	const map = /* @__PURE__ */ new Map();
	for (const control of options.controls) map.set(control.type, control.renderer);
	return {
		register(type, renderer) {
			map.set(type, renderer);
		},
		registerAll(renderers) {
			for (const [type, renderer] of Object.entries(renderers)) if (renderer) map.set(type, renderer);
		},
		resolve(type) {
			return map.get(type);
		},
		has(type) {
			return map.has(type);
		},
		types() {
			return [...map.keys()];
		}
	};
}
function resolveRenderer(microform, type) {
	return microform.resolve(type);
}

//#endregion
//#region src/core/structure.ts
const MAX_COLUMNS = 12;
function validateColumns(n) {
	return Number.isInteger(n) && n >= 1 && n <= 12;
}
function flattenStructure(structure) {
	const out = [];
	const visit = (nodes) => {
		for (const item of nodes) if (isFieldSection(item)) visit(item.children);
		else if (isFieldRow(item)) for (const field of item.fields) out.push(field);
		else out.push(item);
	};
	visit(structure);
	return out;
}
/**
* Headless structural validation. Returns human-readable errors
* (empty = valid). Checks columns range, colspan range + colspan<=columns,
* non-empty rows/sections. Duplicate names are NOT errors (same field may
* appear once; adapters may warn separately).
*/
function validateStructure(structure) {
	const errors = [];
	const visit = (nodes, path) => {
		nodes.forEach((item, index) => {
			const at = `${path}[${index}]`;
			if (isFieldSection(item)) {
				if (item.children.length === 0) errors.push(`${at}: empty section`);
				visit(item.children, `${at}.children`);
				return;
			}
			if (isFieldRow(item)) {
				const columns = item.columns ?? 12;
				if (!validateColumns(columns)) errors.push(`${at}: columns ${columns} out of range 1..${12}`);
				if (item.fields.length === 0) errors.push(`${at}: empty row`);
				for (const field of item.fields) {
					const span = field.colspan ?? 1;
					if (!validateColumns(span)) errors.push(`${at}.${field.name}: colspan ${span} out of range 1..${12}`);
					else if (validateColumns(columns) && span > columns) errors.push(`${at}.${field.name}: colspan ${span} exceeds columns ${columns}`);
				}
				return;
			}
		});
	};
	visit(structure, "structure");
	return errors;
}

//#endregion
//#region src/data/persistence.ts
const DEFAULT_PREFIX = "form-persist:";
function createPersistenceKey(persistKey, prefix = DEFAULT_PREFIX) {
	return `${prefix}${persistKey}`;
}
function isStringArray(value) {
	return Array.isArray(value) && value.every((item) => typeof item === "string");
}
function readPersistedValue(storage, persistKey, prefix = DEFAULT_PREFIX) {
	const raw = storage.get(createPersistenceKey(persistKey, prefix));
	if (raw === null) return void 0;
	let parsed;
	try {
		parsed = JSON.parse(raw);
	} catch {
		return;
	}
	if (typeof parsed === "string" || typeof parsed === "number") return parsed;
	if (isStringArray(parsed)) return parsed;
}
function writePersistedValue(storage, persistKey, value, prefix = DEFAULT_PREFIX) {
	if (value === void 0 || value === null) return;
	if (value === "") return;
	if (Array.isArray(value) && value.length > 0) {
		const first = value[0];
		if (typeof first === "object" && first !== null) return;
	}
	const serialized = JSON.stringify(value);
	if (serialized === void 0) return;
	storage.set(createPersistenceKey(persistKey, prefix), serialized);
}

//#endregion
//#region src/schema/zod-defaults.ts
function isZodWrapper(value) {
	if (typeof value !== "object" || value === null) return false;
	return "_def" in value || "unwrap" in value;
}
function unwrapZodType(type) {
	let current = type;
	let defaultValue;
	let isOptional = false;
	while (isZodWrapper(current)) if (current instanceof z.ZodDefault || current._def?.typeName === "ZodDefault" || current instanceof z.ZodPrefault || current._def?.typeName === "ZodPrefault") {
		isOptional = true;
		const def = current._def;
		defaultValue = typeof def?.defaultValue === "function" ? def.defaultValue() : def?.defaultValue;
		current = def?.innerType;
	} else if (current instanceof z.ZodOptional || current._def?.typeName === "ZodOptional") {
		isOptional = true;
		current = current._def?.innerType ?? (typeof current.unwrap === "function" ? current.unwrap() : void 0);
	} else if (current instanceof z.ZodNullable || current._def?.typeName === "ZodNullable") current = current._def?.innerType ?? (typeof current.unwrap === "function" ? current.unwrap() : void 0);
	else if (current._def?.typeName === "ZodEffects") {
		const inner = current._def && typeof current._def === "object" && "schema" in current._def ? current._def.schema : void 0;
		if (inner === void 0) break;
		current = inner;
	} else break;
	return {
		unwrapped: current,
		defaultValue,
		isOptional
	};
}
function createFormDefaults(schema, overrides) {
	const shape = schema.shape;
	const result = {};
	for (const [key, fieldSchema] of Object.entries(shape)) {
		const { unwrapped, defaultValue, isOptional } = unwrapZodType(fieldSchema);
		const typeName = isZodWrapper(unwrapped) ? unwrapped._def?.typeName : void 0;
		if (defaultValue !== void 0) result[key] = defaultValue;
		else if (isOptional) result[key] = void 0;
		else if (unwrapped instanceof z.ZodString || typeName === "ZodString") result[key] = "";
		else if (unwrapped instanceof z.ZodArray || typeName === "ZodArray") result[key] = [];
		else if (unwrapped instanceof z.ZodBoolean || typeName === "ZodBoolean") result[key] = false;
		else result[key] = void 0;
	}
	if (overrides) Object.assign(result, overrides);
	return result;
}
function buildRequiredMap(schema) {
	const result = /* @__PURE__ */ new Map();
	for (const [key, fieldSchema] of Object.entries(schema.shape)) result.set(key, !unwrapZodType(fieldSchema).isOptional);
	return result;
}

//#endregion
export { readPersistedValue as a, flattenStructure as c, createMicroform as d, resolveRenderer as f, isFieldSection as h, createPersistenceKey as i, validateColumns as l, isFieldRow as m, createFormDefaults as n, writePersistedValue as o, inferInputValue as p, unwrapZodType as r, MAX_COLUMNS as s, buildRequiredMap as t, validateStructure as u };
//# sourceMappingURL=zod-defaults-xkRPyCZ4.js.map