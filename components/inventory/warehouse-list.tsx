"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Box } from "lucide-react";

interface Warehouse {
  id: string;
  name: string;
  address: string | null;
  locations: any[];
}

export function WarehouseList({ warehouses }: { warehouses: Warehouse[] }) {
  if (warehouses.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/10">
        <p className="text-muted-foreground">
          No warehouses found. Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {warehouses.map((warehouse) => (
        <Card key={warehouse.id}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-lg">
              <span className="flex items-center gap-2">
                <Box className="h-5 w-5 text-primary" />
                {warehouse.name}
              </span>
            </CardTitle>
            <CardDescription className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {warehouse.address || "No address provided"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Locations</span>
              <Badge variant="secondary">{warehouse.locations.length}</Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
