import { createFileRoute } from "@tanstack/react-router";

import { CrudPage } from "./../components/admin/CrudPage";
import { RESOURCES, enquirySource } from "./../components/admin/resources";

const LABELS: Record<string, string> = {
  home: "Home page enquiries",
  assistance: "Assistance / call back enquiries",
  package: "Package enquiries",
  deal: "Deal enquiries",
  activity: "UAE activity enquiries",
  visa: "Visa enquiries",
  hotel: "Hotel enquiries",
};

export const Route = createFileRoute("/admin/enquiries/source/$source")({
  ssr: false,
  component: EnquiriesBySource,
});

function EnquiriesBySource() {
  const { source } = Route.useParams();
  const wanted = decodeURIComponent(source).replace(/-/g, " ").toLowerCase();

  return (
    <CrudPage
      key={wanted}
      resource={RESOURCES.enquiries}
      title={LABELS[wanted] ?? `${wanted} enquiries`}
      subtitle={`Showing enquiries submitted from the ${wanted} form.`}
      filter={(row) => {
        const s = enquirySource(row);
        // "deal" matches deal, deal package, deal visa, … ; others match exactly.
        return wanted === "deal" ? s.startsWith("deal") : s === wanted;
      }}
    />
  );
}
