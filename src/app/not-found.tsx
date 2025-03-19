import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-4xl font-bold">404</h1>
      <h2 className="mb-4 text-xl">Page Not Found</h2>
      <p className="mb-8 text-gray-600">
        The page you are looking for does not exist.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Return Home
      </Link>
    </div>
  );
}
