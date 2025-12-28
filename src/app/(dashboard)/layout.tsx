import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";


interface Prps {
    children: React.ReactNode;
}
const Layout = ({ children }: Prps) => {
    return ( 
        <SidebarProvider>
            <DashboardSidebar />
            <main className="flex flex-col h-screen w-screen bg-background overflow-hidden relative">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-emerald-500/5 pointer-events-none" />
                <DashboardNavbar/> 
                <div className="flex-1 overflow-y-auto relative z-10">
                    {children}
                </div>
            </main>
        </SidebarProvider>
     );
}
 
export default Layout;