import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "./../components/admin/CrudPage";
import { RESOURCES } from "./../components/admin/resources";

export const Route = createFileRoute("/admin/payments")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Payment records — Admin" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: () => (
    <CrudPage
      resource={RESOURCES.payments}
      title="Payment records"
      subtitle="All Adyen transactions and their verification status."
    />
  ),
});
