import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Guardia Vieja - Menú QR",
  description: "Pedí directo a la cocina desde la mesa del bodegón",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        suppressHydrationWarning={true}
        style={{ margin: 0, padding: 0, backgroundColor: '#1e1f22' }}
      >
        {children}
      </body>
    </html>
  );
}