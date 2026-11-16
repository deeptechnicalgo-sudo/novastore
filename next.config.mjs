import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://hxdgejfcctehqxahnocx.supabase.co";
}
if (!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) {
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_dCa0H12rWggzh-Ev3VF4Kg_M5iv4hjB";
}
if (!process.env.AUTH_SECRET) {
  process.env.AUTH_SECRET = "9cd9c54dd5e8ec15a4aa3d5261b021519bb9260340b1b95d74eb744caece394f";
}

const nextConfig = {
  reactCompiler: true,
  turbopack: {
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
