import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Properties } from "@/routes";

export default function PropertyNotFound() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Property Not Found</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <p className="text-center text-muted-foreground">
          The property you are looking for does not exist or has been removed.
        </p>
        <Properties.Link>
          <Button variant="outline">Back to Properties</Button>
        </Properties.Link>
      </CardContent>
    </Card>
  );
}
