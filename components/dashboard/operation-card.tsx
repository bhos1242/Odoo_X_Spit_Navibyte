import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface OperationStats {
  toProcess: number;
  late: number;
  waiting: number;
}

interface OperationCardProps {
  title: string;
  stats: OperationStats;
  href: string;
  color?: "blue" | "green" | "purple" | "orange";
}

export function OperationCard({
  title,
  stats,
  href,
  color = "blue",
}: OperationCardProps) {
  const colorStyles = {
    blue: "bg-blue-600 hover:bg-blue-700",
    green: "bg-green-600 hover:bg-green-700",
    purple: "bg-purple-600 hover:bg-purple-700",
    orange: "bg-orange-600 hover:bg-orange-700",
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-primary">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-start justify-between">
          <Link href={`${href}?status=ready` as any}>
            <Button
              className={cn(
                "h-auto flex-col items-start px-4 py-2 text-white",
                colorStyles[color]
              )}
            >
              <span className="text-3xl font-bold">{stats.toProcess}</span>
              <span className="text-xs font-medium uppercase opacity-90">
                To Process
              </span>
            </Button>
          </Link>

          <div className="flex flex-col gap-2 text-sm">
            <Link
              href={`${href}?status=late` as any}
              className="flex items-center justify-between gap-4 rounded-md px-2 py-1 hover:bg-muted transition-colors"
            >
              <span className="text-orange-600 font-medium">
                {stats.late} Late
              </span>
            </Link>
            <Link
              href={`${href}?status=waiting` as any}
              className="flex items-center justify-between gap-4 rounded-md px-2 py-1 hover:bg-muted transition-colors"
            >
              <span className="text-muted-foreground">
                {stats.waiting} Waiting
              </span>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
