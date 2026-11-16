import { Suspense } from "react";
import CollectionsClient from "./CollectionsClient";

export const dynamic = "force-dynamic";

export default function CollectionsPage() {
  return (
    <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", fontFamily: "Inter, sans-serif" }}>Loading collections...</div>}>
      <CollectionsClient />
    </Suspense>
  );
}
