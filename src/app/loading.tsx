import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <div className="container mx-auto p-6">
      {" "}
      <div className="mb-8 flex items-center justify-between">
        <Skeleton className="h-10 w-[150px]" />{" "}
        <Skeleton className="h-10 w-[180px]" />
      </div>{" "}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px]" />
        ))}{" "}
      </div>
    </div>
  );
}
