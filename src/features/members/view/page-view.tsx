import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@radix-ui/react-navigation-menu";
import { Link } from "@tanstack/react-router";
import { LayoutDashboardIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { MemberForm } from "../components/member-form";

export const MemberPageView = () => {
    return (
        <div className="w-full h-full">
            <div className="flex items-center justify-center w-full h-full p-4">
                <Card className="w-full max-w-7xl mx-auto shadow-none border-none">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="lg:text-2xl">New Member Entry</CardTitle>
                            <NavigationMenu>
                                <NavigationMenuList>
                                    <NavigationMenuItem>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                                            <Link to="/members/dashboard">
                                                <LayoutDashboardIcon className="lg:size-6 mr-2" />
                                                <span className="lg:text-lg">Dashboard</span>
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                        <CardDescription className="lg:text-lg">
                            Provide member information and attach CNIC images for record-keeping.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MemberForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};
