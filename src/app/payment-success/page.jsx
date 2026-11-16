import { Suspense } from "react";
import PaymentSuccessClient from "./PaymentSuccessClient";

export const dynamic = "force-dynamic";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", fontFamily: "Inter, sans-serif" }}>Loading order...</div>}>
      <PaymentSuccessClient />
    </Suspense>
  );
}
