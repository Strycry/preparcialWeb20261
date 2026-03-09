import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { AutoresProvider } from "./AutoresProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "CRUD Autores",
  description: "Gestión de autores",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AutoresProvider>
          <nav className="bg-gray-800 text-white p-4">
            <div className="max-w-4xl mx-auto flex gap-4">
              <Link href="/authors" className="hover:bg-gray-700 px-4 py-2 rounded">
                Ver Autores
              </Link>
              <Link href="/crear" className="hover:bg-gray-700 px-4 py-2 rounded">
                Crear Autor
              </Link>
            </div>
          </nav>
          {children}
        </AutoresProvider>
      </body>
    </html>
  );
}
