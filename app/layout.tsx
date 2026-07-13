import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Energia do Corpo | Academia em Canoas",
  description:
    "Musculação e cardio no bairro Olaria, em Canoas. Conheça os planos da Energia do Corpo.",
  icons: {
    icon: "/logo-energia-do-corpo.png",
    shortcut: "/logo-energia-do-corpo.png",
    apple: "/logo-energia-do-corpo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
