import { createFileRoute } from "@tanstack/react-router";
import { MemberPageView } from "@/features/members/view/page-view";

export const Route = createFileRoute("/members/")({
    component: Index,
});

export default function Index() {
    return <MemberPageView />;
}
