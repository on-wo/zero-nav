import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '在线服务',
  description: '简洁网址导航',
  keywords: '在线工具导航, 个人网址导航, 服务器监控, 实用工具集合',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
