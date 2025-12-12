import Link from "next/link";
import { fetchCustomers } from "./fetchCustomers";

export interface Customer {
  id: number;
  name: string;
  email: string;
  password: number;
}

export default async function CustomersPage() {
  const customers = await fetchCustomers();

  return (
    <>
      <h1>All Customers</h1>
      <Link href="/customers/create">+ new customer</Link>
      <ul>
        {customers.map((customer: Customer) => (
          <li key={customer.id}>
            <h2>{customer.name}</h2>
            <p>{customer.email}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
