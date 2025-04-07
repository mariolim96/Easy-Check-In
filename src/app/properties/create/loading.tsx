export default function Loading() {
  return <CreatePropertySkeleton />;
}

export function CreatePropertySkeleton() {
  return (
    <div className="mx-auto max-w-2xl animate-pulse">
      <div className="mb-8 h-10 w-32 rounded bg-muted"></div>
      <div className="rounded-lg border p-6">
        <div className="mb-6 h-8 w-48 rounded bg-muted"></div>
        <div className="space-y-4">
          <div className="h-10 rounded bg-muted"></div>
          <div className="h-10 rounded bg-muted"></div>
          <div className="h-10 rounded bg-muted"></div>
        </div>
      </div>
    </div>
  );
}
