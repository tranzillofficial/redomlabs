import '@fontsource/tajawal/400.css';
import '@fontsource/tajawal/500.css';
import '@fontsource/tajawal/700.css';
import '@fontsource/manrope/400.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/700.css';
import '../globals.css';
import './proposal.css';

export const viewport = { width: 'device-width', initialScale: 1 };

export default function ProposalLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" data-theme="light">
      <body>{children}</body>
    </html>
  );
}
