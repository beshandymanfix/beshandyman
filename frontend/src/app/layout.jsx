import '../index.css'; // Adjust the path to your global CSS
import { UserProvider } from '../context/UserContext';

export const metadata = {
  title: 'Beshandyman',
  description: 'Handyman services directory',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-zinc-950 text-zinc-100 font-sans">
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
