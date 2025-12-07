// src/app/register/page.tsx
"use client";

import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";

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

    if (form.password !== form.confirm_password) {
      setErr("Passwords do not match.");
      return;
    }

    if (form.password.length < 6) {
        setErr("Password must be at least 6 characters.");
        return;
    }

    setLoading(true);
    try {
    const res = await fetch("http://localhost:3001/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
    full_name: form.full_name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    address: form.address.trim(),
    password: form.password,
  }),
});

      const data = await res.json();
      if (!res.ok) {
        setErr(data?.message || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      router.push("/login?registered=1");
    } catch (e) {
      setErr("Server error. Please try again.");
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
          // prevent page body from adding extra scroll gap
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
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label className="register-label" htmlFor="phone">
                  Phone
                </label>
                <input
                  className="register-input"
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
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
                />
              </div>
            </div>

            <button className="register-btn" type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <hr className="register-divider" />
          <div className="register-new-title">Already have an account?</div>
          <div style={{ textAlign: "center", marginTop: 8 }}>
            <button
              className="register-create-btn"
              onClick={() => router.push("/login")}
              aria-label="Sign in"
            >
              <div style={{ fontSize: 12 }}>Sign<br />in</div>
            </button>
          </div>
        </div>

        {/* Scoped CSS - compact to avoid vertical scroll */}
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
            padding: 22px 28px; /* reduced padding */
            box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
            /* make sure box fits into most viewports without page scroll */
            max-height: calc(100vh - 48px);
            overflow: hidden; /* hide any accidental overflow */
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }

          .register-title {
            font-family: "Playfair Display", serif;
            font-size: 30px; /* slightly smaller */
            font-weight: 700;
            letter-spacing: 1px;
            text-align: center;
            margin-bottom: 14px;
          }

          .register-label {
            font-size: 12px;
            color: #222;
            margin-bottom: 6px;
            display: block;
            font-weight: 500;
          }

          .register-input {
            width: 100%;
            padding: 8px 10px;
            margin-bottom: 10px;
            border-radius: 4px;
            border: 1px solid #222;
            font-size: 14px;
            background: #fff;
            box-sizing: border-box;
            height: 36px;
          }

          .register-input:focus {
            outline: none;
            border-color: #e75480;
          }

          .register-btn {
            width: 220px;
            margin: 12px auto 0 auto;
            display: block;
            background: #222;
            color: #fff;
            border: none;
            border-radius: 24px;
            padding: 8px 0;
            font-size: 14px;
            font-weight: 700;
            cursor: pointer;
          }

          .register-btn:hover {
            background: #e75480;
          }

          .register-divider {
            border: none;
            border-top: 1px solid #eee;
            margin: 14px 0;
            width: 100%;
          }

          .register-new-title {
            font-family: "Playfair Display", serif;
            font-size: 12px;
            font-style: italic;
            color: #222;
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
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
          }

          .register-create-btn:hover {
            background: #e75480;
            color: #fff;
            border-color: #e75480;
          }

          .error {
            color: #e75480;
            text-align: center;
            margin-bottom: 10px;
            font-size: 13px;
          }

          .form-row {
            display: flex;
            gap: 18px;
            margin-bottom: 0;
          }

          .form-col {
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          @media (max-width: 900px) {
            .register-box {
              padding: 16px;
              max-height: calc(100vh - 32px);
            }
            .form-row {
              flex-direction: column;
              gap: 8px;
            }
            .register-btn {
              width: 100%;
            }
            .register-title {
              font-size: 20px;
            }
          }
        `}</style>
      </main>
    </>
  );
}
