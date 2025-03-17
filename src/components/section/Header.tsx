"use client";

import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut, useSession } from "@/lib/auth-client";
import { AuthSignIn, AuthSignUp, DashboardAdmin, Home } from "@/routes";
import Logo from "../custom/logo";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  console.log("header session:", session);
  return (
    <div className="sticky top-0 z-50 bg-white/75 shadow backdrop-blur">
      <div className="container mx-auto flex h-12 items-center justify-between">
        <Home.Link>
          <Logo className="h-full w-auto py-3" />
        </Home.Link>
        <div className="flex items-center space-x-3">
          {session ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Avatar>
                    <AvatarImage src="/images/77627641.jpg" alt="@shadcn" />
                    <AvatarFallback>Its-Satyajit</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <DashboardAdmin.Link>DashBoard</DashboardAdmin.Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      signOut({
                        fetchOptions: {
                          onSuccess: () => router.push(Home()),
                        },
                      })
                    }
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <AuthSignIn.Link>
                <Button variant={"destructive"}>Sign In</Button>
              </AuthSignIn.Link>
              <AuthSignUp.Link>
                <Button variant={"default"}>Sign Up</Button>
              </AuthSignUp.Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// "use client";

// import { Bell } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// export default function Header() {
//   return (
//     <header className="flex h-16 items-center border-b bg-card px-4 md:px-6">
//       <div className="flex flex-1 items-center gap-4 md:ml-auto">
//         <Button variant="outline" size="icon" className="relative">
//           <Bell className="h-4 w-4" />
//           <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-primary"></span>
//           <span className="sr-only">Notifications</span>
//         </Button>
//         <Avatar className="md:hidden">
//           <AvatarImage src="/placeholder.svg?height=32&width=32" />
//           <AvatarFallback>JD</AvatarFallback>
//         </Avatar>
//       </div>
//     </header>
//   );
// }
