import { createFileRoute } from "@tanstack/react-router";
import { DashboardPageView } from "@/features/members/view/dashboard-page-view";

export const Route = createFileRoute("/members/dashboard/")({
    component: RouteComponent,
});

function RouteComponent() {
    return <DashboardPageView />;
}
