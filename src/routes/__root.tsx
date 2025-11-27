import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Header } from "@/components/header";
import { Toaster } from "@/components/ui/sonner";

const RootLayout = () => (
    <>
        <div className="h-screen flex flex-col">
            <Header />
            <div className="flex-1">
                <Outlet />
            </div>
        </div>
        <TanStackRouterDevtools />
        <Toaster />
    </>
);

export const Route = createRootRoute({ component: RootLayout });
