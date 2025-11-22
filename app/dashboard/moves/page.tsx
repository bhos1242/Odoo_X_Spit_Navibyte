import { getStockMoves } from "@/app/actions/stock";
import { MovesTable } from "@/components/inventory/moves-table";

export default async function StockMovesPage() {
  const { data: moves } = await getStockMoves();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Stock Moves History
        </h1>
        <p className="text-muted-foreground">
          View the history of all product movements across your warehouses.
        </p>
      </div>

      <MovesTable moves={moves || []} />
    </div>
  );
}
