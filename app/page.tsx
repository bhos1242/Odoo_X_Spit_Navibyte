import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Box,
  LayoutDashboard,
  ShieldCheck,
  Truck,
  Warehouse,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Box className="h-6 w-6" />
            <span>IMS</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-5xl flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              Modern Inventory Management for Growing Businesses
            </h1>
            <p className="max-w-2xl leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Streamline your operations with our comprehensive inventory
              solution. Manage products, warehouses, and stock moves with ease
              and precision.
            </p>
            <div className="space-x-4">
              <Link href="/dashboard">
                <Button size="lg" className="gap-2">
                  Go to Dashboard <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24 rounded-3xl">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl font-bold">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to manage your inventory efficiently.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card>
              <CardHeader>
                <Warehouse className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Multi-Warehouse</CardTitle>
                <CardDescription>
                  Manage multiple warehouses and locations with hierarchical
                  structures.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Box className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Track storable, consumable, and service products with detailed
                  attributes.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Truck className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Stock Operations</CardTitle>
                <CardDescription>
                  Handle receipts, deliveries, and internal transfers
                  seamlessly.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <LayoutDashboard className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Real-time Dashboard</CardTitle>
                <CardDescription>
                  Get instant insights into your stock levels and recent
                  movements.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <ShieldCheck className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Secure Access</CardTitle>
                <CardDescription>
                  Role-based access control to ensure data security and
                  integrity.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <ArrowRight className="h-10 w-10 mb-2 text-primary" />
                <CardTitle>Scalable</CardTitle>
                <CardDescription>
                  Built on modern tech stack (Next.js 16, Prisma) to grow with
                  you.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>

      <footer className="py-6 md:px-8 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by{" "}
            <span className="font-medium underline underline-offset-4">
              Odoo Spit Team
            </span>
            .
          </p>
        </div>
      </footer>
    </div>
  );
}
