import Link from "next/link";
import { fetchProducts } from "./fetchProducts";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
}

export default async function ProductsPage() {
  const products = await fetchProducts();

  return (
    <>
      <div className={`page shadows`}>
        <div className={`page_header`}>
          <h1>All Products</h1>
          <Link href="/products/create">+ new product</Link>
        </div>
        {products.map((product: Product) => (
          <div key={product.id} className={`card shadow-m`}>
            <h2>
              {product.id} | {product.name}
            </h2>
            <p>{product.description}</p>
            <p>Price: {product.price} €</p>
          </div>
        ))}
      </div>
    </>
  );
}
