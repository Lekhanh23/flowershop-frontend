"use client";

import React, { useEffect, useState } from "react";
import api from "@/lib/api";
import styles from "./page.module.css";

export default function ManageShippersPage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'active'>('pending');
  const [applications, setApplications] = useState<any[]>([]);
  const [activeShippers, setActiveShippers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  // Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'pending') {
        const res = await api.get('/shipper/applications?status=pending');
        setApplications(res.data || []);
      } else {
        const res = await api.get('/users/admin/list?limit=100&role=shipper');
        setActiveShippers(res.data.data || []);
      }
    } catch (error) { console.error(error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [activeTab]);

  // Actions
  const handleReview = async (id: number, status: 'approved' | 'rejected') => {
    if (!confirm(`Xác nhận ${status.toUpperCase()} đơn này?`)) return;
    try {
      await api.patch(`/shipper/applications/${id}/review`, { status });
      
      //Đổi status dòng đó để hiện Badge
      setApplications(prev => prev.map(app => app.id === id ? { ...app, status } : app));
      setViewModalOpen(false);
      
      // Nếu Approve thì reload ngầm active list
      if (status === 'approved') fetchData(); 
    } catch (e) { alert("Thao tác thất bại"); }
  };

  const handleDeleteShipper = async (id: number) => {
    if(!confirm("Xóa tài khoản Shipper này?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setActiveShippers(prev => prev.filter(s => s.id !== id));
    } catch (e) { alert("Xóa thất bại"); }
  };

  const handleViewDetails = (app: any) => { setSelectedApp(app); setViewModalOpen(true); };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manage Shippers</h2>
      
      {/* TABS */}
      <div className={styles.tabs}>
        <button className={`${styles.tabBtn} ${activeTab === 'pending' ? styles.activeTab : ''}`} onClick={() => setActiveTab('pending')}>
          Pending Applications ({applications.filter(a => a.status === 'pending').length})
        </button>
        <button className={`${styles.tabBtn} ${activeTab === 'active' ? styles.activeTab : ''}`} onClick={() => setActiveTab('active')}>
          Active Shippers List
        </button>
      </div>

      {/* TABLE CONTENT */}
      <div className={styles.tableWrap}>
        {loading ? <div style={{padding:20, textAlign:'center'}}>Loading...</div> : (
          activeTab === 'pending' ? (
            <table className={styles.table}>
              <thead>
                <tr><th>ID</th><th>Applicant</th><th>Email</th><th>Applied At</th><th>Resume</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {applications.length === 0 ? <tr><td colSpan={6} style={{textAlign:'center', padding:20}}>No pending applications</td></tr> :
                 applications.map((app, index) => (
                  <tr key={app.id}>
                    <td style={{fontWeight:'bold'}}>{index + 1}</td>
                    <td className={styles.name}>{app.user?.full_name}</td>
                    <td className={styles.email}>{app.user?.email}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td style={{maxWidth:300}}>{app.resumeText || 'No info'}</td>
                    <td>
                      {app.status === 'approved' ? <span className={styles.badgeApproved}>Approved</span> :
                       app.status === 'rejected' ? <span className={styles.badgeRejected}>Rejected</span> : (
                        <>
                          <button className={styles.viewBtn} onClick={() => handleViewDetails(app)}>View</button>
                          <button className={styles.approveBtn} onClick={() => handleReview(app.id, 'approved')}>Approve</button>
                          <button className={styles.rejectBtn} onClick={() => handleReview(app.id, 'rejected')}>Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Status</th><th>Address</th><th>Action</th></tr>
              </thead>
              <tbody>
                {activeShippers.length === 0 ? <tr><td colSpan={7} style={{textAlign:'center', padding:20}}>No active shippers</td></tr> :
                 activeShippers.map((s, index) => {
                  const status = s.shipperProfile?.status || 'unavailable';
                  return (
                    <tr key={s.id}>
                      <td style={{fontWeight:'bold'}}>{index + 1}</td>
                      <td className={styles.name}>{s.full_name}</td>
                      <td className={styles.email}>{s.email}</td>
                      <td>{s.phone || "-"}</td>
                      <td>
                        <span className={`${styles.statusBadge} ${status === 'available' ? styles.statusAvailable : styles.statusUnavailable}`}>
                          {status}
                        </span>
                      </td>
                      <td>{s.address || "-"}</td>
                      <td><button className={styles.deleteBtn} onClick={() => handleDeleteShipper(s.id)}>Delete</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )
        )}
      </div>

      {/* MODAL VIEW */}
      {viewModalOpen && selectedApp && (
        <div className={styles.modalOverlay} onClick={() => setViewModalOpen(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setViewModalOpen(false)}>&times;</button>
            <h3 className={styles.modalTitle}>Application Details</h3>
            <div className={styles.infoGrid}>
                <div className={styles.infoItem}><label>Name</label><p>{selectedApp.user?.full_name}</p></div>
                <div className={styles.infoItem}><label>Email</label><p>{selectedApp.user?.email}</p></div>
                <div className={styles.infoItem}><label>National ID</label><p>{selectedApp.applicationData?.nationalId || "N/A"}</p></div>
                <div className={styles.infoItem}><label>Vehicle</label><p>{selectedApp.applicationData?.vehicleType || "N/A"}</p></div>
                <div className={styles.infoItem}><label>License Plate</label><p>{selectedApp.applicationData?.licensePlate || "N/A"}</p></div>
                <div className={styles.infoItem}><label>Phone</label><p>{selectedApp.applicationData?.phone || selectedApp.user?.phone || "N/A"}</p></div>
                <div className={styles.infoItem} style={{gridColumn: 'span 2'}}><label>Resume</label><p>{selectedApp.resumeText}</p></div>
            </div>
            <div className={styles.modalActions}>
               {selectedApp.status === 'pending' && (
                  <>
                    <button className={styles.rejectBtn} onClick={() => handleReview(selectedApp.id, 'rejected')}>Reject</button>
                    <button className={styles.approveBtn} onClick={() => handleReview(selectedApp.id, 'approved')}>Approve</button>
                  </>
               )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}