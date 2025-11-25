import * as z from "zod/mini";

const gender = ["male", "female", "other"] as const;

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
    gender: z.enum(gender).check(
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
    return <div>MemberForm</div>;
};
