"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface Location {
  id: string;
  name: string;
  shortCode: string;
  type: string;
  warehouse?: {
    name: string;
  };
  parent?: {
    name: string;
  };
  createdAt: Date;
}

interface LocationListProps {
  locations: Location[];
}

export function LocationList({ locations }: LocationListProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Short Code</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead>Parent Location</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-muted-foreground"
              >
                No locations found.
              </TableCell>
            </TableRow>
          ) : (
            locations.map((location) => (
              <TableRow key={location.id}>
                <TableCell className="font-medium">{location.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">{location.shortCode}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{location.type}</Badge>
                </TableCell>
                <TableCell>{location.warehouse?.name || "-"}</TableCell>
                <TableCell>{location.parent?.name || "-"}</TableCell>
                <TableCell>
                  {format(new Date(location.createdAt), "PPP")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
