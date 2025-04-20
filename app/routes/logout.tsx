import type { ActionFunctionArgs, LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";

// サーバー側のloaderで実行される処理
export async function loader({ request }: LoaderFunctionArgs) {
  // サーバー側のモジュールをここでインポートする
  const { sessionStorage } = await import("~/services/auth.server");
  
  // セッションを取得して破棄する
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// サーバー側のactionで実行される処理
export async function action({ request }: ActionFunctionArgs) {
  // サーバー側のモジュールをここでインポートする
  const { sessionStorage } = await import("~/services/auth.server");
  
  // セッションを取得して破棄する
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// クライアント側のコンポーネント（空）
export default function LogoutRoute() {
  return null;
}