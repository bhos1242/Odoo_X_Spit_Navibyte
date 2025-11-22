import { getStockMoves } from "@/app/actions/stock";
import { MovesContainer } from "@/components/inventory/moves-container";

export default async function StockMovesPage({
  searchParams,
}: {
  searchParams: { query?: string };
}) {
  const query = searchParams?.query || "";
  const { data: moves } = await getStockMoves(query);

  return (
    <div className="space-y-6 p-8 pt-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Stock Moves History
        </h1>
        <p className="text-muted-foreground">
          View the history of all product movements across your warehouses.
        </p>
      </div>

      <MovesContainer moves={moves || []} />
    </div>
  );
}
