import type { Metadata } from "next";
import "./globals.css";
import { PostHogProvider } from "@/lib/providers/PostHogProvider";

export const metadata: Metadata = {
  title: "E-commerce Store",
  description: "A simple e-commerce store for learning PostHog integration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-gray-50">
        <PostHogProvider>
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0">
                  <a href="/" className="text-2xl font-bold text-gray-900">
                    Store
                  </a>
                </div>
                <div className="flex space-x-8">
                  <a href="/" className="text-gray-700 hover:text-gray-900">
                    Products
                  </a>
                  <a href="/cart" className="text-gray-700 hover:text-gray-900">
                    Cart
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main>{children}</main>
        </PostHogProvider>
      </body>
    </html>
  );
}
