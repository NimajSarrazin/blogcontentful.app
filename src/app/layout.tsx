import { Inter } from "next/font/google";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingScreen } from "@/components/animations/loading-screen";
import { PageTransition } from "@/components/animations/page-transition";
import { JsonLd } from "@/components/seo/json-ld";
import { defaultMetadata } from "@/lib/seo/metadata";
import {
  buildOrganizationJsonLd,
  buildWebsiteJsonLd,
} from "@/lib/seo/structured-data";
import { ThemeProvider } from "@/providers/theme-provider";
import "./globals.css";
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        <JsonLd data={[buildWebsiteJsonLd(), buildOrganizationJsonLd()]} />
        <ThemeProvider>
          <AppShell>
            <LoadingScreen />
            <Navbar />
            <PageTransition>
              <main id="main-content">{children}</main>
            </PageTransition>
            <Footer />
          </AppShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
