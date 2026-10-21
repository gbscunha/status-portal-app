import "../globals.css";

// Client pages keep the v2 stylesheet (pure CSS) until their own migration to
// shadcn. The root layout loads no CSS — see the note there.
export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
