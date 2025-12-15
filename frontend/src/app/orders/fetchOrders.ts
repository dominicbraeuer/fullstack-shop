import { cookies } from "next/headers";

export async function fetchOrders() {
  // Server-side: use internal Docker network URL
  // Client-side: use public URL
  const apiUrl =
    typeof window === "undefined"
      ? process.env.API_URL || "http://backend:3001"
      : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  const cookieStore = await cookies();
  const token = cookieStore.get("access_token");

  const response = await fetch(`${apiUrl}/orders`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      ...(token && { Cookie: `access_token=${token.value}` }),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const orders = await response.json();
  return orders;
}
