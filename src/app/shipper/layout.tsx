import React from "react";
import { Metadata } from "next";
import ShipperHeader from "@/components/ShipperHeader";

export const metadata: Metadata = {
  title: "Shipper | Flower Shop",
  description: "Shipper management dashboard",
};

export default function ShipperLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-8">
      {/* Desktop: centered 553x935 preview frame */}
      <div className="hidden lg:flex items-center justify-center">
        <div
          className="relative rounded-2xl bg-white border border-gray-200 shadow-2xl overflow-hidden"
          style={{
            width: 553,
            height: 935,
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {/* Optional top notch visual */}
          <div
            style={{
              position: "absolute",
              top: 6,
              left: "50%",
              transform: "translateX(-50%)",
              width: 120,
              height: 8,
              borderRadius: 8,
              background: "rgba(0,0,0,0.06)",
              zIndex: 20,
            }}
          />

          {/* Content */}
          <div className="flex flex-col h-full">
            <div className="flex-shrink-0">
              <ShipperHeader />
            </div>

            <main className="flex-1 overflow-auto bg-[linear-gradient(180deg,#fff,#fff)]">
              {/* pad children so they look like mobile content inside frame */}
              <div style={{ padding: 16, minHeight: "100%" }}>
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Mobile / tablet / small screens: normal full-width experience */}
      <div className="w-full lg:hidden">
        <ShipperHeader />
        <main className="mx-auto max-w-md px-4 py-4">{children}</main>
      </div>
    </div>
  );
}