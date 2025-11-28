"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "../page.module.css"; 
import UserRow from "./UserRow";

interface UsersTableProps {
  role?: 'admin' | 'customer' | 'shipper';
  title: string;
  disableEdit?: boolean;
}

export default function UsersTable({ role, title, disableEdit = false }: UsersTableProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const url = role 
            ? `/admin/users?limit=100&role=${role}` 
            : '/admin/users?limit=100';
        const res = await api.get(url);
        // Sắp xếp theo ID
        const sorted = (res.data.data || []).sort((a: any, b: any) => a.id - b.id);
        setUsers(sorted);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [role]);

  if (loading) return <div style={{padding: 20}}>Loading {title}...</div>;

  return (
    <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.tableWrap}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th style={{width: '5%'}}>ID</th>
                        <th style={{width: '20%'}}>FULL NAME</th>
                        <th style={{width: '25%'}}>EMAIL</th>
                        <th style={{width: '15%'}}>PHONE</th>
                        <th style={{width: '20%'}}>ADDRESS</th>
                        <th style={{width: '10%'}}>ROLE</th>
                        <th style={{width: '15%'}}>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <UserRow 
                            key={user.id} 
                            user={user} 
                            disableEdit={disableEdit} 
                        />
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
}