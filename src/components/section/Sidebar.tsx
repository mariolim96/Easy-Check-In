/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Building2, Home, Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
// Import the typed routes
import { Home as HomeRoute, Properties, Bookings, Guests } from "@/routes";
import type { RouteBuilder } from "@/routes/makeRoute";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  links?: {
    label: string;
    route: RouteBuilder<any, any>; // Use RouteBuilder type instead of raw href
    icon: React.JSX.Element | React.ReactNode;
  }[];
}

interface Links {
  label: string;
  route: RouteBuilder<any, any>; // Use RouteBuilder type instead of raw href
  icon: React.JSX.Element | React.ReactNode;
}

export const SidebarLink = ({
  link,
  open,
  className,
}: {
  link: Links;
  open: boolean;
  className?: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === link.route();

  return (
    <link.route.Link
      className={cn(
        "group flex items-center rounded-md px-[0.8rem] py-3 text-sm font-medium transition-all",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
        className,
      )}
    >
      <span className="min-w-[24px]">{link.icon}</span>
      <motion.span
        animate={{
          width: open ? "auto" : 0,
          opacity: open ? 1 : 0,
        }}
        className="ml-3 overflow-hidden whitespace-pre"
      >
        {link.label}
      </motion.span>
    </link.route.Link>
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
        "hidden h-full w-[220px] flex-shrink-0 bg-neutral-100 px-4 py-4 dark:bg-neutral-800 md:flex md:flex-col",
        className,
      )}
      animate={{
        width: open ? "220px" : "60px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default function Sidebar({ links }: SidebarProps) {
  const currentLinks = links ?? [
    {
      label: "Overview",
      route: HomeRoute,
      icon: <Home className="size-5" />,
    },
    {
      label: "Properties",
      route: Properties,
      icon: <Building2 className="size-5" />,
    },
    {
      label: "Bookings",
      route: Bookings,
      icon: <Calendar className="size-5" />,
    },
    {
      label: "Guests",
      route: Guests,
      icon: <Users className="size-5" />,
    },
  ];
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="hidden w-[220px] flex-col border-r bg-card md:flex"
      initial={{ width: 0 }}
      exit={{ width: 0 }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      animate={{
        width: open ? "220px" : "60px",
      }}
    >
      <div className="pl-2">
        <Logo open={open} />
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto pl-1 pr-2">
        {currentLinks.map((link) => (
          <SidebarLink key={link.label} link={link} open={open} />
        ))}
      </nav>
    </motion.div>
  );
}

export const Logo = ({ open }: { open: boolean }) => {
  return (
    <HomeRoute.Link className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <Image
        src="/images/icona.png"
        alt="Logo"
        width={40}
        height={40}
        className="aspect-square h-10 w-10"
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
    </HomeRoute.Link>
  );
};
