import Link from "next/link";
import { fetchCustomers } from "./fetchCustomers";

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export default async function CustomersPage() {
  let customers: Customer[] | null = null;
  let error: Error | null = null;

  try {
    customers = await fetchCustomers();
  } catch (e) {
    error = e as Error;
  }

  if (error) {
    return (
      <>
        <div className={`page shadows`}>
          <div className={`page_header`}>
            <h1>All Customers</h1>
          </div>
          <p>
            Please <Link href="/login">log in</Link> or{" "}
            <Link href="/customers/create">register</Link> to view your data.
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={`page shadows`}>
        <div className={`page_header`}>
          <h1>All Customers</h1>
          <Link href="/customers/create">+ new customer</Link>
        </div>
        {customers?.map((customer: Customer) => (
          <div className={`card shadow-m`} key={customer.id}>
            <h2>{customer.name}</h2>
            <p>{customer.email}</p>
          </div>
        ))}
      </div>
    </>
  );
}
