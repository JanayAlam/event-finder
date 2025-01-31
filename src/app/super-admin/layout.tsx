export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main>
      <div>Navbar</div>
      {children}
    </main>
  );
}
