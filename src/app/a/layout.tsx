import "../globals.css";

// Temporary: the current admin still uses the v2 classes. The next step swaps
// this import for the shadcn tailwind.css together with the new admin UI.
export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
