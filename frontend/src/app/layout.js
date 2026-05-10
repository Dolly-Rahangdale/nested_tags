import './globals.css';

export const metadata = {
  title: 'Nested Tags Tree',
  description: 'Interactive nested tags tree application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}