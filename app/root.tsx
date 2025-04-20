import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
} from "react-router";
import type { LinksFunction, LoaderFunctionArgs } from "react-router";
import { authenticator } from "~/services/auth.server";

import appStyles from "~/app.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
];

export async function loader({ request }: LoaderFunctionArgs) {
  // ユーザーの認証状態を確認
  try {
    // @ts-ignore - authenticate関数の型の問題を回避
    const user = await authenticator.authenticate("auth0", request);
    return { user, isAuthenticated: true };
  } catch (error) {
    // 認証されていない場合
    return { user: null, isAuthenticated: false };
  }
}

export default function App() {
  const { isAuthenticated } = useLoaderData<typeof loader>();
  const location = useLocation();
  
  // ログインページではヘッダーを表示しない
  const isLoginPage = location.pathname === "/login";

  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={isLoginPage ? "" : "min-h-screen bg-gray-50 dark:bg-gray-900"}>
        {!isLoginPage && (
          <header className="bg-white dark:bg-gray-800 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <nav className="flex justify-between h-16 items-center">
                <div className="flex items-center space-x-8">
                  <Link to="/" className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm transition-colors">ホーム</Link>
                  {isAuthenticated && (
                    <Link to="/dashboard" className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm transition-colors">ダッシュボード</Link>
                  )}
                </div>
                <div>
                  {isAuthenticated ? (
                    <Link to="/logout" className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">ログアウト</Link>
                  ) : (
                    <Link to="/login" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">ログイン</Link>
                  )}
                </div>
              </nav>
            </div>
          </header>
        )}
        <main className={isLoginPage ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"}>
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}