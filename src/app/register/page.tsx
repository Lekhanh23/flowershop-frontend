"use client";

import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import api from "@/lib/api"; 

const BG =
  "https://www.odealarose.com/media/cache/1920_1080_webp/build/images/flower-delivery.webp";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirm_password: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");

    // Validate client-side
    if (form.password !== form.confirm_password) {
      setErr("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (form.password.length < 6) {
        setErr("Mật khẩu phải có ít nhất 6 ký tự.");
        return;
    }

    setLoading(true);
    try {
      const response = await api.post("auth/register", {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        password: form.password,
      });

      // Nếu không có lỗi, chuyển hướng sang login
      router.push("/login?registered=1");
      
    } catch (e: any) {
      console.error("Register Error:", e);
      // Lấy thông báo lỗi từ Backend trả về
      const msg = e.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <main
        className="register-bg"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: `url("${BG}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          padding: 0,
          margin: 0,
          boxSizing: "border-box",
        }}
      >
        <div className="register-box" role="region" aria-label="Register form">
          <div className="register-title">REGISTER</div>

          {err && <div className="error">{err}</div>}

          <form onSubmit={onSubmit}>
            <div className="form-row">
              <div className="form-col">
                <label className="register-label" htmlFor="full_name">
                  Full Name
                </label>
                <input
                  className="register-input"
                  id="full_name"
                  name="full_name"
                  value={form.full_name}
                  onChange={(e) => update("full_name", e.target.value)}
                  required
                  autoFocus
                  placeholder="Nguyễn Văn A"
                />
              </div>

              <div className="form-col">
                <label className="register-label" htmlFor="email">
                  Email
                </label>
                <input
                  className="register-input"
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  required
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="register-label" htmlFor="phone">
                  Phone Number
                </label>
                <input
                  className="register-input"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="0901234567"
                />
              </div>

              <div className="form-col">
                <label className="register-label" htmlFor="address">
                  Address
                </label>
                <input
                  className="register-input"
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="Số nhà, đường, quận..."
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="register-label" htmlFor="password">
                  Password
                </label>
                <input
                  className="register-input"
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  required
                  placeholder="••••••"
                />
              </div>

              <div className="form-col">
                <label className="register-label" htmlFor="confirm_password">
                  Confirm Password
                </label>
                <input
                  className="register-input"
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  value={form.confirm_password}
                  onChange={(e) => update("confirm_password", e.target.value)}
                  required
                  placeholder="••••••"
                />
              </div>
            </div>

            <button className="register-btn" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <hr className="register-divider" />
          <div className="register-new-title">You already have an account?</div>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button
              className="register-create-btn"
              onClick={() => router.push("/login")}
              aria-label="Sign in"
            >
              <div style={{ fontSize: 12 }}>Sign<br />In</div>
            </button>
          </div>
        </div>

        {/* CSS Styles */}
        <style jsx>{`
          :global(html, body) {
            height: 100%;
            margin: 0;
          }

          .register-bg {
            width: 100%;
          }

          .register-box {
            background: #fff;
            border: 1px solid #222;
            border-radius: 6px;
            max-width: 720px;
            width: 100%;
            padding: 22px 28px;
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
            max-height: calc(100vh - 48px);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }

          .register-title {
            font-family: "Playfair Display", serif;
            font-size: 30px;
            font-weight: 700;
            letter-spacing: 1px;
            text-align: center;
            margin-bottom: 14px;
            text-transform: uppercase;
          }

          .register-label {
            font-size: 12px;
            color: #222;
            margin-bottom: 6px;
            display: block;
            font-weight: 600;
            text-transform: uppercase;
          }

          .register-input {
            width: 100%;
            padding: 8px 10px;
            margin-bottom: 10px;
            border-radius: 4px;
            border: 1px solid #ccc;
            font-size: 14px;
            background: #fff;
            box-sizing: border-box;
            height: 40px;
            transition: border 0.2s;
          }

          .register-input:focus {
            outline: none;
            border-color: #d81b60; /* Màu hồng chủ đạo */
            border-width: 1.5px;
          }

          .register-btn {
            width: 220px;
            margin: 12px auto 0 auto;
            display: block;
            background: #222;
            color: #fff;
            border: none;
            border-radius: 24px;
            padding: 10px 0;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
            text-transform: uppercase;
            transition: background 0.2s;
          }

          .register-btn:hover {
            background: #d81b60;
          }

          .register-btn:disabled {
            background: #999;
            cursor: not-allowed;
          }

          .register-divider {
            border: none;
            border-top: 1px solid #eee;
            margin: 14px 0;
            width: 100%;
          }

          .register-new-title {
            font-family: "Playfair Display", serif;
            font-size: 13px;
            font-style: italic;
            color: #555;
            margin-bottom: 6px;
            text-align: center;
          }

          .register-create-btn {
            width: 52px;
            height: 52px;
            margin: 6px auto 0;
            display: block;
            background: #fff;
            color: #222;
            border: 1.5px solid #222;
            border-radius: 50%;
            padding: 4px;
            font-size: 11px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
          }

          .register-create-btn:hover {
            background: #d81b60;
            color: #fff;
            border-color: #d81b60;
          }

          .error {
            color: #d32f2f;
            background: #ffebee;
            padding: 8px;
            border-radius: 4px;
            text-align: center;
            margin-bottom: 15px;
            font-size: 13px;
            font-weight: 500;
          }

          .form-row {
            display: flex;
            gap: 20px;
            margin-bottom: 5px;
          }

          .form-col {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          @media (max-width: 768px) {
            .register-box {
              padding: 20px;
              max-height: none;
              border-radius: 0;
              border: none;
              height: 100vh;
              overflow-y: auto;
            }
            .form-row {
              flex-direction: column;
              gap: 0;
            }
            .register-btn {
              width: 100%;
            }
            .register-title {
              font-size: 24px;
            }
          }
        `}</style>
      </main>
    </>
  );
}