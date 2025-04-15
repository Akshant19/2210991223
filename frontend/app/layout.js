import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata = {
  title: "Social Media Analytics",
  description: "Real-time social media analytics platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 min-h-screen bg-gradient-to-br from-white to-gray-100">
        <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none"></div>
        <Navigation />
        <main className="container mx-auto px-6 py-12 relative">
          {children}
        </main>
      </body>
    </html>
  );
}
