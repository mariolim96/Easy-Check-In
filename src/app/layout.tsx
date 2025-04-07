import "@/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { R, RI } from "@/styles/Fonts";
import { DashboardLayout as Layout } from "@/components/templates/Layout";
import { Providers } from "@/components/providers/Providers";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    template: "%s | Easy Check-In",
    default: "Easy Check-In - Property Management Made Simple",
  },
  description:
    "Streamline your property management with Easy Check-In. Manage bookings, guests, and properties all in one place.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Easy Check-In - Property Management Made Simple",
    description:
      "Streamline your property management with Easy Check-In. Manage bookings, guests, and properties all in one place.",
    siteName: "Easy Check-In",
  },
  twitter: {
    card: "summary_large_image",
    title: "Easy Check-In - Property Management Made Simple",
    description:
      "Streamline your property management with Easy Check-In. Manage bookings, guests, and properties all in one place.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${R.variable} ${RI.variable} scroll-smooth font-raleway antialiased`}
      >
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
