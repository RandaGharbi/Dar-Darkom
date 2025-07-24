import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../context/ThemeContext";
import { QueryProvider } from "../providers/QueryProvider";
import StyledComponentsRegistry from "../lib/registry";
import { I18nProvider } from "../components/I18nProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Guerlain Admin Dashboard",
  description: "Administration dashboard for Guerlain e-commerce",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <I18nProvider>
            <ThemeProvider>
              <QueryProvider>
                {children}
              </QueryProvider>
            </ThemeProvider>
          </I18nProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
