import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCnicDrawerStore } from "../store/use-member-store";

export const ViewCnicDrawer = () => {
    const { open, setOpen, memberName, cnicBackImage, cnicFrontImage, cnicNumber } = useCnicDrawerStore();

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>{memberName}</SheetTitle>
                    <SheetDescription>{cnicNumber}</SheetDescription>
                </SheetHeader>
                <Separator className="my-4" />
                <div className="space-y-6 p-4">
                    <div className="space-y-2">
                        <Label>CNIC Front-Side</Label>
                        {cnicFrontImage && (
                            <img src={cnicFrontImage} alt="CNIC Front" className="w-full rounded-lg border" />
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label>CNIC Back-Side</Label>
                        {cnicBackImage && (
                            <img src={cnicBackImage} alt="CNIC Back" className="w-full rounded-lg border" />
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
};
