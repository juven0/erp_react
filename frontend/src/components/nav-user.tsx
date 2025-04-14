import { LogOut, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"


export function NavUser({
  user,
}: {
  user: {
    username: string
    // avatar: string
  }
}) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Card className="w-full border-none shadow-none bg-transparent">
          <CardContent className="p-4">
            <div className="flex flex-row justify-center items-center gap-3">
              <div className="relative">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage src={''} alt={user.username} />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    {user.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 rounded-full bg-white dark:bg-gray-800 p-1">
                  <User className="h-3 w-3 text-primary" />
                </div>
              </div>
              
              <div className="text-center">
                <p className="font-medium text-foreground">{user.username}</p>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="px-4 pb-4 pt-0">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full gap-2" 
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </CardFooter>
        </Card>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}