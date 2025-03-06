"use client";
import {
  Building2,
  Home,
  Users,
  Wrench,
  BarChart3,
  FileText,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link, { LinkProps } from "next/link";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  links?: {
    label: string;
    href: string;
    icon: React.JSX.Element | React.ReactNode;
  }[];
}

// import { Menu, X } from "lucide-react";

interface Links {
  label: string;
  href: string;
  icon: React.JSX.Element | React.ReactNode;
}

export const SidebarLink = ({
  link,
  open,
  className,
  ...props
}: {
  link: Links;
  open: boolean;
  className?: string;
  props?: LinkProps;
}) => {
  return (
    <Link href={link.href} className={cn("", className)} {...props}>
      <Button
        variant="ghost"
        className="group/sidebar m-0 flex w-full items-center justify-start gap-2 p-0 py-2"
        // onClick={() => setActiveTab(link.label)}
      >
        {link.icon}
        <motion.span
          animate={{
            display: open ? "inline-block" : "none",
            opacity: open ? 1 : 0,
          }}
          className="text-md !m-0 inline-block whitespace-pre !p-0 text-neutral-700 transition duration-150 dark:text-neutral-200"
        >
          {link.label}
        </motion.span>
      </Button>
    </Link>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className={cn(
        "hidden h-full w-[300px] flex-shrink-0 bg-neutral-100 px-4 py-4 dark:bg-neutral-800 md:flex md:flex-col",
        className,
      )}
      animate={{
        width: open ? "300px" : "60px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default function Sidebar({
  activeTab,
  setActiveTab,
  links,
}: SidebarProps) {
  const currentLinks = links ?? [
    {
      label: "Overview",
      href: "/",
      icon: <Home className="mr-2 !size-6" />,
    },
    {
      label: "Properties",
      href: "/properties",
      icon: <Building2 className="mr-2 !size-6" />,
    },
    {
      label: "Tenants",
      href: "/tenants",
      icon: <Users className="mr-2 !size-6" />,
    },
    {
      label: "Maintenance",
      href: "/maintenance",
      icon: <Wrench className="mr-2 !size-6" />,
    },
    {
      label: "Finances",
      href: "/finances",
      icon: <BarChart3 className="mr-2 !size-6" />,
    },
    {
      label: "Documents",
      href: "/documents",
      icon: <FileText className="mr-2 !size-6" />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <Settings className="mr-2 !size-6" />,
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      className="hidden w-[300px] flex-col border-r bg-card md:flex"
      initial={{ width: 0 }}
      exit={{ width: 0 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      animate={{
        width: open ? "300px" : "60px",
      }}
    >
      <div className="pl-2">{<Logo open={open} />}</div>
      <nav className="flex-1 px-4 py-2">
        {currentLinks.map((link) => (
          <SidebarLink key={link.label} link={link} open={open} />
        ))}
      </nav>
      {/* <div className="border-t p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="truncate text-xs text-muted-foreground">
              john@example.com
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div> */}
    </motion.div>
  );
}

export const Logo = ({ open }: { open: boolean }) => {
  return (
    <Link
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <img
        className="aspect-square h-10 w-10"
        alt="@shadcn"
        src="\images\icona.png"
      />
      <motion.span
        initial={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        animate={{ opacity: open ? 1 : 0 }}
        style={{ display: open ? "inline-block" : "none" }}
        className="whitespace-pre font-medium text-black dark:text-white"
      >
        EasyCheckIn
      </motion.span>
    </Link>
  );
};
