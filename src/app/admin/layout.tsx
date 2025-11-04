// src/app/admin/layout.tsx
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Cột nội dung dịch phải 256px (= w-64) để không bị Sidebar đè */}
      <div className="pl-64 min-h-screen flex flex-col">
        {/* Header ở trong flow (sticky), KHÔNG fixed toàn trang nên không đè main */}
        <Header />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
