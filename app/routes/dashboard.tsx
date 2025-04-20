import { Form, useLoaderData } from "react-router";
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
    <div className="dashboard">
      <h1>ダッシュボード</h1>
      {user && (
        <div className="user-info">
          <img src={user.picture} alt={user.name} className="user-avatar" />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )}

      <Form method="post" action="/logout">
        <button type="submit" className="logout-button">ログアウト</button>
      </Form>
    </div>
  );
}