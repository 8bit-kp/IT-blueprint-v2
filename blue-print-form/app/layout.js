import { Toaster } from "react-hot-toast";
import { FormProvider } from "@/context/FormContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { getThemeInitScript } from "@/lib/theme";
import "./globals.css";

export const metadata = {
  title: "IT Blueprint Form - Consltek",
  description: "IT Infrastructure Planning and Blueprint Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* Sets data-theme on <html> synchronously, before React hydrates or
            anything paints — the standard fix for "flash of wrong theme" on
            load/refresh. Must run before any themed content below it, so it
            has to be the very first thing in <body>, as a plain blocking
            script (no async/defer). suppressHydrationWarning above is what
            makes mutating <html> here safe: React is told not to compare
            server- vs client-rendered attributes on that element. See
            lib/theme.js and docs/ui-redesign.md "Dark mode". */}
        <script dangerouslySetInnerHTML={{ __html: getThemeInitScript() }} />
        <ThemeProvider>
          <FormProvider>
            {children}
            <Toaster position="top-right" gutter={10} />
          </FormProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
