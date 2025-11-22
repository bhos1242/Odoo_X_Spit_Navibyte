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
import { useQuery } from "@tanstack/react-query";
import { getContacts } from "@/app/actions/contact";

interface Contact {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  type: "CUSTOMER" | "VENDOR";
  address?: string | null;
}

interface ContactListProps {
  initialContacts: Contact[];
}

export function ContactList({ initialContacts }: ContactListProps) {
  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await getContacts();
      if (!res.success) throw new Error(res.error as string);
      return (res.data || []) as Contact[];
    },
    initialData: initialContacts,
  });

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No contacts found.
              </TableCell>
            </TableRow>
          ) : (
            contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell className="font-medium">{contact.name}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      contact.type === "VENDOR" ? "secondary" : "outline"
                    }
                  >
                    {contact.type}
                  </Badge>
                </TableCell>
                <TableCell>{contact.email || "-"}</TableCell>
                <TableCell>{contact.phone || "-"}</TableCell>
                <TableCell>{contact.address || "-"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
