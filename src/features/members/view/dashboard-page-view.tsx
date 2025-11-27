import { useGetMembers } from "@/hooks/use-member";
import { columns } from "../components/dashboard-columns";
import { DashboardDataTable } from "../components/dashboard-table";

export const DashboardPageView = () => {
    const { data, isPending } = useGetMembers();
    return (
        <div className="py-4 xl:py-10 p-2 lg:p-4">
            <DashboardDataTable columns={columns} data={data ?? []} isLoading={isPending} />
        </div>
    );
};
