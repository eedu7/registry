import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MemberForm } from "../components/member-form";

export const MemberPageView = () => {
    return (
        <div className="w-full h-full">
            <div className="grid grid-cols-2 w-full h-full gap-4">
                <div className="flex items-center justify-center w-full p-4">
                    <Card className="w-full max-w-lg">
                        <CardHeader>
                            <CardTitle>Form</CardTitle>
                            <CardDescription>Form Description</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <MemberForm />
                        </CardContent>
                        <CardFooter>
                            <p>Footer</p>
                        </CardFooter>
                    </Card>
                </div>
                <div></div>
            </div>
        </div>
    );
};
