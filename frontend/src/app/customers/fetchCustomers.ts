export async function fetchCustomers() {
  // Server-side: use internal Docker network URL
  // Client-side: use public URL
  const apiUrl =
    typeof window === "undefined"
      ? process.env.API_URL || "http://backend:3001"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const response = await fetch(`${apiUrl}/customers`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  const customers = await response.json();
  return customers;
}
