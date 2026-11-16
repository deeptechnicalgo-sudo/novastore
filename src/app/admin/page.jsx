import { Suspense } from "react";
import AdminDashboardClient from "./AdminDashboardClient";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#090d16",
            color: "#ffffff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Inter, sans-serif"
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(255,255,255,0.1)",
                borderTopColor: "#fbbf24",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                margin: "0 auto 16px"
              }}
            />
            <p style={{ fontSize: "14px", color: "#9ca3af", letterSpacing: "0.05em" }}>
              AUTHENTICATING ADMIN PRIVILEGES...
            </p>
          </div>
        </div>
      }
    >
      <AdminDashboardClient />
    </Suspense>
  );
}
