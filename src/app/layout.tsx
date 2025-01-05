import type { Metadata } from 'next';
import { Layout } from 'antd';
import { Content } from 'antd/es/layout/layout';
import Header from '@/components/Header';
import { NextAuthProvider } from './provider';
import './globals.css';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Trackr',
  description: 'Lightweight time managing and reporting tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NextAuthProvider>
          <Layout style={{ minHeight: '100vh' }}>
            <Header />
            <Content className="main-wrapper">{children}</Content>
            <Footer />
          </Layout>
        </NextAuthProvider>
      </body>
    </html>
  );
}
