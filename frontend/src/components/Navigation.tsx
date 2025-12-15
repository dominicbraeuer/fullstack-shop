"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const response = await fetch(`${apiUrl}/customers`, {
          credentials: "include",
        });
        setIsLoggedIn(response.ok);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      await fetch(`${apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    }

    setIsLoggedIn(false);
    router.push("/");
    router.refresh();
  };

  return (
    <nav className={`${styles.navigation} shadow-s`}>
      <Link href="/" className={pathname === "/" ? styles.active : ""}>
        Home
      </Link>
      <Link
        href="/products"
        className={pathname === "/products" ? styles.active : ""}
      >
        Products
      </Link>
      <Link
        href="/customers"
        className={pathname === "/customers" ? styles.active : ""}
      >
        Customers
      </Link>
      <Link
        href="/orders"
        className={pathname === "/orders" ? styles.active : ""}
      >
        Orders
      </Link>

      {isLoggedIn ? (
        <a
          className={`${styles.login_button}`}
          onClick={handleLogout}
          style={{ cursor: "pointer" }}
        >
          Logout
        </a>
      ) : (
        <Link
          href="/login"
          className={`${pathname === "/login" ? styles.active : ""} ${
            styles.login_button
          }`}
        >
          Login
        </Link>
      )}
    </nav>
  );
}
