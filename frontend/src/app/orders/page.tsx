import Link from "next/link";
import { fetchOrders } from "./fetchOrders";

export interface Order {
  id: number;
  productIds: number[];
  totalPrice: number;
  customerId: number;
}

export default async function OrdersPage() {
  let orders: Order[] | null = null;
  let error: Error | null = null;

  try {
    orders = await fetchOrders();
  } catch (e) {
    error = e as Error;
  }

  if (error) {
    return (
      <>
        <div className={`page shadows`}>
          <div className={`page_header`}>
            <h1>All Orders</h1>
          </div>
          <p>
            Please <Link href="/login">log in</Link> to view your orders.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`page shadows`}>
        <div className={`page_header`}>
          <h1>All Orders</h1>
          <Link href="/orders/create">+ new order</Link>
        </div>
        {orders?.map((order: Order) => (
          <div key={order.id} className={`card shadow-m`}>
            <h2>Order #{order.id}</h2>
            <p>Products: {order.productIds.join(", ")}</p>
            <p>Total: {order.totalPrice} €</p>
          </div>
        ))}
      </div>
    </>
  );
}
