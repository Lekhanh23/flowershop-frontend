"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.css";

// Interface matches Table 11 (shipper_profile) & Table 12 (shipper_applications)
interface ShipperApplicationForm {
  national_id: string;      
  license_number: string;   
  vehicle_type: string;     
  vehicle_plate: string;    
  bank_account: string;     
  resume_text: string;      
}

export default function ShipperJoinPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for loading and notifications
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // State for text inputs
  const [formData, setFormData] = useState<ShipperApplicationForm>({
    national_id: "",
    license_number: "",
    vehicle_type: "",
    vehicle_plate: "",
    bank_account: "",
    resume_text: "",
  });

  // State for file uploads (documents)
  const [documents, setDocuments] = useState<FileList | null>(null);

  // Handle text changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file changes
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setDocuments(e.target.files);
    }
  };

  // Handle upload click
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    // Validate: Check if files are uploaded
    if (!documents || documents.length === 0) {
      setNotification({ type: 'error', message: "Please upload your ID and Driver's License for verification." });
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData to send multipart/form-data
      const data = new FormData();

      // Append text fields
      data.append("national_id", formData.national_id);
      data.append("license_number", formData.license_number);
      data.append("vehicle_type", formData.vehicle_type);
      data.append("vehicle_plate", formData.vehicle_plate);
      data.append("bank_account", formData.bank_account);
      data.append("resume_text", formData.resume_text);

      // Append files
      for (let i = 0; i < documents.length; i++) {
        data.append("documents", documents[i]);
      }

      // --- MOCK API CALL ---
      // In production: await axios.post('/api/shipper/apply', data);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate delay

      // Success Message
      setNotification({
        type: 'success',
        message: "Application submitted successfully! Please wait for Admin approval."
      });

      // Reset form
      setFormData({
        national_id: "",
        license_number: "",
        vehicle_type: "",
        vehicle_plate: "",
        bank_account: "",
        resume_text: "",
      });
      setDocuments(null);

    } catch (error) {
      setNotification({ type: 'error', message: "An error occurred while submitting. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            Become a Shipper
          </h1>
          <p className={styles.subtitle}>
            Join the Blossom Flower Shop delivery team today
          </p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Notification */}
          {notification && (
            <div
              className={`${styles.notification} ${
                notification.type === "success" ? styles.notificationSuccess : styles.notificationError
              }`}
            >
              <span className={styles.notificationIcon}>
                {notification.type === "success" ? "✓" : "⚠"}
              </span>
              {notification.message}
            </div>
          )}

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Section 1: Identity & Vehicle Info */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                1. Identity & Vehicle Information
              </h3>

              <div className={styles.grid}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    National ID / Citizen ID
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="national_id"
                    required
                    value={formData.national_id}
                    onChange={handleInputChange}
                    placeholder="Enter National ID"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Driver's License Number
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="license_number"
                    required
                    value={formData.license_number}
                    onChange={handleInputChange}
                    placeholder="Enter License Number"
                    className={styles.input}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Vehicle Type
                    <span className={styles.required}>*</span>
                  </label>
                  <select
                    name="vehicle_type"
                    required
                    value={formData.vehicle_type}
                    onChange={handleInputChange}
                    className={styles.select}
                  >
                    <option value="">-- Select Type --</option>
                    <option value="Motorbike">Motorbike</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>
                    Vehicle Plate Number
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_plate"
                    required
                    value={formData.vehicle_plate}
                    onChange={handleInputChange}
                    placeholder="e.g., 29H1-123.45"
                    className={styles.input}
                  />
                </div>

                <div className={`${styles.formGroup} ${styles.gridFull}`}>
                  <label className={styles.label}>
                    Bank Account (For Payments)
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="bank_account"
                    required
                    value={formData.bank_account}
                    onChange={handleInputChange}
                    placeholder="Bank Name - Account Number - Account Holder"
                    className={styles.input}
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Profile & Documents */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                2. Profile & Experience
              </h3>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Self-Introduction / Experience
                  <span className={styles.required}>*</span>
                </label>
                <textarea
                  name="resume_text"
                  required
                  value={formData.resume_text}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your delivery experience (areas you know well, years of experience...)"
                  className={styles.textarea}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>
                  Verification Documents (ID Card, Driver's License)
                  <span className={styles.required}>*</span>
                </label>

                <div className={styles.uploadBox} onClick={handleUploadClick}>
                  <svg
                    className={styles.uploadIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className={styles.uploadText}>
                    <span className={styles.uploadLink}>Click to upload</span> or drag and drop
                  </p>
                  <p className={styles.uploadHint}>PNG, JPG, PDF up to 10MB</p>

                  {documents && documents.length > 0 && (
                    <div className={styles.fileList}>✓ {documents.length} file(s) selected</div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.png,.pdf,.jpeg"
                    onChange={handleFileChange}
                    className={styles.fileInput}
                  />
                </div>
              </div>
            </section>

            {/* Actions */}
            <div className={styles.actions}>
              <button
                type="button"
                onClick={() => router.back()}
                className={`${styles.button} ${styles.cancelBtn}`}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${styles.button} ${styles.submitBtn}`}
              >
                {isSubmitting && <span className={styles.spinner} />}
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}