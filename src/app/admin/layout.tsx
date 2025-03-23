import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/app/admin/components/admin-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <div className="px-20 py-20">
          <div className="absolute top-[2%] right-[3%] md:top-[2%] md:right-[1%]">
            <ThemeToggle />
          </div>
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
