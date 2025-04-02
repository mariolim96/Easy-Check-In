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
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "../ui/theme-switcher";
import { ChevronDown } from "lucide-react";

export default function Header() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 z-50 backdrop-blur">
      <div className="container ml-auto mr-6 flex h-14 max-w-screen-2xl items-center justify-end">
        <div className="flex items-center gap-2">
          <ThemeSwitcher />

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative">
                  <Avatar className="h-8 w-8 rounded-full">
                    <AvatarImage src="/images/77627641.jpg" alt="@shadcn" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    size={16}
                    strokeWidth={2}
                    className="ms-2 opacity-60"
                    aria-hidden="true"
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <DashboardAdmin.Link>Dashboard</DashboardAdmin.Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    signOut({
                      fetchOptions: {
                        onSuccess: () => {
                          document.cookie.split(";").forEach((c) => {
                            document.cookie = c
                              .replace(/^ +/, "")
                              .replace(
                                /=.*/,
                                "=;expires=" +
                                  new Date().toUTCString() +
                                  ";path=/",
                              );
                          });
                          router.push(Home());
                        },
                      },
                    })
                  }
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <AuthSignIn.Link>
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </AuthSignIn.Link>
              <AuthSignUp.Link>
                <Button size="sm">Sign up</Button>
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
