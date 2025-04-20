import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { authenticator, sessionStorage, setUserSession } from "~/services/auth.server";
import { debug } from "~/utils/debug.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // Auth0からリダイレクトされた後の処理
  debug.log("Auth0コールバック処理開始:", request.url);
  
  // URLパラメータを抽出
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  debug.log("Auth0パラメータ:", { code: code?.substring(0, 10) + "...", state: state?.substring(0, 10) + "..." });
  
  try {
    // @ts-ignore - authenticate関数の型の問題を回避
    const user = await authenticator.authenticate("auth0", request);
    
    // ユーザー情報を安全にログに出力
    debug.log("Auth0ユーザー情報:", JSON.stringify({
      id: user?.id || "ID未設定",
      email: user?.email || "メールなし",
      name: user?.name || "名前なし",
      hasPicture: !!user?.picture,
      hasToken: !!user?.accessToken
    }));
    
    // セッションにユーザー情報を保存
    const session = await setUserSession(request, user.id, user);
    
    // セッションに保存されているデータを確認
    try {
      debug.log("セッションデータキー:", Object.keys(session.data || {}));
    } catch (sessionError) {
      debug.error("セッション取得エラー:", sessionError);
    }
    
    // ASCII文字のみを使用してリダイレクト
    return redirect("/dashboard", {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session)
      }
    });
  } catch (error) {
    // エラーオブジェクトの詳細な情報を出力
    debug.error("Auth0認証エラーの種類:", error instanceof Error ? error.constructor.name : typeof error);
    debug.error("Auth0認証エラー詳細:", error instanceof Error ? error.message : String(error));
    
    // Response型のエラーの場合、ステータスコードとヘッダーを出力
    if (error instanceof Response) {
      debug.error("Auth0認証エラーレスポンス:", {
        status: error.status,
        statusText: error.statusText,
        headers: Object.fromEntries([...error.headers.entries()]),
        type: error.type,
        url: error.url
      });
      
      // レスポンスボディを取得して表示（可能な場合）
      try {
        error.clone().text().then(text => {
          debug.error("Auth0エラーレスポンスボディ:", text);
        }).catch(e => {
          debug.error("ボディ読み取りエラー:", e);
        });
      } catch (bodyError) {
        debug.error("ボディ取得エラー:", bodyError);
      }
    }
    
    debug.error("Auth0認証エラースタック:", error instanceof Error ? error.stack : "スタックなし");
    
    // ASCII文字のみを使用してエラーメッセージを設定
    return redirect("/login?error=auth_failed");
  }
}