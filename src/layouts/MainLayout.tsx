import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";

type MainLayoutProps = {
  children?: ReactNode;
};

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:block md:w-1/4 lg:w-1/5">
        <Sidebar />
      </div>
      <div className="w-full md:w-3/4 lg:w-4/5">
        <main>
          {children || <Outlet />}
        </main>
      </div>
      <MobileNav/>
    </div>
  );
}

export default MainLayout;
