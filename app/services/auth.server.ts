import { Authenticator } from "remix-auth";
import { Auth0Strategy } from "remix-auth-auth0";
import { createCookieSessionStorage } from "react-router";
import { debug } from "~/utils/debug.server";

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

// ユーザーセッションのヘルパー関数
export async function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("cookie"));
}

// セッションへのユーザー情報保存
export async function setUserSession(request: Request, userId: string, userData: any) {
  const session = await getUserSession(request);
  session.set("userId", userId);
  session.set("userData", userData);
  
  // セッションが正しく設定されたかログ出力
  debug.log("セッション設定:", {
    hasUserId: !!session.get("userId"),
    hasUserData: !!session.get("userData"),
  });
  
  return session;
}

// 認証インスタンスの作成
// @ts-ignore - Authenticatorの型定義の問題を回避
export const authenticator = new Authenticator<User>(sessionStorage, {
  sessionKey: "userData", // セッションのキー
  sessionErrorKey: "authError", // エラー情報のキー
});

// セッションからユーザー情報を取得する関数
export async function isAuthenticated(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  const userData = session.get("userData");
  
  if (!userId || !userData) {
    debug.log("認証チェック: セッションにユーザー情報がありません");
    return null;
  }
  
  debug.log("認証チェック: ユーザー情報あり", {
    id: userData.id || "ID未設定",
    hasEmail: !!userData.email,
  });
  
  return userData as User;
}

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
  // @ts-ignore - VerifyOptions型の問題を回避
  async ({ tokens }) => {
    const userResponse = await fetch(
      `https://${process.env.AUTH0_DOMAIN}/userinfo`,
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken()}`,
        },
      },
    );

    if (!userResponse.ok) {
      throw new Error("Failed to fetch user data");
    }

    const userData = await userResponse.json();
    debug.log(userData);
    
    return {
      id: userData.sub,
      email: userData.email,
      name: userData.name,
      picture: userData.picture,
      accessToken: tokens.accessToken(),
      refreshToken: tokens.refreshToken(),
    };
  }
);

// 認証インスタンスにAuth0ストラテジーを追加
// @ts-ignore - use関数の型の問題を回避
authenticator.use(auth0Strategy);

// ユーザー認証ヘルパー関数
export async function requireUser(request: Request, redirectTo: string = "/login") {
  try {
    // まずセッションから認証済みユーザーを確認
    const sessionUser = await isAuthenticated(request);
    if (sessionUser) {
      debug.log("requireUser: セッションから認証済みユーザーを取得");
      return sessionUser;
    }
    
    // セッションにユーザーがなければAuth0で認証
    debug.log("requireUser: Auth0で認証を試行");
    
    // @ts-ignore - authenticate関数の型の問題を回避
    const user = await authenticator.authenticate("auth0", request);
    
    if (user) {
      // 認証成功したらセッションを更新
      debug.log("requireUser: 認証成功、セッションを更新");
      const session = await setUserSession(request, user.id, user);
      throw new Response(null, {
        status: 302,
        headers: {
          Location: request.url,
          "Set-Cookie": await sessionStorage.commitSession(session),
        },
      });
    }
    
    return user;
  } catch (error) {
    // エラーをログに出力
    debug.error("認証エラー:", error instanceof Error ? error.message : String(error));
    
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