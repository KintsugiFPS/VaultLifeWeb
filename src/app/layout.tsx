import type { Metadata } from "next";
import "@/globals.css";
import { VaultLifeProvider } from "@/context/VaultLifeContext";

export const metadata: Metadata = {
  title: "VaultLife - Smart Personal Finance",
  description: "Turn your finances into a gamified progression system",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='75' font-size='75'>💰</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-dark-bg text-white">
        <VaultLifeProvider>
          <div className="min-h-screen">
            {children}
          </div>
        </VaultLifeProvider>
      </body>
    </html>
  );
}
