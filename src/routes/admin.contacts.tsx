import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "./../components/admin/CrudPage";
import { RESOURCES } from "./../components/admin/resources";

export const Route = createFileRoute("/admin/contacts")({
  ssr: false,
  component: () => <CrudPage resource={RESOURCES.contacts} />,
});
