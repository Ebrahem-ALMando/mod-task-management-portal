import "./globals.css";
import { metadata } from "./metadata";
import AppShell from "@/components/layout/AppShell";
import ManifestLink from "@/components/layout/ManifestLink";
import StatusBar from "@/components/status/StatusBar";
import { ThemeProvider } from "@/components/theme-provider";

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
        <ManifestLink />
        <AppShell />
          <StatusBar />
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
