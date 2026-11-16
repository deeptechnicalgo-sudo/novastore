import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

export const dynamic = "force-dynamic";

if (!process.env.KINDE_ISSUER_URL) {
  process.env.KINDE_ISSUER_URL = "https://novastorekinde.kinde.com";
}
if (!process.env.KINDE_CLIENT_ID) {
  process.env.KINDE_CLIENT_ID = "7173f7e37d514330a286cab7f0250777";
}
if (!process.env.KINDE_CLIENT_SECRET) {
  process.env.KINDE_CLIENT_SECRET = "me3IdvDyCVYXSLwEF8BT0cN8q1GBpKvLpY01kaOquPOfr8DAhC";
}
if (!process.env.KINDE_SITE_URL) {
  process.env.KINDE_SITE_URL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000";
}
if (!process.env.KINDE_POST_LOGOUT_REDIRECT_URL) {
  process.env.KINDE_POST_LOGOUT_REDIRECT_URL = process.env.KINDE_SITE_URL;
}
if (!process.env.KINDE_POST_LOGIN_REDIRECT_URL) {
  process.env.KINDE_POST_LOGIN_REDIRECT_URL = `${process.env.KINDE_SITE_URL}/add-password`;
}

export async function GET(request, endpoint) {
  return handleAuth()(request, endpoint);
}
