import { useGetMembers } from "@/hooks/use-member";
import { columns } from "../components/dashboard-columns";
import { DashboardDataTable } from "../components/dashboard-table";
import { EditMember } from "../components/edit-member";
import { ViewCnicDrawer } from "../components/view-cnic-drawer";

export const DashboardPageView = () => {
    const { data, isPending } = useGetMembers();
    return (
        <div className="py-4 xl:py-10 p-2 lg:p-4">
            <DashboardDataTable columns={columns} data={data ?? []} isLoading={isPending} />
            <EditMember />
            <ViewCnicDrawer />
        </div>
    );
};
