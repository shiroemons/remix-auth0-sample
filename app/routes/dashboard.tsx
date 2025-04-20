import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import { requireUser } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  // ユーザーが認証されていない場合は/loginにリダイレクト
  const user = await requireUser(request);
  return { user };
}

export default function Dashboard() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen">
      {/* カードコンテナ */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-base font-medium text-gray-800 mb-6">ダッシュボード</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* ユーザープロフィールカード */}
          {user && (
            <div className="bg-white border border-gray-100 rounded-lg p-6 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4 overflow-hidden">
                {user.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-lg">名前なし</span>
                )}
              </div>
              <h3 className="text-base font-medium text-gray-900">{user.name || '名前なし'}</h3>
              <div className="flex items-center justify-between w-full mt-6 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500">アカウント状態</span>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded">アクティブ</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}