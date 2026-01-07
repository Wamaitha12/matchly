import "./globals.css";

export const metadata = {
  title: "Matchly",
  description: "Creator & Brand Matchmaking Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-900 text-neutral-100">
        {/* Global Navbar */}
        <header className="w-full border-b border-neutral-800">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-center">
            <span className="text-xl font-semibold tracking-wide text-neutral-100">
              Match<span className="text-violet-400">ly</span>
            </span>
          </div>
        </header>

        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}
