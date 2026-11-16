import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { auth } from "../../../auth";
import AddPasswordClient from "./AddPasswordClient";

export const dynamic = "force-dynamic";

export default async function AddPasswordPage() {
  let ssoName = "";
  let ssoEmail = "";

  try {
    const session = await auth();
    if (session?.user) {
      ssoName = session.user.name || "";
      ssoEmail = session.user.email || "";
    }
  } catch (e) {}

  if (!ssoEmail) {
    try {
      const { getUser } = getKindeServerSession();
      const kindeUser = await getUser();
      if (kindeUser) {
        ssoName =
          kindeUser.given_name || kindeUser.family_name
            ? `${kindeUser.given_name || ""} ${kindeUser.family_name || ""}`.trim()
            : kindeUser.name || "";
        ssoEmail = kindeUser.email || "";
      }
    } catch (e) {}
  }

  return <AddPasswordClient initialName={ssoName} initialEmail={ssoEmail} />;
}

