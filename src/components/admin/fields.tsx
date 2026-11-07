import { Plus, X, ImagePlus, GripVertical } from "lucide-react";

import type { ResourceField, SubField } from "./resources";
import { Button } from "./../../components/ui/button";
import { Input } from "./../../components/ui/input";
import { Textarea } from "./../../components/ui/textarea";
import { Switch } from "./../../components/ui/switch";
import { Label } from "./../../components/ui/label";

export type Row = Record<string, unknown> & { id?: number | string };

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export function fieldInitial(field: ResourceField): unknown {
  switch (field.type) {
    case "boolean":
      return false;
    case "list":
    case "repeater":
    case "gallery":
      return [];
    case "select":
      return field.options?.[0] ?? "";
    default:
      return "";
  }
}

export function buildInitialForm(fields: ResourceField[]): Row {
  const obj: Row = {};
  for (const f of fields) obj[f.name] = fieldInitial(f);
  return obj;
}

/** A field is visible when it has no `showFor`, or the discriminator matches. */
export function isFieldVisible(field: ResourceField, form: Row) {
  if (!field.showFor) return true;
  const current = String(form[field.showFor.field] ?? "");
  return field.showFor.values.includes(current);
}

function hasFiles(row: Row) {
  return Object.values(row).some(
    (v) => v instanceof File || (Array.isArray(v) && v.some((x) => x instanceof File)),
  );
}

export function buildPayload(row: Row, fields: ResourceField[]): Row | FormData {
  const clean: Row = {};
  for (const f of fields) {
    if (!isFieldVisible(f, row)) continue;
    const v = row[f.name];
    if (f.type === "number") {
      if (v === "" || v == null) continue;
      const n = typeof v === "number" ? v : Number(v);
      if (!Number.isNaN(n)) clean[f.name] = n;
      continue;
    }
    if (f.type === "image" && (v == null || v === "")) continue;
    clean[f.name] = v;
  }

  if (!hasFiles(clean)) return clean;

  const fd = new FormData();
  for (const [k, v] of Object.entries(clean)) {
    if (v instanceof File) {
      fd.append(k, v);
    } else if (Array.isArray(v)) {
      const files = v.filter((x): x is File => x instanceof File);
      const rest = v.filter((x) => !(x instanceof File));
      files.forEach((file) => fd.append(k, file));
      if (rest.length) fd.append(`${k}_json`, JSON.stringify(rest));
      if (!files.length && !rest.length) fd.append(`${k}_json`, "[]");
    } else if (v != null && typeof v === "object") {
      fd.append(k, JSON.stringify(v));
    } else if (typeof v === "boolean") {
      fd.append(k, v ? "true" : "false");
    } else if (v != null) {
      fd.append(k, String(v));
    }
  }
  return fd;
}

/* ------------------------- field editors ------------------------- */

export function ListEditor({
  value,
  onChange,
  placeholder = "Add a point…",
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const items = Array.isArray(value) ? value : [];
  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/40 p-2 sm:p-3">
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No points yet.</p>
      ) : null}
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5 sm:gap-2">
          <GripVertical className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />
          <Input
            value={item}
            placeholder={placeholder}
            onChange={(e) => {
              const next = [...items];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="h-9 min-w-0 bg-background"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={() => onChange([...items, ""])}
      >
        <Plus className="mr-1 h-3.5 w-3.5" /> Add point
      </Button>
    </div>
  );
}

export function RepeaterEditor({
  value,
  subFields,
  onChange,
}: {
  value: Record<string, unknown>[];
  subFields: SubField[];
  onChange: (v: Record<string, unknown>[]) => void;
}) {
  const items = Array.isArray(value) ? value : [];
  const blank = () => {
    const o: Record<string, unknown> = {};
    for (const sf of subFields) o[sf.name] = sf.type === "list" ? [] : "";
    return o;
  };
  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div
          key={i}
          className="relative space-y-3 rounded-xl border border-border bg-muted/40 p-3 pt-9"
        >
          <div className="absolute left-3 top-2.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
            #{i + 1}
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1.5 h-7 w-7"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            <X className="h-4 w-4 text-destructive" />
          </Button>
          {subFields.map((sf) => (
            <div key={sf.name}>
              <Label className="mb-1 block text-xs text-muted-foreground">{sf.label}</Label>
              {sf.type === "list" ? (
                <ListEditor
                  value={(item[sf.name] as string[]) ?? []}
                  onChange={(v) => {
                    const next = [...items];
                    next[i] = { ...item, [sf.name]: v };
                    onChange(next);
                  }}
                />
              ) : sf.type === "textarea" ? (
                <Textarea
                  rows={3}
                  className="bg-background"
                  value={String(item[sf.name] ?? "")}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...item, [sf.name]: e.target.value };
                    onChange(next);
                  }}
                />
              ) : (
                <Input
                  type={sf.type === "number" ? "number" : "text"}
                  className="h-9 bg-background"
                  placeholder={sf.placeholder}
                  value={String(item[sf.name] ?? "")}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = { ...item, [sf.name]: e.target.value };
                    onChange(next);
                  }}
                />
              )}
            </div>
          ))}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="rounded-full"
        onClick={() => onChange([...items, blank()])}
      >
        <Plus className="mr-1 h-3.5 w-3.5" /> Add entry
      </Button>
    </div>
  );
}

