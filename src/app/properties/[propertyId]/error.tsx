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
import { Properties } from "@/routes";

export default function PropertyError({
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
          {error.message || "An error occurred while loading property details."}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Properties.Link>
          <Button variant="outline">Back to Properties</Button>
        </Properties.Link>
        <Button onClick={reset}>Try again</Button>
      </CardFooter>
    </Card>
  );
}
