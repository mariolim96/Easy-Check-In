export default function PropertyLoading() {
  return (
    <div className="animate-fade-in container mx-auto space-y-8 p-6">
      <div className="mb-6 flex items-center gap-4">
        <div className="h-8 w-8 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-32 animate-pulse rounded bg-muted" />
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-md border bg-background p-4"
          >
            <div className="mb-2 h-5 w-5 animate-pulse rounded-full bg-muted"></div>
            <div className="h-6 w-8 animate-pulse rounded bg-muted"></div>
            <div className="mt-1 h-4 w-20 animate-pulse rounded bg-muted"></div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="h-6 w-32 animate-pulse rounded bg-muted"></div>
          <div className="h-9 w-36 animate-pulse rounded bg-muted"></div>
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="overflow-hidden rounded-lg border p-4">
              <div className="mb-2 flex items-start justify-between">
                <div className="h-5 w-40 animate-pulse rounded bg-muted"></div>
                <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
              </div>

              <div className="mb-2 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((j) => (
                  <div
                    key={j}
                    className="h-5 animate-pulse rounded bg-muted"
                  ></div>
                ))}
              </div>

              <div className="h-4 w-24 animate-pulse rounded bg-muted"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
