import * as React from "react";
import { useState } from "react";
import { defineControl } from "microform";
import { Star, X } from "lucide-react";
import { Input } from "../components/ui/input";
import { Switch } from "../components/ui/switch";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";

// 1. Standard text control
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

// 2. Custom Rating Control (1 to 5 Stars)
export interface RatingControlConfig {
  type: "rating";
  maxStars?: number;
}

export const ratingControl = defineControl<"rating", RatingControlConfig, { maxStars?: number }, number>({
  type: "rating",
  renderer: (ctx) => {
    const max = Number(ctx.props.maxStars ?? 5);
    const current = Number(ctx.value ?? 0);
    const [hover, setHover] = useState<number | null>(null);

    const activeRating = hover !== null ? hover : current;

    return (
      <div className="flex items-center gap-2 py-1">
        <div className="flex items-center gap-1">
          {Array.from({ length: max }, (_, i) => i + 1).map((star) => (
            <button
              key={star}
              type="button"
              disabled={ctx.disabled}
              onClick={() => ctx.onChange?.(star === current ? 0 : star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              className="p-1 text-slate-300 hover:text-amber-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded cursor-pointer disabled:cursor-not-allowed"
            >
              <Star
                className={`size-6 transition-all ${
                  star <= activeRating
                    ? "fill-amber-400 text-amber-500 scale-110"
                    : "text-slate-300"
                }`}
              />
            </button>
          ))}
        </div>
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-muted text-muted-foreground">
          {current > 0 ? `${current} / ${max}` : "Sin calificar"}
        </span>
      </div>
    );
  },
});

// 3. Custom Tag Input Control (Chip / Badges list)
export interface TagInputConfig {
  type: "tag_input";
  placeholder?: string;
}

export const tagInputControl = defineControl<"tag_input", TagInputConfig, { placeholder?: string }, string[]>({
  type: "tag_input",
  renderer: (ctx) => {
    const tags = Array.isArray(ctx.value) ? (ctx.value as string[]) : [];
    const [inputValue, setInputValue] = useState("");

    const handleAdd = () => {
      const trimmed = inputValue.trim();
      if (trimmed && !tags.includes(trimmed)) {
        ctx.onChange?.([...tags, trimmed]);
        setInputValue("");
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        handleAdd();
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        ctx.onChange?.(tags.slice(0, -1));
      }
    };

    const removeTag = (indexToRemove: number) => {
      ctx.onChange?.(tags.filter((_, idx) => idx !== indexToRemove));
    };

    return (
      <div className="space-y-2">
        <div className="flex flex-wrap gap-1.5 p-2 min-h-12 border border-input rounded-md bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-ring">
          {tags.map((tag, idx) => (
            <Badge key={tag} variant="secondary" className="gap-1 pr-1 text-xs">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(idx)}
                disabled={ctx.disabled}
                className="hover:bg-muted-foreground/20 rounded-full p-0.5 transition-colors cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          <input
            type="text"
            disabled={ctx.disabled}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAdd}
            placeholder={tags.length === 0 ? (ctx.props.placeholder ?? "Escribe y pulsa Enter...") : ""}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-[120px]"
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Pulsa <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Enter</kbd> o coma para agregar.
        </p>
      </div>
    );
  },
});

// 4. Custom Switch Toggle Control
export interface SwitchToggleConfig {
  type: "switch_toggle";
  title?: string;
  subtitle?: string;
}

export const switchToggleControl = defineControl<
  "switch_toggle",
  SwitchToggleConfig,
  { title?: string; subtitle?: string },
  boolean
>({
  type: "switch_toggle",
  renderer: (ctx) => {
    const checked = Boolean(ctx.value);
    return (
      <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-card">
        <div className="space-y-0.5 pr-4">
          <div className="text-sm font-medium text-foreground">
            {ctx.props.title ?? "Habilitar funcionalidad"}
          </div>
          {ctx.props.subtitle && (
            <div className="text-xs text-muted-foreground">{ctx.props.subtitle}</div>
          )}
        </div>
        <Switch
          checked={checked}
          onCheckedChange={(val) => ctx.onChange?.(val)}
          disabled={ctx.disabled}
        />
      </div>
    );
  },
});

// 5. Custom Color Picker Control
export interface ColorPickerConfig {
  type: "color_picker";
  presets?: string[];
}

const DEFAULT_PRESETS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#8b5cf6", // violet
  "#f43f5e", // rose
  "#f59e0b", // amber
  "#0f172a", // slate
];

export const colorPickerControl = defineControl<
  "color_picker",
  ColorPickerConfig,
  { presets?: string[] },
  string
>({
  type: "color_picker",
  renderer: (ctx) => {
    const selected = (typeof ctx.value === "string" ? ctx.value : DEFAULT_PRESETS[0]);
    const presets = (ctx.props.presets as string[]) ?? DEFAULT_PRESETS;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div
            className="size-8 rounded-full border border-border shadow-sm transition-transform scale-105"
            style={{ backgroundColor: selected }}
          />
          <div className="flex items-center gap-1.5">
            {presets.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => ctx.onChange?.(color)}
                disabled={ctx.disabled}
                className={`size-6 rounded-full transition-all cursor-pointer border ${
                  selected === color
                    ? "ring-2 ring-ring ring-offset-2 scale-110 border-transparent"
                    : "border-border opacity-80 hover:opacity-100 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <Input
            type="color"
            value={selected}
            disabled={ctx.disabled}
            onChange={(e) => ctx.onChange?.(e.target.value)}
            className="w-10 h-8 p-0.5 border-border rounded cursor-pointer"
          />
        </div>
      </div>
    );
  },
});

export const customControlsList = [
  textControl,
  ratingControl,
  tagInputControl,
  switchToggleControl,
  colorPickerControl,
];
