import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Client, { Local } from "./encore-client";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Encore = new Client(
  Local,
  // {
  //   requestInit: {
  //     credentials: "include", // This enables sending cookies
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   },
  // }
);

export { Encore, cn };
