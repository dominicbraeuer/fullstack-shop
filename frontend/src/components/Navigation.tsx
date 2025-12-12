"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navigation.module.css";

export default function Navigation() {
  const pathname = usePathname();

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
    </nav>
  );
}
