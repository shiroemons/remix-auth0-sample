import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { LinksFunction } from "react-router";

import appStyles from "~/app.css?url";
import styles from "~/styles/auth.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: appStyles },
  { rel: "stylesheet", href: styles },
];

export default function App() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex justify-between h-16 items-center">
              <div className="flex items-center space-x-8">
                <Link to="/" className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm transition-colors">ホーム</Link>
                <Link to="/dashboard" className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-md text-sm transition-colors">ダッシュボード</Link>
              </div>
              <div>
                <Link to="/login" className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">ログイン</Link>
              </div>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Outlet />
        </main>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}