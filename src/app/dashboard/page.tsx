"use client";
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
    if (!confirm(`Ngừng kinh doanh (xóa mềm) sản phẩm: ${name}?`)) return;
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
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
}