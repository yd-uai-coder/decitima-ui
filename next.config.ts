import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import path from "node:path";

// 全ページに付けるセキュリティヘッダ。フロントは全ページ SSG でトークンをブラウザの
// localStorage に持つため、XSS の足掛かり(他サイトへの埋め込み・MIME 推測・外部への
// フォーム送信)を減らす。CSP はまず「インライン script/style に依存しない」ディレクティブ
// だけを強制する(Next.js / Tamagui はインラインの script・style を使うため、
// script-src / style-src を絞る CSP は nonce 対応を入れてから別途導入する)。
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  turbopack: {
    // Prevents Next.js from misdetecting an unrelated ancestor directory
    // (one that happens to contain its own package-lock.json) as the
    // workspace root, which otherwise causes duplicate React copies.
    root: path.dirname(fileURLToPath(import.meta.url)),
  },
};

export default nextConfig;
