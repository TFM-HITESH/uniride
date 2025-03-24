import { GoGraph } from "react-icons/go";
import { HiUserGroup } from "react-icons/hi";
import { FaTaxi } from "react-icons/fa";
import { MdHome } from "react-icons/md";
import { IoMdSettings } from "react-icons/io";
import { IoIosNotifications } from "react-icons/io";
import { FaCarSide } from "react-icons/fa";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import SidebarFooterComponent from "./sidebar-footer";

// Menu items.
const general_items = [
  {
    title: "Home",
    url: "/admin",
    icon: MdHome,
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: GoGraph,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: IoMdSettings,
  },
];

const admin_items = [
  {
    title: "Notifications",
    url: "/admin/notifications",
    icon: IoIosNotifications,
  },
  {
    title: "Users Management",
    url: "/admin/users",
    icon: HiUserGroup,
  },
  {
    title: "Rides Management",
    url: "/admin/rides",
    icon: FaCarSide,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row items-center justify-center gap-4 mt-8 mb-3">
          <FaTaxi className="text-4xl" />
          <Link className="text-4xl" href="/">
            UniRide
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {general_items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Administrative</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {admin_items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarFooterComponent name="Hitesh Shivkumar" />
      </SidebarFooter>
    </Sidebar>
  );
}
