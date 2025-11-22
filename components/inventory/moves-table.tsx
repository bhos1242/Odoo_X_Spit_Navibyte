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

interface StockMove {
  id: string;
  createdAt: Date;
  product: {
    name: string;
    sku: string;
  };
  sourceLocation?: {
    name: string;
  } | null;
  destinationLocation?: {
    name: string;
  } | null;
  quantity: number;
  status: string;
  transfer?: {
    reference: string;
  } | null;
}

interface MovesTableProps {
  moves: StockMove[];
}

export function MovesTable({ moves }: MovesTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>From</TableHead>
            <TableHead>To</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {moves.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No stock moves found.
              </TableCell>
            </TableRow>
          ) : (
            moves.map((move) => (
              <TableRow key={move.id}>
                <TableCell>
                  {format(new Date(move.createdAt), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell className="font-medium">
                  {move.transfer?.reference || "-"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{move.product.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {move.product.sku}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{move.sourceLocation?.name || "-"}</TableCell>
                <TableCell>{move.destinationLocation?.name || "-"}</TableCell>
                <TableCell className="text-right">{move.quantity}</TableCell>
                <TableCell>
                  <Badge variant="outline">{move.status}</Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
