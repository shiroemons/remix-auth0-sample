import type { ActionFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { authenticator, sessionStorage } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  // セッションからユーザー情報を削除
  const session = await sessionStorage.getSession(request.headers.get("cookie"));
  
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}