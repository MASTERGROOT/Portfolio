import '../styles/globals.css';
import { LangProvider } from '../lib/LangContext.jsx';
import { Cursor } from '../components/ui/Cursor.jsx';

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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&family=Sarabun:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Cursor />
        <LangProvider>{children}</LangProvider>
      </body>
    </html>
  );
}
