import { createFileRoute } from "@tanstack/react-router";

import { CrudPage } from "./../components/admin/CrudPage";
import { RESOURCES } from "./../components/admin/resources";

const LABELS: Record<string, string> = {
  package: "Package bookings",
  deal_package: "Deal package bookings",
  activity: "UAE activity bookings",
  deal_activity: "Deal activity bookings",
  hotel: "Hotel bookings",
  deal_hotel: "Deal hotel bookings",
  visa: "Visa bookings",
};

export const Route = createFileRoute("/admin/bookings/type/$type")({
  ssr: false,
  component: BookingsByType,
});

function BookingsByType() {
  const { type } = Route.useParams();
  return (
    <CrudPage
      resource={RESOURCES.bookings}
      title={LABELS[type] ?? `${type} bookings`}
      subtitle={`Showing bookings of type “${type}”.`}
      filter={(row) => String(row.booking_type ?? "") === type}
    />
  );
}
