import { getDashboardStats } from "@/app/actions/dashboard";
import { OperationCard } from "@/components/dashboard/operation-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, DollarSign, Package } from "lucide-react";

export default async function DashboardPage() {
  const { data: stats } = await getDashboardStats();

  if (!stats) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <Heading
          title="Dashboard"
          description="Overview of your inventory operations"
        />
      </div>
      <Separator />

      {/* Operations Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <OperationCard
          title="Receipts"
          stats={stats.receipts}
          href="/dashboard/operations/receipts"
          color="blue"
        />
        <OperationCard
          title="Deliveries"
          stats={stats.deliveries}
          href="/dashboard/operations/deliveries"
          color="green"
        />
        <OperationCard
          title="Internal Transfers"
          stats={stats.internal}
          href="/dashboard/operations/internal"
          color="purple"
        />
      </div>

      {/* Inventory Summary Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Inventory Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.totalValue.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated cost value of all stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Alerts
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockCount}</div>
            <p className="text-xs text-muted-foreground">
              Products below minimum stock level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              Active product variants
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
