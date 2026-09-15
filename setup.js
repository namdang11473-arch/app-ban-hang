const fs = require('fs');
const path = require('path');

const dirs = [
  'prisma',
  'src/lib',
  'src/components',
  'src/app/(auth)/login',
  'src/app/(auth)/register',
  'src/app/dashboard',
  'src/app/admin',
  'src/app/p/[slug]',
  'src/app/api/auth/[...nextauth]',
  'src/app/api/products',
  'src/app/api/orders'
];

dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const files = {
  'package.json': `{
  "name": "omnichannel-platform",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "prisma generate && next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@prisma/client": "^5.22.0",
    "bcryptjs": "^3.0.3",
    "next": "14.2.35",
    "next-auth": "^4.24.15",
    "prisma": "^5.22.0",
    "react": "^18",
    "react-dom": "^18"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "eslint": "^8",
    "eslint-config-next": "14.2.35",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}`,

  'prisma/schema.prisma': `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  password      String
  role          String    @default("VENDOR")
  fullName      String
  phone         String?
  bankName      String?
  bankAccount   String?
  bankOwner     String?
  isVip         Boolean   @default(false)
  vipUntil      DateTime?
  createdAt     DateTime  @default(now())
  
  products  Product[] @relation("VendorProducts")
  orders    Order[]   @relation("AffiliateOrders")
}

model Product {
  id                   String   @id @default(uuid())
  name                 String
  description          String?
  price                Float
  inventory            Int      @default(0)
  landingPageSlug      String   @unique
  externalAffiliateUrl String? 
  imageUrl             String?  
  videoUrl             String?  
  allowedShippers      String   @default("VNPOST,GHTK,GHN")
  variants             String?  
  affiliateRewardPercent Float  @default(10)
  weightGram           Int      @default(500)
  isActive             Boolean  @default(true)
  createdAt            DateTime @default(now())

  vendorId  String
  vendor    User     @relation("VendorProducts", fields: [vendorId], references: [id])
  orders    Order[]
}

model Order {
  id                String   @id @default(uuid())
  customerName      String
  customerPhone     String
  customerAddress   String
  variant           String?  
  quantity          Int      @default(1)
  totalAmount       Int      @default(0)
  commissionAmount  Int      @default(0)
  status            String   @default("PENDING")
  paymentMethod     String   @default("COD")
  paymentStatus     String   @default("UNPAID")
  trackingCode      String?  
  createdAt         DateTime @default(now())

  productId  String
  product    Product @relation(fields: [productId], references: [id])
  
  affiliateId String?
  affiliate   User?   @relation("AffiliateOrders", fields: [affiliateId], references: [id])
}`,

  '.env': `DATABASE_URL="postgresql://postgres:password@localhost:5432/omnichannel?schema=public"
NEXTAUTH_SECRET="super-secret-key-omnichannel-2026"
NEXTAUTH_URL="http://localhost:3000"`,

  'tsconfig.json': `{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`,

  'tailwind.config.js': `module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [],
};`,

  'postcss.config.js': `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`,

  'next.config.mjs': `/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;`,

  'src/lib/prisma.ts': `import { PrismaClient } from "@prisma/client";
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;`,

  'src/app/globals.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background-color: #f8fafc;
  color: #0f172a;
}`,

  'src/app/layout.tsx': `import "./globals.css";
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
}`,

  'src/app/page.tsx': `import Link from "next/link";
export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="text-center max-w-lg bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Nền tảng Tự động hóa Bán hàng</h1>
        <p className="text-slate-500 mb-6 text-sm">Hệ thống quản lý sản phẩm, đơn hàng & tiếp thị liên kết</p>
        <Link href="/dashboard" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
          Vào Trang Quản Trị (Dashboard)
        </Link>
      </div>
    </main>
  );
}`,

  'src/app/api/products/route.ts': `import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Thiếu ID" }, { status: 400 });

    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });
    return NextResponse.json({ message: "Ngừng kinh doanh sản phẩm thành công" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}`,

  'src/app/dashboard/page.tsx': `"use client";
import React, { useState, useEffect } from "react";

export default function Dashboard() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleSoftDelete = async (id: string, name: string) => {
    if (!confirm(\`Ngừng kinh doanh (xóa mềm) sản phẩm: \${name}?\`)) return;
    await fetch(\`/api/products?id=\${id}\`, { method: "DELETE" });
    loadData();
  };

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản trị Sản phẩm</h1>
      </div>
      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b text-xs text-slate-500 uppercase">
              <th className="p-4">Tên sản phẩm</th>
              <th className="p-4">Giá bán</th>
              <th className="p-4">Tồn kho</th>
              <th className="p-4">Hoa hồng</th>
              <th className="p-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-4 text-center text-slate-400">Đang tải...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan={5} className="p-4 text-center text-slate-400">Chưa có sản phẩm nào.</td></tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-medium">{p.name}</td>
                  <td className="p-4">{p.price?.toLocaleString("vi-VN")} đ</td>
                  <td className="p-4">{p.inventory}</td>
                  <td className="p-4 text-emerald-600 font-medium">{p.affiliateRewardPercent}%</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleSoftDelete(p.id, p.name)}
                      className="text-xs px-3 py-1.5 bg-rose-50 text-rose-600 rounded border border-rose-200 hover:bg-rose-100"
                    >
                      Ngừng bán (Xóa mềm)
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}`
};

Object.entries(files).forEach(([fPath, content]) => {
  fs.writeFileSync(path.join(__dirname, fPath), content, 'utf8');
  console.log('✓ Đã tạo:', fPath);
});

console.log('\\n>>> DỰNG TOÀN BỘ CODE HOÀN TẤT! <<<');
