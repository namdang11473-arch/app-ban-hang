import Link from "next/link";
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
}