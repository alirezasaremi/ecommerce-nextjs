import { Nav, NavLink } from "@/components/Nav";
import { Metadata } from "next";

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
    title: "Admin Panel",
    description: "Admin Panel",
  };

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/admin">Dashboard</NavLink>
        <NavLink href="/admin/products">Products</NavLink>
        <NavLink href="/admin/users">Customers</NavLink>
        <NavLink href="/admin/orders">Sales</NavLink>
      </Nav>
      <div className="container my-6">{children}</div>
    </>
  );
}
