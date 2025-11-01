// src/app/layout.tsx
import './globals.css';
import { Providers } from './providers';

export const metadata = {
  title: 'Flowershop Admin',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}