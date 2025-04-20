import { Form, useLoaderData } from "react-router";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { authenticator } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // すでに認証されている場合はリダイレクト
  try {
    // @ts-ignore - authenticate関数の型の問題を回避
    const user = await authenticator.authenticate("auth0", request);
    return redirect("/dashboard");
  } catch (error) {
    // 認証されていないので何もしない
  }

  // URLからエラーパラメータを取得
  const url = new URL(request.url);
  const error = url.searchParams.get("error");
  
  return { error };
}

export default function Login() {
  const { error } = useLoaderData<typeof loader>();

  return (
    <div className="login-container">
      <h1>ログイン</h1>
      {error && <div className="error">{error}</div>}

      <Form method="post" action="/auth/auth0">
        <button className="login-button" type="submit">
          Auth0でログイン
        </button>
      </Form>
    </div>
  );
}