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
      <h1>All Products</h1>
      <Link href="/products/create">+ new product</Link>
      <ul>
        {products.map((product: Product) => (
          <li key={product.id}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: {product.price} €</p>
          </li>
        ))}
      </ul>
    </>
  );
}
