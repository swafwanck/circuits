import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "./../components/admin/CrudPage";
import { RESOURCES } from "./../components/admin/resources";

export const Route = createFileRoute("/admin/gallery")({
  ssr: false,
  component: () => <CrudPage resource={RESOURCES.gallery} />,
});
