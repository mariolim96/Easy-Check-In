/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Building2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
// Import the typed routes
import { Home as HomeRoute, Properties } from "@/routes";
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
  return (
    // Use the typed Link component from the route
    <link.route.Link className={cn("", className)}>
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

export default function Sidebar({ links }: SidebarProps) {
  const currentLinks = links ?? [
    {
      label: "Overview",
      route: HomeRoute,
      icon: <Home className="mr-2 !size-6" />,
    },
    {
      label: "Properties",
      route: Properties,
      icon: <Building2 className="mr-2 !size-6" />,
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
      <div className="pl-2">
        <Logo open={open} />
      </div>
      <nav className="flex-1 px-4 py-2">
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
