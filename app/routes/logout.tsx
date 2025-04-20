import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

// サーバー側のloaderで実行される処理
export async function loader({ request }: LoaderFunctionArgs) {
  // サーバー側のモジュールをここでインポートする
  const { sessionStorage } = await import("~/services/auth.server");
  
  // セッションを取得して破棄する
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  
  // Auth0のドメインを取得
  const auth0Domain = process.env.AUTH0_DOMAIN;
  const clientId = process.env.AUTH0_CLIENT_ID;
  
  // アプリケーションのルートURL（ログアウト後のリダイレクト先）
  const returnTo = new URL("/login", request.url).toString();
  
  // Auth0のログアウトURLを構築
  const logoutURL = `https://${auth0Domain}/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(returnTo)}`;
  
  // まずRemixのセッションを破棄し、次にAuth0のログアウトURLにリダイレクト
  return redirect(logoutURL, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// サーバー側のactionで実行される処理
export async function action(args: ActionFunctionArgs) {
  // loaderと同じ処理を実行
  return loader(args as unknown as LoaderFunctionArgs);
}

// クライアント側のコンポーネント（空）
export default function LogoutRoute() {
  return null;
}