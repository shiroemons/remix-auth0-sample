import type { LoaderFunctionArgs } from "react-router";
import { redirect } from "react-router";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // Auth0からリダイレクトされた後の処理
  try {
    // @ts-ignore - authenticate関数の型の問題を回避
    await authenticator.authenticate("auth0", request);
    return redirect("/dashboard");
  } catch (error) {
    return redirect("/login");
  }
}