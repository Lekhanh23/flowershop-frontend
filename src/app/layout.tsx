// src/app/layout.tsx
import './globals.css';
import { Providers } from './providers'; // <-- Import file providers

export const metadata = {
  title: 'Blossom Flower Shop',
  icons: {
    icon: "/images/logo.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning = {true}>
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers> {/* <-- File này chứa AuthProvider */}
      </body>
    </html>
  );
}