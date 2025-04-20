import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";
import { createCookieSessionStorage } from "react-router";

// ユーザータイプの定義
export type User = {
  id: string;
  email: string;
  name: string;
  picture: string;
  accessToken: string;
  refreshToken?: string | null;
};

// セッションストレージの設定
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__auth_session",
    secrets: [process.env.SESSION_SECRET || "s3cr3t"], // 実際の環境では適切なシークレットに変更してください
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30日
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  },
});

// 認証インスタンスの作成
// @ts-ignore - Authenticatorの型定義の問題を回避
export const authenticator = new Authenticator<User>(sessionStorage);

// Auth0ストラテジーの設定
// @ts-ignore - Auth0Strategyのタイプ定義に問題がある場合の一時的な対処
const auth0Strategy = new Auth0Strategy<User>(
  {
    domain: process.env.AUTH0_DOMAIN || "",
    clientId: process.env.AUTH0_CLIENT_ID || "",
    clientSecret: process.env.AUTH0_CLIENT_SECRET || "",
    redirectURI: process.env.AUTH0_CALLBACK_URL || "http://localhost:3000/auth/auth0/callback",
    scopes: ["openid", "email", "profile", "offline_access"],
  },
  // @ts-ignore - コールバック関数の型の問題を回避
  async (
    accessToken: string,
    refreshToken: string | null,
    profile: any
  ) => {
    // Auth0から返されたトークンとプロファイル情報からユーザーオブジェクトを作成
    return {
      id: profile.id,
      email: profile.emails?.[0]?.value || "",
      name: profile.displayName || "",
      picture: profile.photos?.[0]?.value || "",
      accessToken,
      refreshToken,
    };
  }
);

// 認証インスタンスにAuth0ストラテジーを追加
// @ts-ignore - use関数の型の問題を回避
authenticator.use(auth0Strategy);

// ユーザー認証ヘルパー関数
export async function requireUser(request: Request, redirectTo: string = "/login") {
  try {
    // @ts-ignore - authenticate関数の型の問題を回避
    return await authenticator.authenticate("auth0", request);
  } catch (error) {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams([["redirectTo", url.pathname]]);
    throw new Response(null, {
      status: 302,
      headers: {
        Location: `${redirectTo}?${searchParams}`,
      },
    });
  }
}