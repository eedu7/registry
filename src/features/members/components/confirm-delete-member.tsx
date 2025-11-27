import { Loader2Icon } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteMember } from "@/hooks/use-member";

interface Props {
    id: number;
    open: boolean;
    onOpenChange: (val: boolean) => void;
}

export function ConfirmDeleteMember({ id, open, onOpenChange }: Props) {
    const { mutate, isPending } = useDeleteMember();

    const handleClick = () => {
        mutate(id, {
            onSuccess: () => {
                onOpenChange(false);
            },
        });
    };
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the data.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                        <Button variant="destructive" onClick={handleClick} disabled={isPending}>
                            {isPending ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin mr-2" />
                                    Deleting
                                </>
                            ) : (
                                <span>Confirm Delete</span>
                            )}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
