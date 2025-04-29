import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Calendar, Users, HeadphonesIcon } from "lucide-react"; // Import Lucide icons

export function NoApartments() {
  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-12">
      <div className="relative h-64 w-64">
        <Image
          src="/images/empty-house.svg"
          alt="No apartments available"
          fill
          className="object-contain"
          priority
        />
      </div>

      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          No Apartments Available
        </h3>
        <p className="text-md mx-auto max-w-md text-gray-500 dark:text-gray-400">
          We couldn't find any apartments matching your criteria. Try adjusting
          your dates or guest count.
        </p>
      </div>

      <div className="mt-8 grid w-full max-w-2xl grid-cols-1 gap-6 md:grid-cols-3">
        <div className="flex flex-col items-center rounded-lg bg-gray-50 p-6 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
          <Calendar className="mb-3 h-8 w-8 text-primary" strokeWidth={1.5} />
          <h4 className="font-medium">Adjust Dates</h4>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Try different check-in/out dates
          </p>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-gray-50 p-6 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
          <Users className="mb-3 h-8 w-8 text-primary" strokeWidth={1.5} />
          <h4 className="font-medium">Guest Count</h4>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Modify number of guests
          </p>
        </div>

        <div className="flex flex-col items-center rounded-lg bg-gray-50 p-6 transition-colors hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700">
          <HeadphonesIcon
            className="mb-3 h-8 w-8 text-primary"
            strokeWidth={1.5}
          />
          <h4 className="font-medium">Need Help?</h4>
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            Contact our support team
          </p>
        </div>
      </div>
    </div>
  );
}
