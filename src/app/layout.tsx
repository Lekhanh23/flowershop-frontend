// src/app/layout.tsx
import './globals.css';
import { Providers } from './providers'; // <-- Import file providers

export const metadata = {
  title: 'FlowerShop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning = {true}>
      <body>
        <Providers>{children}</Providers> {/* <-- File này chứa AuthProvider */}
      </body>
    </html>
  );
}