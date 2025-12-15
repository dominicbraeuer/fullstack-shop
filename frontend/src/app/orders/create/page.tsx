"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useEffect } from "react";
import { getApiUrl, getAuthHeaders } from "@/lib/api";
import { Product } from "@/app/products/page";

export default function CreateOrderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await fetch(`${getApiUrl()}/products`);
        const products = await response.json();
        setAvailableProducts(products);
      } catch {
        setError("Failed to load products");
      }
    }
    loadProducts();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const productIds = formData
      .getAll("productIds")
      .map((id) => parseInt(id as string, 10));

    // Calculate total price from selected products
    const totalPrice = productIds.reduce((sum, productId) => {
      const product = availableProducts.find((p) => p.id === productId);
      return sum + (product ? parseFloat(product.price.toString()) : 0);
    }, 0);

    const data = {
      productIds,
      totalPrice,
    };

    try {
      const response = await fetch(`${getApiUrl()}/orders`, {
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      router.refresh();
      router.push("/orders");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className={`page shadows`}>
        <div className={`page_header`}>
          <h1>Create New Order</h1>
        </div>
        <div className={`form_container`}>
          {error && (
            <div style={{ color: "red", marginBottom: "1rem" }}>{error}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="productSelect">Available Products:</label>
              <select
                id="productIds"
                name="productIds"
                multiple
                required
                className={`shadow-m`}
              >
                {availableProducts.map((product: Product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {product.price}€ (ID: {product.id})
                  </option>
                ))}
              </select>
              <small>Hold shift to select multiple products.</small>
            </div>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Order"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
