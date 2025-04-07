"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PropertiesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle className="text-destructive">Something went wrong</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          {error.message || "An error occurred while loading properties."}
        </p>
      </CardContent>
      <CardFooter>
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
      </CardFooter>
    </Card>
  );
}
