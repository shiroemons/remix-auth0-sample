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
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center">
      <div className="w-full max-w-sm bg-white/20 backdrop-blur-md rounded-xl p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-white">ログイン</h2>
          <p className="text-white/80 text-sm mt-1">
            アカウントにアクセスするにはAuth0でログインしてください
          </p>
        </div>
        
        {error && (
          <div className="bg-red-400/30 border border-red-400/50 text-white rounded-lg p-3 mb-6">
            {error}
          </div>
        )}

        <Form method="post" action="/auth/auth0">
          <button 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
            type="submit"
          >
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-7-7h-4a7 7 0 0 0-7 7v1h2v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1z"/>
            </svg>
            Auth0でログイン
          </button>
        </Form>

        <div className="mt-6 text-white/60 text-xs text-center">
          アカウントをお持ちでない場合は、管理者にお問い合わせください
        </div>
      </div>
    </div>
  );
}