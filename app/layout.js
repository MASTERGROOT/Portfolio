import '../styles/globals.css';
import { LangProvider } from '../lib/LangContext.jsx';

export const metadata = {
  title: '"Goody" Vivitthachai Laprattanatrai — Business Analyst & ERP Specialist',
  description: 'Portfolio of Goody, Business Analyst & ERP Implementation Specialist based in Bangkok.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=Inter:wght@400;500;600&family=Sarabun:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
