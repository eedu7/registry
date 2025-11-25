import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/")({
    component: Index,
});

function Index() {
    return (
        <div className="h-full flex items-center justify-center">
            <Card className="max-w-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl">Welcome Back!</CardTitle>
                    <CardDescription>Ready to manage your member records?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 text-center">
                        <Sparkles className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Get Started Now</h3>
                        <p className="text-gray-600 mb-4">
                            Add members, upload CNIC images, and keep all your records organized in one place.
                        </p>
                        <Link to="/demo">
                            <Button size="lg" className="w-full">
                                Go to Members
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center pt-2">
                        <div>
                            <div className="text-2xl font-bold text-blue-600">Fast</div>
                            <div className="text-xs text-gray-600">Lightning Speed</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-green-600">Secure</div>
                            <div className="text-xs text-gray-600">Local Storage</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-600">Simple</div>
                            <div className="text-xs text-gray-600">Easy to Use</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
