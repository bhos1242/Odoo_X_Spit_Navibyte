"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createLocation,
  updateLocation,
  getWarehouses,
  getLocations,
} from "@/app/actions/warehouse";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const locationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  shortCode: z
    .string()
    .min(2, "Short code is required")
    .max(20, "Short code too long"),
  type: z.enum([
    "VIEW",
    "INTERNAL",
    "CUSTOMER",
    "VENDOR",
    "INVENTORY_LOSS",
    "PRODUCTION",
    "TRANSIT",
  ]),
  warehouseId: z.string().optional(),
  parentId: z.string().optional(),
});

interface LocationDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  locationToEdit?: {
    id: string;
    name: string;
    shortCode: string;
    type: string;
    warehouseId?: string | null;
    parentId?: string | null;
  } | null;
}

export function LocationDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  locationToEdit,
}: LocationDialogProps = {}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);

  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      shortCode: "",
      type: "INTERNAL",
    },
  });

  useEffect(() => {
    if (isOpen) {
      getWarehouses().then((res) => {
        if (res.success) setWarehouses(res.data || []);
      });
      getLocations().then((res) => {
        if (res.success) setLocations(res.data || []);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (locationToEdit) {
      form.reset({
        name: locationToEdit.name,
        shortCode: locationToEdit.shortCode,
        type: locationToEdit.type as any,
        warehouseId: locationToEdit.warehouseId || "none",
        parentId: locationToEdit.parentId || "none",
      });
    } else {
      form.reset({
        name: "",
        shortCode: "",
        type: "INTERNAL",
        warehouseId: "none",
        parentId: "none",
      });
    }
  }, [locationToEdit, form, isOpen]);

  async function onSubmit(values: z.infer<typeof locationSchema>) {
    let result;
    if (locationToEdit) {
      result = await updateLocation(locationToEdit.id, values);
    } else {
      result = await createLocation(values);
    }

    if (result.success) {
      setOpen(false);
      form.reset();
      toast.success(locationToEdit ? "Location updated" : "Location created");
    } else {
      toast.error(
        locationToEdit
          ? "Failed to update location"
          : "Failed to create location"
      );
      console.error(result.error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {controlledOpen === undefined && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Location
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {locationToEdit ? "Edit Location" : "Create Location"}
          </DialogTitle>
          <DialogDescription>
            {locationToEdit
              ? "Update location details."
              : "Add a new location to your inventory."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Shelf 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Code</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. WH/STOCK/S1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="VIEW">View</SelectItem>
                      <SelectItem value="INTERNAL">Internal</SelectItem>
                      <SelectItem value="CUSTOMER">Customer</SelectItem>
                      <SelectItem value="VENDOR">Vendor</SelectItem>
                      <SelectItem value="INVENTORY_LOSS">
                        Inventory Loss
                      </SelectItem>
                      <SelectItem value="PRODUCTION">Production</SelectItem>
                      <SelectItem value="TRANSIT">Transit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="warehouseId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Warehouse</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a warehouse" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {warehouses.map((wh) => (
                        <SelectItem key={wh.id} value={wh.id}>
                          {wh.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="parentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Location</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a parent location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name} ({loc.shortCode})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">
                {locationToEdit ? "Update Location" : "Create Location"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
