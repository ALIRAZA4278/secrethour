import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
});

export const metadata = {
  title: 'Secret Hour — Quiet Luxuries for Married Couples',
  description:
    'Quietly luxurious gifts crafted for married couples — to slow down, come closer, and remember why.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
