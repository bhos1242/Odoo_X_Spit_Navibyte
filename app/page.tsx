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
  BarChart3,
  Users,
  Globe,
} from "lucide-react";

import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Box className="h-5 w-5" />
            </div>
            <span>IMS</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="#features"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#about"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
            {session && (
              <Link
                href="/dashboard"
                className="hover:text-foreground transition-colors font-semibold text-primary"
              >
                Dashboard
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="sm">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32 lg:py-40">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-size-[14px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>

          <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-8">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              v2.0 is now live
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl">
              Inventory Management <br className="hidden sm:inline" />
              <span className="text-primary">Reimagined</span> for Growth
            </h1>

            <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl leading-relaxed">
              Streamline your operations with our comprehensive inventory
              solution. Manage products, warehouses, and stock moves with ease
              and precision.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link href="/dashboard">
                <Button
                  size="lg"
                  className="w-full sm:w-auto gap-2 h-12 px-8 text-base"
                >
                  {session ? "Go to Dashboard" : "Get Started Now"}{" "}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-8 text-base"
                >
                  View Features
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-muted-foreground grayscale opacity-50">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5" /> Global Support
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" /> Enterprise Security
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" /> Multi-User
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32 space-y-12"
        >
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Everything you need to scale
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to help you maintain control over your
              inventory as your business grows.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={Warehouse}
              title="Multi-Warehouse"
              description="Manage multiple warehouses and locations with hierarchical structures for precise tracking."
            />
            <FeatureCard
              icon={Box}
              title="Product Management"
              description="Track storable, consumable, and service products with detailed attributes and variants."
            />
            <FeatureCard
              icon={Truck}
              title="Stock Operations"
              description="Handle receipts, deliveries, and internal transfers seamlessly with automated workflows."
            />
            <FeatureCard
              icon={LayoutDashboard}
              title="Real-time Dashboard"
              description="Get instant insights into your stock levels, recent movements, and critical alerts."
            />
            <FeatureCard
              icon={ShieldCheck}
              title="Secure Access"
              description="Role-based access control to ensure data security and integrity across your organization."
            />
            <FeatureCard
              icon={BarChart3}
              title="Advanced Reporting"
              description="Generate detailed reports on stock moves, valuation, and turnover to make informed decisions."
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t bg-muted/40">
          <div className="container mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-32">
            <div className="flex flex-col items-center text-center gap-6 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to optimize your inventory?
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of businesses that trust IMS to manage their
                stock efficiently. Start your free trial today.
              </p>
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base">
                  {session ? "Go to Dashboard" : "Start Your Free Trial"}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Box className="h-5 w-5" />
                </div>
                <span>IMS</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Modern inventory management for the modern business.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-sm tracking-wider uppercase">
                Product
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Changelog
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-sm tracking-wider uppercase">
                Company
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold text-sm tracking-wider uppercase">
                Legal
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground">
            <p>© 2025 IMS Inc. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="#" className="hover:text-foreground">
                Twitter
              </Link>
              <Link href="#" className="hover:text-foreground">
                GitHub
              </Link>
              <Link href="#" className="hover:text-foreground">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-muted bg-background transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
