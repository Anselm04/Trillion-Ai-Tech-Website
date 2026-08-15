import './globals.css';
import { Nav } from '@/components/nav';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Trillion AI Tech — Premium AI Marketplace',
  description: 'Subscription-based marketplace for AI Apps, Games, Agents, Tools, and Software.',
  metadataBase: new URL('https://www.trillionaitech.com'),
  openGraph: {
    title: 'Trillion AI Tech',
    description: 'Premium AI product marketplace',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main>{children}</main>
        <footer className="border-t border-white/10 mt-24 py-10 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Trillion AI Tech. All rights reserved.</p>
          <div className="mt-3 flex justify-center gap-6">
            <a href="/legal/terms" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="/legal/privacy" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="/legal/refund" className="hover:text-slate-300 transition-colors">Refund Policy</a>
            <a href="/legal/cookies" className="hover:text-slate-300 transition-colors">Cookies</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
