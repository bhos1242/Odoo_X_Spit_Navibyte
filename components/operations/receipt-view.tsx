"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { ArrowLeft, Download, Printer, Package2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ReceiptViewProps {
  transfer: any;
}

export function ReceiptView({ transfer }: ReceiptViewProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      setIsDownloading(true);
      const element = receiptRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`${transfer.reference}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const getTitle = (type: string) => {
    switch (type) {
      case "INCOMING":
        return "Receipt";
      case "OUTGOING":
        return "Delivery Order";
      case "INTERNAL":
        return "Internal Transfer";
      case "ADJUSTMENT":
        return "Inventory Adjustment";
      default:
        return "Transfer";
    }
  };

  const getBackLink = (type: string) => {
    switch (type) {
      case "INCOMING":
        return "/dashboard/operations/receipts" as const;
      case "OUTGOING":
        return "/dashboard/operations/deliveries" as const;
      case "INTERNAL":
        return "/dashboard/operations/internal" as const;
      case "ADJUSTMENT":
        return "/dashboard/operations/adjustments" as const;
      default:
        return "/dashboard/operations/receipts" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={getBackLink(transfer.type) as any}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            {transfer.reference}
          </h1>
          <Badge variant={transfer.status === "DONE" ? "default" : "secondary"}>
            {transfer.status}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
          >
            <Download className="mr-2 h-4 w-4" />
            {isDownloading ? "Generating..." : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Transfer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference:</span>
              <span className="font-medium">{transfer.reference}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scheduled Date:</span>
              <span className="font-medium">
                {transfer.scheduledDate
                  ? format(new Date(transfer.scheduledDate), "PPP")
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Source:</span>
              <span className="font-medium">
                {transfer.sourceLocation?.name || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Destination:</span>
              <span className="font-medium">
                {transfer.destinationLocation?.name || "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium">
                {transfer.contact?.name || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">
                {transfer.contact?.email || "-"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="font-medium">
                {transfer.contact?.phone || "-"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Printable Receipt Area */}
      <div className="hidden">
        {/* This is a hidden duplicate for PDF generation if we wanted a specific print layout, 
            but for now we will capture the visible card below or a specific container. 
            Actually, let's just capture the visible content or a dedicated print view.
            I'll wrap the content below in a ref to capture it.
        */}
      </div>

      <Card ref={receiptRef} className="bg-white text-black p-8">
        <div className="space-y-6">
          <div className="flex justify-between items-start border-b pb-6">
            <div>
              <h2 className="text-2xl font-bold">{getTitle(transfer.type)}</h2>
              <p className="text-sm text-gray-500">{transfer.reference}</p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {transfer.status === "DONE" ? "Validated" : "Draft"}
              </p>
              <p className="text-sm text-gray-500">
                {transfer.scheduledDate
                  ? format(new Date(transfer.scheduledDate), "PPP")
                  : format(new Date(), "PPP")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold mb-2">From</h3>
              <p className="text-sm">
                {transfer.contact?.name || "Unknown Vendor"}
              </p>
              <p className="text-sm text-gray-500">
                {transfer.sourceLocation?.name}
              </p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold mb-2">To</h3>
              <p className="text-sm">My Company</p>
              <p className="text-sm text-gray-500">
                {transfer.destinationLocation?.name}
              </p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Quantity</TableHead>
                <TableHead className="text-right">Unit Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transfer.stockMoves.map((move: any) => (
                <TableRow key={move.id}>
                  <TableCell>{move.product.name}</TableCell>
                  <TableCell className="text-right">{move.quantity}</TableCell>
                  <TableCell className="text-right">
                    ${move.product.costPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ${(move.quantity * move.product.costPrice).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="border-t pt-4 text-right">
            <div className="inline-block text-left min-w-[200px]">
              <div className="flex justify-between font-bold text-lg">
                <span>Total Value:</span>
                <span>
                  ₹
                  {transfer.stockMoves
                    .reduce(
                      (acc: number, move: any) =>
                        acc + move.quantity * move.product.costPrice,
                      0
                    )
                    .toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
