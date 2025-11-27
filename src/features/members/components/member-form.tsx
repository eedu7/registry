import { SelectValue } from "@radix-ui/react-select";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import { Loader2Icon } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import * as z from "zod/mini";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { useCreateMember } from "@/hooks/use-member";
import { fileToByteArray } from "@/lib/utils";
import { gender } from "../constants";

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

type FormSchema = z.infer<typeof formSchema>;

export const MemberForm = () => {
    const [frontSideImage, setFrontSideImage] = useState<string | null>(null);
    const [backSideImage, setBackSideImage] = useState<string | null>(null);

    const [frontSideFile, setFrontSideFile] = useState<File | null>(null);
    const [backSideFile, setBackSideFile] = useState<File | null>(null);

    // Add refs for file inputs
    const frontSideInputRef = useRef<HTMLInputElement>(null);
    const backSideInputRef = useRef<HTMLInputElement>(null);

    const createMember = useCreateMember();

    const defaultValues: FormSchema = {
        name: "",
        cnicNumber: "",
        dateOfBirth: "",
        dateOfExpiry: "",
        dateOfIssue: "",
        fatherOrHusbandName: "",
        gender: "Male",
    };
    const form = useForm({
        validationLogic: revalidateLogic(),
        defaultValues: defaultValues,
        validators: {
            onDynamic: formSchema,
        },
        onSubmit: async ({ value }) => {
            try {
                // Convert images to byte array
                const frontSideBytes = frontSideFile ? await fileToByteArray(frontSideFile) : null;
                const backSideBytes = backSideFile ? await fileToByteArray(backSideFile) : null;

                if (!frontSideBytes || !backSideBytes) {
                    toast.error(`CNIC Images are required`);
                    return;
                }

                // Submit to backend
                createMember.mutateAsync(
                    {
                        cnic_number: value.cnicNumber,
                        name: value.name,
                        date_of_birth: value.dateOfBirth,
                        date_of_expiry: value.dateOfExpiry,
                        date_of_issue: value.dateOfExpiry,
                        father_husband_name: value.fatherOrHusbandName,
                        gender: value.gender,
                        cnic_back_image: frontSideBytes,
                        cnic_front_image: backSideBytes,
                    },
                    {
                        onSuccess: () => {
                            // Reset form after successful submission
                            form.reset();
                            setFrontSideImage(null);
                            setBackSideImage(null);
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
                    },
                );
            } catch (error) {
                toast.error(`Error submitting form: ${error}`);
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
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="md:flex gap-4">
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
            </div>
            <div className="md:flex gap-4">
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
            </div>
            <div className="md:flex gap-4">
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
            </div>
            <div className="md:flex gap-4">
                <div className="w-full flex flex-col gap-4">
                    <Field>
                        <FieldLabel>CNIC Front-Side</FieldLabel>
                        <Input
                            ref={frontSideInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFrontSideChange}
                            placeholder="CNIC Back Image"
                        />
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
                    </Field>
                    {backSideImage && (
                        <img
                            src={backSideImage}
                            alt="CNIC back side"
                            className="w-full h-72 object-cover rounded-lg border"
                        />
                    )}
                </div>
            </div>

            <form.Subscribe
                children={() => (
                    <Field>
                        <Button type="submit" disabled={createMember.isPending}>
                            {createMember.isPending ? (
                                <>
                                    <Loader2Icon className="animate-spin size-4" />
                                    Submitting
                                </>
                            ) : (
                                <>Submit</>
                            )}
                        </Button>
                    </Field>
                )}
            />
        </form>
    );
};
