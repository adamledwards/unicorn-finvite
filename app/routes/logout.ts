import { LoaderArgs, redirect } from "@remix-run/node";
import { decodeToken, getClient, requiresAuth } from "~/utils/auth.server";
import { destroySession, getSession } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  await requiresAuth(request);
  const session = await getSession(
    request.headers.get("Cookie"),
  );
  const client = await getClient();
  const token = session.get("token");

  const tokenSet = decodeToken(token);

  await client.revoke(tokenSet.access_token!);

  return redirect(
    `${process.env.ISSUER_BASE_URL}/v2/logout?federated&client_id=${process.env.CLIENT_ID}&returnTo=${process.env.BASE_URL}/login`,
    {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    },
  );
}
