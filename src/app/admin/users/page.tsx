import { Suspense } from 'react';
import { fetchAllUsers } from './lib/data';
import UsersTable from './components/UsersTable';

export default async function ManageUsersPage() {
    // Lấy dữ liệu người dùng từ MariaDB trên Server
    const users = await fetchAllUsers();

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-pink-700 text-center">Manage Users</h1>
            
            {/* Header / Breadcrumb */}
            <div className="mb-4 text-gray-600">
                Dashboard &gt; User Management
            </div>

            <Suspense fallback={<div>Loading users table...</div>}>
                <UsersTable users={users} />
            </Suspense>
            
            {/* Phân trang (Nếu cần) - Hiện tại chưa implement pagination */}
        </div>
    );
}