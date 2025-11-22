import { getProducts } from "@/app/actions/product";
import { ProductsView } from "@/components/inventory/products-view";

export default async function InventoryPage() {
  const result = await getProducts();

  if (!result.success || !result.data) {
    return <div>Failed to load products</div>;
  }

  // Serialize Decimal to number for client component
  const products = result.data.map((product) => ({
    ...product,
    salesPrice: Number(product.salesPrice),
    costPrice: Number(product.costPrice),
    minStock: Number(product.minStock),
    maxStock: product.maxStock ? Number(product.maxStock) : undefined,
  }));

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ProductsView initialProducts={products} />
    </div>
  );
}
