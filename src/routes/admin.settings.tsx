import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "./../components/admin/CrudPage";
import { RESOURCES } from "./../components/admin/resources";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  component: () => <CrudPage resource={RESOURCES.settings} />,
});
