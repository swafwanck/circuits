import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, Loader2, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

import { api, listAll } from "./../../lib/api";
import type { Resource, ResourceField } from "./resources";
import type { Row } from "./fields";
import { Button } from "./../../components/ui/button";
import { Input } from "./../../components/ui/input";
import { Badge } from "./../../components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./../../components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./../../components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/ui/table";

export function CrudPage({
  resource,
  title,
  subtitle,
  filter,
  readOnly = false,
}: {
  resource: Resource;
  title?: string;
  subtitle?: string;
  filter?: (row: Row) => boolean;
  readOnly?: boolean;
}) {
  const qc = useQueryClient();
  const idKey = resource.identifier ?? "id";
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<Row | null>(null);
  const [viewRow, setViewRow] = useState<Row | null>(null);

  const queryKey = ["admin", resource.key];
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey,
    queryFn: () => listAll<Row>(resource.path),
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (row: Row) => {
      await api.delete(`${resource.path}${row[idKey]}/`);
    },
    onSuccess: () => {
      toast.success("Deleted");
      qc.invalidateQueries({ queryKey });
      setConfirmDelete(null);
    },
    onError: (err: Error) => toast.error(err.message || "Delete failed"),
  });

  const listFields = resource.fields.filter((f) => f.listVisible).slice(0, 6);
  const rows = (data ?? [])
    .filter((r) => (filter ? filter(r) : true))
    .filter((r) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return Object.values(r).some((v) => v != null && String(v).toLowerCase().includes(q));
    })
    // Always list oldest first (1, 2, 3 …) instead of newest first.
    .sort((a, b) => Number(a[idKey] ?? 0) - Number(b[idKey] ?? 0));

  function cellValue(row: Row, f: ResourceField) {
    const v = f.compute ? f.compute(row) : row[f.name];
    if (f.type === "boolean") {
      return <Badge variant={v ? "default" : "secondary"}>{v ? "Yes" : "No"}</Badge>;
    }
    if (f.type === "gallery" && Array.isArray(v)) {
      const urls = v.filter((x): x is string => typeof x === "string" && !!x);
      if (!urls.length) return <span className="text-sm text-muted-foreground">—</span>;
      if ((f.accept ?? "").includes("video"))
        return <span className="text-sm text-muted-foreground">{urls.length} video(s)</span>;
      return (
        <div className="flex items-center gap-1">
          {urls.slice(0, 3).map((u, i) => (
            <img
              key={i}
              src={u}
              alt=""
              loading="lazy"
              className="h-10 w-10 rounded-md object-cover ring-1 ring-border"
            />
          ))}
          {urls.length > 3 ? (
            <span className="text-[11px] text-muted-foreground">+{urls.length - 3}</span>
          ) : null}
        </div>
      );
    }
    if (Array.isArray(v)) {
      return <span className="text-sm text-muted-foreground">{v.length} item(s)</span>;
    }
    if (f.type === "image") {
      return typeof v === "string" && v ? (
        <img
          src={v}
          alt=""
          loading="lazy"
          className="h-10 w-14 rounded-md object-cover ring-1 ring-border"
        />
      ) : (
        <span className="text-sm text-muted-foreground">—</span>
      );
    }
    return (
      <span className="line-clamp-2 text-sm">{v == null || v === "" ? "—" : String(v)}</span>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4 sm:rounded-3xl sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground sm:text-xs">
              Manage
            </p>
            <h1 className="truncate text-lg font-bold sm:text-2xl">{title ?? resource.label}</h1>
            <p className="mt-1 truncate text-[11px] text-muted-foreground sm:text-xs">
              {subtitle ?? (
                <>
                  Connected to{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-primary sm:text-[11px]">
                    {resource.path}
                  </code>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-0 flex-1 rounded-full sm:w-48 sm:flex-none"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              className="shrink-0 rounded-full"
              aria-label="Refresh"
            >
              <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            </Button>
            {readOnly ? null : (
              <Button asChild className="shrink-0 rounded-full">
                <Link
                  to="/admin/$resource/new"
                  params={{ resource: resource.key }}
                >
                  <Plus className="mr-1 h-4 w-4" /> New
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-4 text-sm">
          <p className="font-medium text-destructive">Failed to load</p>
          <p className="break-words text-muted-foreground">{(error as Error).message}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Check that your Django API is running and that <code>VITE_API_URL</code> points to it.
          </p>
        </div>
      ) : null}

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {isLoading ? (
          <div className="grid place-items-center rounded-2xl border border-border bg-card p-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
            No records.
          </p>
        ) : (
          rows.map((row) => (
            <div
              key={String(row[idKey])}
              className="rounded-2xl border border-border bg-card p-4"
            >
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="min-w-0 space-y-1">
                  {listFields.map((f) => (
                    <div key={f.name} className="flex min-w-0 gap-2 text-sm">
                      <span className="shrink-0 text-xs text-muted-foreground">{f.label}:</span>
                      <span className="min-w-0 break-words">{cellValue(row, f)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="View details" className="text-black hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                    onClick={() => setViewRow(row)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {readOnly ? null : (
                    <Button asChild variant="ghost" size="icon" aria-label="Edit" className="text-black hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                      <Link
                        to="/admin/$resource/$id/edit"
                        params={{ resource: resource.key, id: String(row[idKey]) }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete" className="text-black hover:bg-destructive hover:text-white dark:text-white dark:hover:bg-destructive dark:hover:text-white"
                    onClick={() => setConfirmDelete(row)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-3xl border border-border bg-card md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              {listFields.map((f) => (
                <TableHead key={f.name} className="whitespace-nowrap">
                  {f.label}
                </TableHead>
              ))}
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={listFields.length + 2} className="text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={listFields.length + 2}
                  className="text-center text-sm text-muted-foreground"
                >
                  No records.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={String(row[idKey])}>
                  <TableCell className="text-xs text-muted-foreground">
                    {String(row[idKey] ?? "—")}
                  </TableCell>
                  {listFields.map((f) => (
                    <TableCell key={f.name} className="max-w-[220px]">
                      {cellValue(row, f)}
                    </TableCell>
                  ))}
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="View details" className="text-black hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black"
                      onClick={() => setViewRow(row)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {readOnly ? null : (
                      <Button asChild variant="ghost" size="icon" aria-label="Edit" className="text-black hover:bg-black hover:text-white dark:text-white dark:hover:bg-white dark:hover:text-black">
                        <Link
                          to="/admin/$resource/$id/edit"
                          params={{ resource: resource.key, id: String(row[idKey]) }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete" className="text-black hover:bg-destructive hover:text-white dark:text-white dark:hover:bg-destructive dark:hover:text-white"
                      onClick={() => setConfirmDelete(row)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewRow} onOpenChange={(o) => !o && setViewRow(null)}>
        <DialogContent className="max-h-[88vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{resource.label} details</DialogTitle>
            <DialogDescription>
              Record #{viewRow ? String(viewRow[idKey] ?? "—") : ""}
            </DialogDescription>
          </DialogHeader>
          {viewRow ? <RecordDetails row={viewRow} fields={visibleFields(resource.fields, viewRow)} /> : null}
        </DialogContent>
      </Dialog>


      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this record?</AlertDialogTitle>
            <AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && deleteMutation.mutate(confirmDelete)}
            >
              {deleteMutation.isPending ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ---------------- details view ---------------- */

/** Only show fields that apply to this record (e.g. deal category) and that hold a value. */
function visibleFields(fields: ResourceField[], row: Row): ResourceField[] {
  return fields.filter((f) => {
    if (f.showFor) {
      const current = String(row[f.showFor.field] ?? "").toLowerCase();
      if (!f.showFor.values.includes(current)) return false;
    }
    const v = f.compute ? f.compute(row) : row[f.name];
    if (v == null || v === "") return false;
    if (Array.isArray(v) && v.length === 0) return false;
    return true;
  });
}

function urls(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === "string" && !!x);
  return typeof v === "string" && v ? [v] : [];
}

function RecordDetails({ row, fields }: { row: Row; fields: ResourceField[] }) {
  const media = fields.filter((f) => f.type === "image" || f.type === "gallery");
  const rest = fields.filter((f) => f.type !== "image" && f.type !== "gallery");
  const isVid = (f: ResourceField) => (f.accept ?? "").includes("video");
  const images = media.filter((f) => !isVid(f)).flatMap((f) => urls(row[f.name]));
  const videoFiles = media.filter(isVid).flatMap((f) => urls(row[f.name]));
  const link = typeof row.video_url === "string" ? row.video_url : "";
  const yt = link.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{6,})/)?.[1];

  return (
    <div className="space-y-5">
      {yt || videoFiles.length || link ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {yt ? (
            <iframe
              src={`https://www.youtube.com/embed/${yt}`}
              title="YouTube video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full rounded-xl ring-1 ring-border"
            />
          ) : link ? (
            <video src={link} controls preload="metadata" className="aspect-video w-full rounded-xl bg-muted ring-1 ring-border" />
          ) : null}
          {videoFiles.map((u, i) => (
            <video
              key={i}
              src={u}
              controls
              preload="metadata"
              poster={typeof row.image === "string" && row.image ? row.image : undefined}
              className="aspect-video w-full rounded-xl bg-muted ring-1 ring-border"
            />
          ))}
        </div>
      ) : null}
      {images.length ? (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {images.map((u, i) => (
            <a key={i} href={u} target="_blank" rel="noreferrer" className="group">
              <img
                src={u}
                alt=""
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover ring-1 ring-border transition group-hover:opacity-90"
              />
            </a>
          ))}
        </div>
      ) : null}

      <dl className="grid gap-3 sm:grid-cols-2">
        {rest.map((f) => {
          const v = f.compute ? f.compute(row) : row[f.name];
          let display: React.ReactNode;
          if (v == null || v === "") display = "—";
          else if (typeof v === "boolean") display = v ? "Yes" : "No";
          else if (Array.isArray(v))
            display = (
              <ul className="list-disc space-y-1 pl-4">
                {v.map((item, i) => (
                  <li key={i} className="break-words">
                    {typeof item === "object" && item !== null
                      ? Object.entries(item as Record<string, unknown>)
                          .map(([k, val]) => `${k}: ${Array.isArray(val) ? val.join(", ") : String(val ?? "")}`)
                          .join(" — ")
                      : String(item)}
                  </li>
                ))}
              </ul>
            );
          else if (typeof v === "object") display = JSON.stringify(v);
          else display = String(v);

          return (
            <div
              key={f.name}
              className={`rounded-xl border border-border bg-muted/30 p-3 ${f.full ? "sm:col-span-2" : ""}`}
            >
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {f.label}
              </dt>
              <dd className="mt-1 whitespace-pre-wrap break-words text-sm">{display}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}