import type { ActionFunctionArgs } from "react-router";
import { authenticator } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  return authenticator.authenticate("auth0", request);
}