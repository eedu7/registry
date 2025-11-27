import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, ClipboardCopyIcon, MoreVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Member } from "@/types/members";

export const FormatDate = ({ value }: { value: string | Date }) => {
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);

    const formattedDate = date.toLocaleDateString("en-GB").replace(/\//g, "-");

    return <div>{formattedDate}</div>;
};

export const columns: ColumnDef<Member>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                Name
                <ArrowUpDownIcon className="ml-2 size-4" />
            </Button>
        ),
    },
    {
        accessorKey: "father_husband_name",
        header: "F/H Name",
    },
    {
        accessorKey: "cnic_number",
        header: "CNIC Number",
        cell: ({ row }) => {
            const raw = row.getValue("cnic_number") as string;

            const digits = raw?.replace(/\D/g, "");

            let formatted = raw;
            if (digits && digits.length === 13) {
                formatted = `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`;
            }

            return (
                <div className="group/cnic flex justify-start group-hover/cnic:justify-between items-center">
                    {formatted}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="group-hover/cnic:scale-100 scale-0 transition-all"
                        onClick={() => navigator.clipboard.writeText(raw)}
                    >
                        <ClipboardCopyIcon />
                    </Button>
                </div>
            );
        },
    },
    {
        accessorKey: "gender",
        header: "Gender",
    },
    {
        accessorKey: "date_of_birth",
        header: "Date of Birth",
        cell: ({ row }) => <FormatDate value={row.getValue("date_of_birth")} />,
    },
    {
        accessorKey: "date_of_issue",
        header: "Date of Issue",
        cell: ({ row }) => <FormatDate value={row.getValue("date_of_issue")} />,
    },
    {
        accessorKey: "date_of_expiry",
        header: "Date of Expiry",
        cell: ({ row }) => <FormatDate value={row.getValue("date_of_expiry")} />,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const member = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVerticalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(member.cnic_number)}>
                            Copy CNIC Number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View customer</DropdownMenuItem>
                        <DropdownMenuItem>View payment details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
