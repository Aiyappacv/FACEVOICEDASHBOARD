import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SPECTRAFACEVOICE™ | Enterprise Command Center',
  description: 'Multimodal Biometric Identity Platform - Enterprise Security Operations Center',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#130B2C] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
