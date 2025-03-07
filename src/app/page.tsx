import Client, { Local } from "@/lib/client";
import React from "react";
const cli = new Client(Local);
export default async function Home() {
  const clis = await cli.api.list({});
  console.log(" clis:", clis);
  return (
    <div className="flex flex-1">
      <div className="flex h-full w-full flex-1 flex-col gap-2 rounded-tl-2xl border border-neutral-200 bg-white p-2 dark:border-neutral-700 dark:bg-neutral-900 md:p-10">
        <div className="flex gap-2">
          {[1, 3, 2, 4].map((i) => (
            <div
              key={i}
              className="h-20 w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
        <div className="flex flex-1 gap-2">
          {[5, 6].map((i) => (
            <div
              key={i}
              className="h-full w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800"
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
