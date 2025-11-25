import { SelectValue } from "@radix-ui/react-select";
import { revalidateLogic, useForm } from "@tanstack/react-form";
import * as z from "zod/mini";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
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
        onSubmit: ({ value }) => {
            console.table(value);
        },
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
    };
    return (
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
            <form.Subscribe
                children={() => (
                    <Field>
                        <Button type="submit">Submit</Button>
                    </Field>
                )}
            />
        </form>
    );
};
