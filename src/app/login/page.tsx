// src/app/login/page.tsx
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  // const redirect = search.get("redirect"); // Biến này chưa dùng, có thể giữ hoặc bỏ

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await login(email, password);
      // Xử lý redirect sau khi login thành công ở đây nếu cần
    } catch (e) {
      setErr("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <div className="login-bg">
        <div className="login-box">
          <div className="login-title">SIGN IN</div>

          {err && <div className="error">{err}</div>}

          <form onSubmit={onSubmit}>
            <label className="login-label" htmlFor="email">
              Email
            </label>
            <input
              className="login-input"
              type="email"
              id="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />

            <label className="login-label" htmlFor="password">
              Password
            </label>
            <input
              className="login-input"
              type="password"
              id="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />

            <div className="login-row">
              <div>
                <input
                  className="login-checkbox"
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={loading}
                />
                <label htmlFor="remember" style={{ fontSize: 12, color: "#222" }}>
                  Remember me
                </label>
              </div>
              <Link href="/forgot-pass" className="login-link">
                Forgot your password?
              </Link>
            </div>

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* --- PHẦN MỚI THÊM VÀO (button thay vì Link) --- */}
          <div className="new-customer-box">
            <div className="new-customer-text"><i>New Customer?</i></div>
            <button
              type="button"
              className="btn-register"
              onClick={() => router.push("/register")}
              disabled={loading}
            >
              Create my account
            </button>
          </div>
          {/* ------------------------- */}
          
        </div>
      </div>

      {/* SCOPED CSS  */}
      <style jsx>{`
        .login-bg {
          height: 100vh;
          min-height: unset;
          background: url("https://www.odealarose.com/media/cache/1920_1080_webp/build/images/flower-delivery.webp")
            center center / cover no-repeat;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding-top: 0;
        }
        .login-box {
          position: relative;
          z-index: 1;
          background: #fff;
          border: 1px solid #222;
          border-radius: 0;
          max-width: 370px;
          width: 100%;
          margin: 48px auto;
          padding: 36px 32px 36px 32px; /* Tăng padding bottom một chút */
          box-sizing: border-box;
          box-shadow: 0 2px 12px #eee;
        }
        .login-title {
          font-family: "Playfair Display", serif;
          font-size: 2rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-align: left;
          margin-bottom: 28px;
        }
        .login-label {
          font-size: 13px;
          color: #222;
          margin-bottom: 3px;
          display: block;
          font-weight: 400;
        }
        .login-input {
          width: 100%;
          padding: 8px 10px;
          margin-bottom: 18px;
          border-radius: 0;
          border: 1px solid #222;
          font-size: 15px;
          font-family: "Montserrat", Arial, sans-serif;
          background: #fff;
          box-sizing: border-box;
        }
        .login-input:focus {
          outline: none;
          border-color: #e75480;
        }
        .login-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .login-link {
          font-size: 12px;
          color: #222;
          text-decoration: underline;
          cursor: pointer;
          transition: color 0.2s;
        }
        .login-link:hover {
          color: #e75480;
        }
        .login-checkbox {
          margin-right: 6px;
        }
        .login-btn {
          width: 100%;
          background: #222;
          color: #fff;
          border: none;
          border-radius: 24px;
          padding: 12px 0;
          font-size: 16px;
          font-family: "Montserrat", Arial, sans-serif;
          font-weight: 700;
          cursor: pointer;
          margin: 18px 0 0 0; /* Giảm margin bottom để dành chỗ cho phần dưới */
          transition: background 0.2s;
        }
        .login-btn:hover {
          background: #e75480;
        }
        .login-btn[disabled] {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .error {
          color: #e75480;
          text-align: center;
          margin-bottom: 12px;
          font-size: 14px;
        }


        .new-customer-box {
          margin-top: 32px;
          border-top: 1px solid #eee;
          padding-top: 24px;
          text-align: center;
        }
        .new-customer-text {
          font-size: 16px;
          font-family: "Playfair Display", serif;
          font-weight: 700;
          margin-bottom: 12px;
          color: #222;
          text-align: left;
        }
        .btn-register {
          display: block;
          width: 100%;
          height: 44px;
          line-height: 44px;
          background: #fff;
          color: #666;
          border: 1px solid #d0d0d0;
          border-radius: 9999px;
          padding: 0 24px;
          font-size: 14px;
          font-family: "Montserrat", Arial, sans-serif;
          font-weight: 600;
          text-align: center;
          text-decoration: none;
          transition: all 0.15s ease;
          cursor: pointer;
        }
        .btn-register:hover {
          background: #e75480;
          color: #fff;
          border-color: #e75480;
        }
        .btn-register[disabled] {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </main>
  );
}