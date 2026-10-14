import * as React from "react";
import { defineControl } from "microform";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export const textControl = defineControl({
  type: "text" as const,
  renderer: (ctx) => (
    <Input
      name={ctx.name}
      value={ctx.inputValue ?? ""}
      onChange={(e) => ctx.onChange?.(e.target.value)}
      onBlur={ctx.onBlur}
      disabled={ctx.disabled}
      placeholder={ctx.props.placeholder as string | undefined}
    />
  ),
});

export const emailControl = defineControl({
  type: "email" as const,
  renderer: (ctx) => (
    <Input
      type="email"
      name={ctx.name}
      value={ctx.inputValue ?? ""}
      onChange={(e) => ctx.onChange?.(e.target.value)}
      onBlur={ctx.onBlur}
      disabled={ctx.disabled}
      placeholder={ctx.props.placeholder as string | undefined}
    />
  ),
});

export const numberControl = defineControl({
  type: "number" as const,
  renderer: (ctx) => (
    <Input
      type="number"
      name={ctx.name}
      value={ctx.value !== undefined ? String(ctx.value) : ""}
      onChange={(e) => {
        const val = e.target.value;
        ctx.onChange?.(val === "" ? undefined : Number(val));
      }}
      onBlur={ctx.onBlur}
      disabled={ctx.disabled}
      placeholder={ctx.props.placeholder as string | undefined}
    />
  ),
});

export const textareaControl = defineControl({
  type: "textarea" as const,
  renderer: (ctx) => (
    <Textarea
      name={ctx.name}
      value={ctx.inputValue ?? ""}
      onChange={(e) => ctx.onChange?.(e.target.value)}
      onBlur={ctx.onBlur}
      disabled={ctx.disabled}
      placeholder={ctx.props.placeholder as string | undefined}
    />
  ),
});

export const selectControl = defineControl({
  type: "select" as const,
  renderer: (ctx) => {
    const options =
      (ctx.props.options as Array<{ key?: string; value: string; label: string }>) ?? [];
    const val = typeof ctx.value === "string" ? ctx.value : "";
    return (
      <Select
        value={val}
        onValueChange={(nextVal) => ctx.onChange?.(nextVal)}
        disabled={ctx.disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seleccione una opción..." />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.key ?? opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  },
});

export const checkboxControl = defineControl({
  type: "checkbox" as const,
  renderer: (ctx) => (
    <label className="flex items-center gap-2 cursor-pointer select-none py-1">
      <input
        type="checkbox"
        name={ctx.name}
        checked={Boolean(ctx.value)}
        onChange={(e) => ctx.onChange?.(e.target.checked)}
        onBlur={ctx.onBlur}
        disabled={ctx.disabled}
        className="h-4 w-4 rounded border-input accent-primary text-primary focus:ring-ring"
      />
      <span className="text-sm font-medium text-foreground">
        {String(ctx.props.placeholder ?? ctx.props.label ?? "Activar opción")}
      </span>
    </label>
  ),
});

export const basicControls = [
  textControl,
  emailControl,
  numberControl,
  textareaControl,
  selectControl,
  checkboxControl,
];
