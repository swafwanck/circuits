import { createFileRoute } from "@tanstack/react-router";

import { CrudPage } from "./../components/admin/CrudPage";
import { RESOURCES } from "./../components/admin/resources";

export const Route = createFileRoute("/admin/payment-link-records")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Payment links — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <CrudPage
      resource={RESOURCES.payment_links}
      title="Generated payment links"
      subtitle="View and delete Adyen payment links. Link records cannot be edited."
      readOnly
    />
  ),
});
