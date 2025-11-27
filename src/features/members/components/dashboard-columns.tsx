import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDownIcon, ClipboardCopyIcon, Edit3Icon, ImageIcon, MoreVerticalIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Member } from "@/types/members";
import { useCnicDrawerStore, useEditMemberSheetStore } from "../store/use-member-store";
import { ConfirmDeleteMember } from "./confirm-delete-member";

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
        accessorKey: "cnic_images",
        header: "View CNIC",
        cell: ({ row }) => {
            const { openDrawer } = useCnicDrawerStore();
            const member = row.original;
            return (
                <Button
                    variant="ghost"
                    className="cursor-pointer font-normal"
                    onClick={() =>
                        openDrawer(member.cnic_front_image, member.cnic_back_image, member.name, member.cnic_number)
                    }
                >
                    View
                    <ImageIcon />
                </Button>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const member = row.original;
            const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
            const { openSheet } = useEditMemberSheetStore();

            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVerticalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openSheet(member)} className="cursor-pointer">
                                <Edit3Icon className="size-4 text-blue-600" />
                                <span className="text-blue-600">Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)} className="cursor-pointer">
                                <TrashIcon className="size-4 text-rose-600" />
                                <span className="text-rose-600">Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {member.id && (
                        <ConfirmDeleteMember
                            id={member.id}
                            open={openDeleteDialog}
                            onOpenChange={setOpenDeleteDialog}
                        />
                    )}
                </>
            );
        },
    },
];
