import { Toaster } from "react-hot-toast";
import { FormProvider } from "@/context/FormContext";
import "./globals.css";

export const metadata = {
  title: "IT Blueprint Form - Consltek",
  description: "IT Infrastructure Planning and Blueprint Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <FormProvider>
          {children}
          <Toaster position="top-right" />
        </FormProvider>
      </body>
    </html>
  );
}
