import '../styles/globals.css';
import SupabaseWrapperClient from '@/components/SupabaseWrapperClient';

export const metadata = { title: 'Dobotas Feedback' };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <SupabaseWrapperClient>{children}</SupabaseWrapperClient>
      </body>
    </html>
  );
}
