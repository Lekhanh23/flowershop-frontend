import { Suspense } from 'react';
import { fetchAllUsers } from './lib/data';
import UsersTable from './components/UsersTable';
import styles from './page.module.css';

export default async function ManageUsersPage() {
    // Lấy dữ liệu người dùng từ MariaDB trên Server
    const users = await fetchAllUsers();

    return (
        <div className={styles.container}>
            <div className={styles.headerRow}>
                <h2 className={styles.title}>User Management</h2>
            </div>

            <Suspense fallback={<div>Loading users table...</div>}>
                <UsersTable users={users} />
            </Suspense>
        </div>
    );
}