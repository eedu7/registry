import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import * as z from "zod/mini";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useUpdateMember } from "@/hooks/use-member";
import { byteArrayToBase64, fileToByteArray } from "@/lib/utils";
import { gender } from "../constants";
import { useEditMemberSheetStore } from "../store/use-member-store";

const formSchema = z.object({
    name: z.string().check(
        z.minLength(1, {
            error: "'Name' is required",
        }),
    ),
    fatherOrHusbandName: z.string().check(
        z.minLength(1, {
            error: "'Father or Husband name' is required",
        }),
    ),
    cnicNumber: z.string().check(
        z.minLength(1, {
            error: "'CNIC number' is required",
        }),
    ),
    gender: z.string().check(
        z.minLength(1, {
            error: "'Gender' is required",
        }),
    ),
    dateOfBirth: z.string().check(
        z.minLength(1, {
            error: "'Date of birth' is required",
        }),
    ),
    dateOfIssue: z.string().check(
        z.minLength(1, {
            error: "'Date of issue' is required",
        }),
    ),
    dateOfExpiry: z.string().check(
        z.minLength(1, {
            error: "'Date of expiry' is required",
        }),
    ),
});

export const EditMember = () => {
    const { open, setOpen, data } = useEditMemberSheetStore();

    const [frontSideImage, setFrontSideImage] = useState<string | null>(null);
    const [backSideImage, setBackSideImage] = useState<string | null>(null);

    const [frontSideFile, setFrontSideFile] = useState<File | null>(null);
    const [backSideFile, setBackSideFile] = useState<File | null>(null);

    // Add refs for file inputs
    const frontSideInputRef = useRef<HTMLInputElement>(null);
    const backSideInputRef = useRef<HTMLInputElement>(null);

    const editMember = useUpdateMember(data?.id!);

    // Initialize images from data when component mounts or data changes
    useEffect(() => {
        if (data) {
            const fImage = byteArrayToBase64(data.cnic_front_image);
            const bImage = byteArrayToBase64(data.cnic_back_image);
            setFrontSideImage(fImage);
            setBackSideImage(bImage);
        }
    }, [data]);

    const form = useForm({
        validationLogic: revalidateLogic(),
        defaultValues: {
            name: data?.name || "",
            cnicNumber: data?.cnic_number || "",
            dateOfBirth: data?.date_of_birth || "",
            dateOfExpiry: data?.date_of_expiry || "",
            dateOfIssue: data?.date_of_issue || "",
            fatherOrHusbandName: data?.father_husband_name || "",
            gender: data?.gender || "Male",
        },
        validators: {
            onDynamic: formSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                // Prepare member data
                const memberUpdate: any = {
                    name: value.name,
                    cnic_number: value.cnicNumber,
                    date_of_birth: value.dateOfBirth,
                    date_of_expiry: value.dateOfExpiry,
                    date_of_issue: value.dateOfIssue,
                    father_husband_name: value.fatherOrHusbandName,
                    gender: value.gender,
                };

                // Only convert and add images if new files were selected
                // Use new images if uploaded, otherwise keep existing ones
                if (frontSideFile) {
                    memberUpdate.cnic_front_image = await fileToByteArray(frontSideFile);
                } else if (data?.cnic_front_image) {
                    memberUpdate.cnic_front_image = data.cnic_front_image;
                }

                if (backSideFile) {
                    memberUpdate.cnic_back_image = await fileToByteArray(backSideFile);
                } else if (data?.cnic_back_image) {
                    memberUpdate.cnic_back_image = data.cnic_back_image;
                }

                // Submit to backend
                await editMember.mutateAsync(memberUpdate, {
                    onSuccess: () => {
                        setOpen(false);
                        // Reset file states
                        setFrontSideFile(null);
                        setBackSideFile(null);

                        // Reset file input elements
                        if (frontSideInputRef.current) {
                            frontSideInputRef.current.value = "";
                        }
                        if (backSideInputRef.current) {
                            backSideInputRef.current.value = "";
                        }
                    },
                });
            } catch (error) {
                toast.error(`Error updating member: ${error}`);
            }
        },
    });

    const handleFrontSideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFrontSideFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setFrontSideImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBackSideChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBackSideFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setBackSideImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Member</SheetTitle>
                    <SheetDescription>
                        Make changes to member information. Click save when you&apos;re done.
                    </SheetDescription>
                </SheetHeader>
                <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <form.Field
                            name="name"
                            children={(field) => (
                                <Field className="-space-y-1.5">
                                    <FieldLabel>Name</FieldLabel>
                                    <Input
                                        placeholder="John Doe"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </Field>
                            )}
                        />
                        <form.Field
                            name="fatherOrHusbandName"
                            children={(field) => (
                                <Field className="-space-y-1.5">
                                    <FieldLabel>Father or Husband Name</FieldLabel>
                                    <Input
                                        placeholder="John Doe"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </Field>
                            )}
                        />
                        <form.Field
                            name="cnicNumber"
                            children={(field) => (
                                <Field className="-space-y-1.5">
                                    <FieldLabel>CNIC Number</FieldLabel>
                                    <Input
                                        placeholder="12345-1234567-1"
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </Field>
                            )}
                        />
                        <form.Field
                            name="gender"
                            children={(field) => (
                                <Field className="-space-y-1.5">
                                    <FieldLabel>Gender</FieldLabel>
                                    <Select value={field.state.value} onValueChange={field.handleChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {gender.map((val) => (
                                                <SelectItem value={val} key={val}>
                                                    {val}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            )}
                        />
                        <form.Field
                            name="dateOfBirth"
                            children={(field) => (
                                <Field className="-space-y-1.5">
                                    <FieldLabel>Birth Date</FieldLabel>
                                    <Input
                                        value={field.state.value}
                                        type="date"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </Field>
                            )}
                        />
                        <form.Field
                            name="dateOfIssue"
                            listeners={{
                                onChange: ({ value }) => {
                                    if (value) {
                                        const issueDate = new Date(value);
                                        issueDate.setFullYear(issueDate.getFullYear() + 10);
                                        const expiryDate = issueDate.toISOString().split("T")[0];
                                        form.setFieldValue("dateOfExpiry", expiryDate);
                                    }
                                },
                            }}
                            children={(field) => (
                                <Field className="-space-y-1.5">
                                    <FieldLabel>Issue Date</FieldLabel>
                                    <Input
                                        value={field.state.value}
                                        type="date"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </Field>
                            )}
                        />
                        <form.Field
                            name="dateOfExpiry"
                            children={(field) => (
                                <Field className="-space-y-1.5">
                                    <FieldLabel>Expiry Date</FieldLabel>
                                    <Input
                                        value={field.state.value}
                                        type="date"
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                </Field>
                            )}
                        />
                        <div className="w-full flex flex-col gap-4">
                            <Field>
                                <FieldLabel>CNIC Front-Side</FieldLabel>
                                <Input
                                    ref={frontSideInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFrontSideChange}
                                    placeholder="CNIC Front Image"
                                />
                                {frontSideFile && (
                                    <p className="text-sm text-muted-foreground mt-1">Selected: {frontSideFile.name}</p>
                                )}
                                {!frontSideFile && frontSideImage && (
                                    <p className="text-sm text-muted-foreground mt-1">Current: CNIC_Front_Image.jpg</p>
                                )}
                            </Field>
                            {frontSideImage && (
                                <img
                                    src={frontSideImage}
                                    alt="CNIC front side"
                                    className="w-full h-72 object-cover rounded-lg border"
                                />
                            )}
                        </div>
                        <div className="w-full flex flex-col gap-4">
                            <Field>
                                <FieldLabel>CNIC Back-Side</FieldLabel>
                                <Input
                                    ref={backSideInputRef}
                                    type="file"
                                    accept="image/*"
                                    placeholder="CNIC Back Image"
                                    onChange={handleBackSideChange}
                                />
                                {backSideFile && (
                                    <p className="text-sm text-muted-foreground mt-1">Selected: {backSideFile.name}</p>
                                )}
                                {!backSideFile && backSideImage && (
                                    <p className="text-sm text-muted-foreground mt-1">Current: CNIC_Back_Image.jpg</p>
                                )}
                            </Field>
                            {backSideImage && (
                                <img
                                    src={backSideImage}
                                    alt="CNIC back side"
                                    className="w-full h-72 object-cover rounded-lg border"
                                />
                            )}
                        </div>

                        <form.Subscribe
                            children={() => (
                                <Field>
                                    <Button type="submit" disabled={editMember.isPending}>
                                        {editMember.isPending ? (
                                            <>
                                                <Loader2Icon className="animate-spin size-4" />
                                                Updating
                                            </>
                                        ) : (
                                            <>Update</>
                                        )}
                                    </Button>
                                </Field>
                            )}
                        />
                    </form>
                </div>
            </SheetContent>
        </Sheet>
    );
};
