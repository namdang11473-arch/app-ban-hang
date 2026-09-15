import "./globals.css";
export const metadata = {
  title: "Nền tảng Tự động hóa Bán hàng",
  description: "Omnichannel Platform",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}