import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";


interface Prps {
    children: React.ReactNode;
}
const Layout = ({ children }: Prps) => {
    return ( 
        <SidebarProvider>
            <DashboardSidebar />
            <main className="flex flex-col h-screen w-screen bg-muted">
                {children}
            </main>
        </SidebarProvider>
     );
}
 
export default Layout;