function fileLabel(v: unknown) {
  if (v instanceof File) return v.name;
  if (typeof v === "string" && v) return v.split("/").pop() ?? v;
  return "";
}

function previewUrl(v: unknown) {
  if (v instanceof File) return URL.createObjectURL(v);
  if (typeof v === "string" && v) return v;
  return "";
}

export function ImageEditor({
  value,
  accept,
  onChange,
}: {
  value: unknown;
  accept?: string;
  onChange: (v: unknown) => void;
}) {
  const url = previewUrl(value);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/40 p-3">
      <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg bg-background ring-1 ring-border">
        {url ? (
          <img src={url} alt="" className="h-full w-full object-cover" />
        ) : (
          <ImagePlus className="h-5 w-5 text-muted-foreground" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <input
          type="file"
          accept={accept ?? "image/*"}
          onChange={(e) => onChange(e.target.files?.[0] ?? "")}
          className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
        />
        {value ? (
          <p className="mt-1 truncate text-[11px] text-muted-foreground">{fileLabel(value)}</p>
        ) : null}
      </div>
      {value ? (
        <Button type="button" variant="ghost" size="icon" onClick={() => onChange("")}>
          <X className="h-4 w-4 text-destructive" />
        </Button>
      ) : null}
    </div>
  );
}

export function GalleryEditor({
  value,
  accept,
  onChange,
}: {
  value: unknown[];
  accept?: string;
  onChange: (v: unknown[]) => void;
}) {
  const items = Array.isArray(value) ? value : [];
  const isVideo = (accept ?? "").includes("video");
  return (
    <div className="space-y-3 rounded-xl border border-border bg-muted/40 p-3">
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <div key={i} className="relative">
            <div className={`grid place-items-center overflow-hidden rounded-lg bg-background ring-1 ring-border ${isVideo ? "h-24 w-40" : "h-20 w-20"}`}>
              {isVideo ? (
                previewUrl(item) ? (
                  <video src={previewUrl(item)} controls preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  <span className="line-clamp-3 break-all px-1 text-center text-[10px] text-muted-foreground">
                    {fileLabel(item)}
                  </span>
                )
              ) : (
                <img src={previewUrl(item)} alt="" className="h-full w-full object-cover" />
              )}
            </div>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-destructive text-destructive-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground">No files selected.</p>
        ) : null}
      </div>
      <input
        type="file"
        multiple
        accept={accept ?? "image/*"}
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onChange([...items, ...files]);
        }}
        className="block w-full text-xs file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-primary-foreground"
      />
    </div>
  );
}

export function FieldEditor({
  field,
  value,
  onChange,
  onSlugEdit,
}: {
  field: ResourceField;
  value: unknown;
  onChange: (v: unknown) => void;
  onSlugEdit?: (v: string) => void;
}) {
  switch (field.type) {
    case "textarea":
      return (
        <Textarea
          id={field.name}
          rows={4}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      );
    case "boolean":
      return (
        <div className="flex h-10 items-center">
          <Switch
            id={field.name}
            checked={Boolean(value)}
            onCheckedChange={(val) => onChange(val)}
          />
        </div>
      );
    case "select":
      return (
        <select
          id={field.name}
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          {!field.required ? <option value="">—</option> : null}
          {(field.options ?? []).map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "slug":
      return (
        <Input
          id={field.name}
          value={String(value ?? "")}
          placeholder="auto-generated"
          onChange={(e) => (onSlugEdit ?? onChange)(slugify(e.target.value))}
        />
      );
    case "image":
      return <ImageEditor value={value} accept={field.accept} onChange={onChange} />;
    case "gallery":
      return (
        <GalleryEditor
          value={(value as unknown[]) ?? []}
          accept={field.accept}
          onChange={onChange}
        />
      );
    case "list":
      return <ListEditor value={(value as string[]) ?? []} onChange={onChange} />;
    case "repeater":
      return (
        <RepeaterEditor
          value={(value as Record<string, unknown>[]) ?? []}
          subFields={field.subFields ?? []}
          onChange={onChange}
        />
      );
    default:
      return (
        <Input
          id={field.name}
          type={
            field.type === "number"
              ? "number"
              : field.type === "email"
                ? "email"
                : field.type === "url"
                  ? "url"
                  : field.type === "date"
                    ? "date"
                    : "text"
          }
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          required={field.required}
        />
      );
  }
}