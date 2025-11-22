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
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Check, Trash2 } from "lucide-react";
import { deleteTransfer, validateTransfer } from "@/app/actions/operation";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

interface Transfer {
  id: string;
  reference: string;
  type: string;
  status: string;
  contact?: { name: string };
  sourceLocation?: { name: string };
  destinationLocation?: { name: string };
  scheduledDate?: string;
  stockMoves: any[];
}

interface TransferListProps {
  transfers: Transfer[];
  type: "INCOMING" | "OUTGOING" | "INTERNAL" | "ADJUSTMENT";
}

export function TransferList({ transfers, type }: TransferListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [validatingId, setValidatingId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: deleteTransfer,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Transfer deleted");
        queryClient.invalidateQueries({ queryKey: ["transfers", type] });
      } else {
        toast.error("Failed to delete transfer");
      }
    },
  });

  const validateMutation = useMutation({
    mutationFn: validateTransfer,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Transfer validated");
        queryClient.invalidateQueries({ queryKey: ["transfers", type] });
      } else {
        toast.error(result.error as string);
      }
    },
  });

  const handleDelete = () => {
    if (deletingId) {
      deleteMutation.mutate(deletingId);
      setDeletingId(null);
    }
  };

  const handleValidate = () => {
    if (validatingId) {
      validateMutation.mutate(validatingId);
      setValidatingId(null);
    }
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reference</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transfers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No transfers found.
                </TableCell>
              </TableRow>
            ) : (
              transfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell className="font-medium">{transfer.reference}</TableCell>
                  <TableCell>{transfer.contact?.name || "-"}</TableCell>
                  <TableCell>{transfer.sourceLocation?.name || "-"}</TableCell>
                  <TableCell>{transfer.destinationLocation?.name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={transfer.status === "DONE" ? "default" : "secondary"}>
                      {transfer.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    {transfer.status === "DRAFT" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setValidatingId(transfer.id)}
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Validate
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-600"
                          onClick={() => setDeletingId(transfer.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Transfer?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!validatingId} onOpenChange={(open) => !open && setValidatingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Validate Transfer?</AlertDialogTitle>
            <AlertDialogDescription>
              This will update stock levels permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleValidate}>
              Validate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
