"use client";

import { useState, ChangeEvent, FormEvent, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import styles from "./page.module.css";
import api from "@/lib/api";

// Interface matches shipper_applications table schema
interface ShipperApplicationForm {
  // application_data (JSON): contains vehicle & identity info
  application_data: {
    national_id: string;
    license_number: string;
    vehicle_type: string;
    vehicle_plate: string;
    bank_account: string;
  };
  // resume_text: experience & self-introduction
  resume_text: string;
  // documents: file uploads
  documents: FileList | null;
}

export default function ShipperJoinPage() {
  const router = useRouter();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [formData, setFormData] = useState<ShipperApplicationForm>({
    application_data: {
      national_id: "",
      license_number: "",
      vehicle_type: "",
      vehicle_plate: "",
      bank_account: "",
    },
    resume_text: "",
    documents: null,
  });

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    field?: keyof ShipperApplicationForm["application_data"]
  ) => {
    const { name, value } = e.target;

    if (field) {
      // Update nested application_data
      setFormData((prev) => ({
        ...prev,
        application_data: {
          ...prev.application_data,
          [field]: value,
        },
      }));
    } else {
      // Update resume_text or other top-level fields
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        documents: e.target.files,
      }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setNotification(null);

    // Validate required fields
    if (
      !formData.application_data.national_id.trim() ||
      !formData.application_data.license_number.trim() ||
      !formData.application_data.vehicle_type ||
      !formData.application_data.vehicle_plate.trim() ||
      !formData.application_data.bank_account.trim() ||
      !formData.resume_text.trim()
    ) {
      setNotification({
        type: "error",
        message: "Please fill in all required fields.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!formData.documents || formData.documents.length === 0) {
      setNotification({
        type: "error",
        message: "Please upload your ID and Driver's License for verification.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      // Create FormData for multipart/form-data submission
      const data = new FormData();
      data.append("application_data", JSON.stringify(formData.application_data));
      data.append("resume_text", formData.resume_text);
      if(formData.documents) {
        for(let i = 0; i < formData.documents.length; i++) {
          data.append("documents", formData.documents[i]);
        }
      }

      // POST to API endpoint
      const res = await api.post("/shipper/apply", data);

      setNotification({
        type: "success",
        message: "Application submitted successfully! Please wait for Admin approval.",
      });

      // Reset form
      setFormData({
        application_data: {
          national_id: "",
          license_number: "",
          vehicle_type: "",
          vehicle_plate: "",
          bank_account: "",
        },
        resume_text: "",
        documents: null,
      });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.message || "An error occured while submitting";
      setNotification({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Become a Shipper</h1>
          <p className={styles.subtitle}>Join the Blossom Flower Shop delivery team today</p>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Notification */}
          {notification && (
            <div
              className={`${styles.notification} ${
                notification.type === "success"
                  ? styles.notificationSuccess
                  : styles.notificationError
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
              <h3 className={styles.sectionTitle}>1. Identity & Vehicle Information</h3>

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
                    value={formData.application_data.national_id}
                    onChange={(e) => handleInputChange(e, "national_id")}
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
                    value={formData.application_data.license_number}
                    onChange={(e) => handleInputChange(e, "license_number")}
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
                    value={formData.application_data.vehicle_type}
                    onChange={(e) => handleInputChange(e, "vehicle_type")}
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
                    value={formData.application_data.vehicle_plate}
                    onChange={(e) => handleInputChange(e, "vehicle_plate")}
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
                    value={formData.application_data.bank_account}
                    onChange={(e) => handleInputChange(e, "bank_account")}
                    placeholder="Bank Name - Account Number - Account Holder"
                    className={styles.input}
                  />
                </div>
              </div>
            </section>

            {/* Section 2: Profile & Documents */}
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>2. Profile & Experience</h3>

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

                  {formData.documents && formData.documents.length > 0 && (
                    <div className={styles.fileList}>
                      ✓ {formData.documents.length} file(s) selected
                    </div>
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