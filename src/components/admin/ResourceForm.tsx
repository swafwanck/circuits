import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Save } from "lucide-react";

import { api, listAll } from "./../../lib/api";
import type { Resource, ResourceField } from "./resources";
import {
  FieldEditor,
  buildInitialForm,
  buildPayload,
  isFieldVisible,
  slugify,
  type Row,
} from "./fields";
import { Button } from "./../../components/ui/button";
import { Label } from "./../../components/ui/label";

/** Sidebar route slug for a resource key (routes use dashes). */
export const resourceRoute = (key: string) => `/admin/${key.replace(/_/g, "-")}`;

export function ResourceForm({
  resource,
  recordId,
}: {
  resource: Resource;
  recordId?: string;
}) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const idKey = resource.identifier ?? "id";
  const isEdit = recordId != null;

  const [form, setForm] = useState<Row>(() => buildInitialForm(resource.fields));
  const [slugTouched, setSlugTouched] = useState(false);

  const { data: record, isLoading } = useQuery({
    queryKey: ["admin", resource.key, "record", recordId],
    queryFn: async () => {
      const rows = await listAll<Row>(resource.path);
      return rows.find((r) => String(r[idKey]) === String(recordId)) ?? null;
    },
    enabled: isEdit,
    retry: false,
  });

  useEffect(() => {
    if (record) {
      setForm({ ...buildInitialForm(resource.fields), ...record });
      setSlugTouched(true);
    }
  }, [record, resource]);

  const save = useMutation({
    mutationFn: async () => {
      if (isEdit) {
        // PATCH only what actually changed — re-sending every untouched field
        // (image URLs, slugs, JSON blocks) could fail validation and silently
        // block simple edits such as toggling "Active". Boolean fields are
        // ALWAYS included so the Active/show-on-home switches can never be
        // dropped from the payload.
        const changedFields = record
          ? resource.fields.filter(
              (f) => JSON.stringify(form[f.name] ?? null) !== JSON.stringify(record[f.name] ?? null),
            )
          : resource.fields;
        const alwaysInclude = record ? resource.fields.filter((f) => f.type === "boolean") : [];
        const payloadFields = [
          ...new Map([...alwaysInclude, ...changedFields].map((f) => [f.name, f])).values(),
        ];
        const body = buildPayload(form, payloadFields.length ? payloadFields : resource.fields);
        return api.patch<Row>(`${resource.path}${recordId}/`, body);
      }
      return api.post<Row>(resource.path, buildPayload(form, resource.fields));
    },
    onSuccess: () => {
      toast.success(isEdit ? "Changes saved" : "Record created");
      qc.invalidateQueries({ queryKey: ["admin", resource.key] });
      navigate({ to: resourceRoute(resource.key) as "/admin/packages" });
    },
    onError: (err: Error) => toast.error(err.message || "Save failed"),
  });

  function setField(name: string, value: unknown) {
    setForm((p) => {
      const next = { ...p, [name]: value };
      const slugField = resource.fields.find((f) => f.type === "slug");
      if (slugField && slugField.from === name && !slugTouched) {
        next[slugField.name] = slugify(String(value ?? ""));
      }
      return next;
    });
  }

  const groups = useMemo(() => {
    const map = new Map<string, ResourceField[]>();
    for (const f of resource.fields) {
      if (!isFieldVisible(f, form)) continue;
      const g = f.group ?? "Details";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(f);
    }
    return Array.from(map.entries());
  }, [resource, form]);

  if (isEdit && isLoading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form
      className="space-y-4 sm:space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate();
      }}
    >
      <div className="sticky top-[60px] z-10 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-card/95 p-3 backdrop-blur sm:rounded-3xl sm:p-4">
        <Button
          asChild
          type="button"
          variant="outline"
          size="icon"
          className="shrink-0 rounded-full"
        >
          <Link to={resourceRoute(resource.key) as "/admin/packages"} aria-label="Back">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
            {isEdit ? "Edit" : "Create"}
          </p>
          <h1 className="truncate text-base font-bold sm:text-xl">{resource.label}</h1>
        </div>
        <Button type="submit" disabled={save.isPending} className="shrink-0 rounded-full">
          {save.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span className="ml-1 hidden sm:inline">{isEdit ? "Save changes" : "Create"}</span>
        </Button>
      </div>

      {groups.map(([groupName, fields]) => (
        <section
          key={groupName}
          className="rounded-2xl border border-border bg-card p-3 sm:rounded-3xl sm:p-6"
        >
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-primary">
            {groupName}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map((f) => (
              <div
                key={f.name}
                className={
                  f.full || ["textarea", "list", "repeater", "gallery"].includes(f.type)
                    ? "min-w-0 sm:col-span-2"
                    : "min-w-0"
                }
              >
                <Label htmlFor={f.name} className="mb-1 block text-sm">
                  {f.label}
                  {f.required ? <span className="text-destructive"> *</span> : null}
                </Label>
                <FieldEditor
                  field={f}
                  value={form[f.name]}
                  onChange={(v) => setField(f.name, v)}
                  onSlugEdit={(v) => {
                    setSlugTouched(true);
                    setForm((p) => ({ ...p, [f.name]: v }));
                  }}
                />
                {f.help ? (
                  <p className="mt-1 text-[11px] text-muted-foreground">{f.help}</p>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="flex flex-wrap items-center justify-end gap-2 pb-6">
        <Button asChild type="button" variant="outline" className="rounded-full">
          <Link to={resourceRoute(resource.key) as "/admin/packages"}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={save.isPending} className="rounded-full">
          {save.isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
          {isEdit ? "Save changes" : "Create"}
        </Button>
      </div>
    </form>
  );
}
