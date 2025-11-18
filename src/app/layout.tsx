import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FakeStore CRUD",
  description: "Aplicação CRUD de Produtos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}