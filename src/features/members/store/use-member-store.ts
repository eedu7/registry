import { create } from "zustand";
import { byteArrayToBase64 } from "@/lib/utils";
import type { Member } from "@/types/members";

interface EditMemberSheetStore {
    open: boolean;
    data: Member | null;
    setOpen: (open: boolean) => void;
    setData: (data: Member | null) => void;
    openSheet: (data: Member | null) => void;
    closeSheet: () => void;
}

export const useEditMemberSheetStore = create<EditMemberSheetStore>((set) => ({
    open: false,
    data: null,
    setOpen: (open) => set({ open }),
    setData: (data) => set({ data }),
    openSheet: (data) => set({ open: true, data }),
    closeSheet: () => set({ open: false, data: null }),
}));

interface CnicDrawerStore {
    open: boolean;
    cnicFrontImage: string | null;
    cnicBackImage: string | null;
    memberName: string | null;
    cnicNumber: string | null;
    setOpen: (open: boolean) => void;
    openDrawer: (
        cnicFront: number[] | null | undefined,
        cnicBack: number[] | null | undefined,
        name: string,
        cnicNumber: string,
    ) => void;
    closeDrawer: () => void;
}

export const useCnicDrawerStore = create<CnicDrawerStore>((set) => ({
    open: false,
    cnicBackImage: null,
    cnicFrontImage: null,
    memberName: null,
    cnicNumber: null,
    setOpen: (open) => set({ open }),
    openDrawer: (cnicFront, cnicBack, name, cnicNumber) => {
        const frontImage = byteArrayToBase64(cnicFront);
        const backImage = byteArrayToBase64(cnicBack);
        set({
            open: true,
            cnicFrontImage: frontImage,
            cnicBackImage: backImage,
            memberName: name,
            cnicNumber,
        });
    },
    closeDrawer: () =>
        set({
            open: false,
            cnicBackImage: null,
            cnicFrontImage: null,
            memberName: null,
            cnicNumber: null,
        }),
}));
