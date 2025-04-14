import * as React from "react"
import {
  Bot,
  GalleryVerticalEnd,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useUser } from "@/context/UserContext"

const data = {
  teams: [
    {
      name: "Tymo",
      logo: GalleryVerticalEnd,
      plan: "ERP",
    }
  ],
  navMain: [
    {
      title: "Employer",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: "Utilisateur",
      url: "#",
      icon: Bot,
     
    },
 
  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {user} = useUser()
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
