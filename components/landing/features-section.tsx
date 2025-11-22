import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Box,
  ShieldCheck,
  Truck,
  Warehouse,
  BarChart3,
  Globe,
} from "lucide-react";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="container mx-auto px-4 md:px-6 py-24 space-y-16"
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <FeatureCard
          icon={Warehouse}
          title="Multi-Warehouse Management"
          description="Manage multiple warehouses and locations with hierarchical structures. Track stock across different physical locations effortlessly."
          color="text-blue-500"
          bg="bg-blue-500/10"
        />
        <FeatureCard
          icon={Box}
          title="Smart Product Tracking"
          description="Track storable, consumable, and service products. Manage variants, serial numbers, and batches with detailed attributes."
          color="text-green-500"
          bg="bg-green-500/10"
        />
        <FeatureCard
          icon={Truck}
          title="Automated Operations"
          description="Streamline receipts, deliveries, and internal transfers. Automate replenishment rules to never run out of stock."
          color="text-orange-500"
          bg="bg-orange-500/10"
        />
        <FeatureCard
          icon={BarChart3}
          title="Real-time Analytics"
          description="Get instant insights into stock levels, valuation, and turnover rates. Make data-driven decisions with customizable reports."
          color="text-purple-500"
          bg="bg-purple-500/10"
        />
        <FeatureCard
          icon={ShieldCheck}
          title="Enterprise Security"
          description="Role-based access control (RBAC) ensures your data is secure. Audit logs track every movement and change in the system."
          color="text-red-500"
          bg="bg-red-500/10"
        />
        <FeatureCard
          icon={Globe}
          title="Global Scalability"
          description="Built to scale with your business. Support for multiple currencies, languages, and tax rules for international operations."
          color="text-cyan-500"
          bg="bg-cyan-500/10"
        />
      </div>
    </section>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  color,
  bg,
}: {
  icon: any;
  title: string;
  description: string;
  color: string;
  bg: string;
}) {
  return (
    <Card className="group relative overflow-hidden border-muted bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/20">
      <CardHeader>
        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${bg} ${color} transition-transform group-hover:scale-110`}>
          <Icon className="h-6 w-6" />
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base leading-relaxed text-muted-foreground/80">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
