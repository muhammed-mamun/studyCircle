import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudyCircle — Shikho',
  description: 'একসাথে পড়ো, একসাথে এগিয়ে যাও। Shikho StudyCircle — AI-matched study groups for Bangladeshi students.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
