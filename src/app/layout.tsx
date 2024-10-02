import type { Metadata } from "next";
import { Layout } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import Title from "antd/es/typography/Title";
import "./globals.css";

export const metadata: Metadata = {
  title: "App title",
  description: "App title description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Layout style={{ minHeight: '100vh' }}>
          <Header style={{ display: 'flex', alignItems: 'center', backgroundColor: '#fff', boxShadow: '0 5px 5px rgba(0,0,0,.1)' }}>
            <Title level={5}>App title</Title>
          </Header>
          <Content className="main-wrapper">
            {children}
          </Content>
        </Layout>
      </body>
    </html>
  );
}
