import { createFileRoute, Link } from "@tanstack/react-router";

import { ResourceForm } from "./../components/admin/ResourceForm";
import { RESOURCES } from "./../components/admin/resources";

export const Route = createFileRoute("/admin/$resource/$id/edit")({
  ssr: false,
  component: EditRecordPage,
});

function EditRecordPage() {
  const { resource, id } = Route.useParams();
  const def = RESOURCES[resource];
  if (!def) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <p className="text-sm">Unknown section “{resource}”.</p>
        <Link to="/admin" className="mt-2 inline-block text-sm font-semibold text-primary">
          Back to dashboard
        </Link>
      </div>
    );
  }
  return <ResourceForm resource={def} recordId={id} />;
}
