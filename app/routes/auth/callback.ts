import { json, LoaderArgs, redirect } from "@remix-run/node";
import { generators, TokenSet } from "openid-client";
import { encodeToken, getClient } from "~/utils/auth.server";
import { commitSession, getSession } from "~/utils/session.server";

export async function loader({ request }: LoaderArgs) {
  const session = await getSession(
    request.headers.get("Cookie"),
  );
  const client = await getClient();
  const params = client.callbackParams(request.url);
  if (!session.has("code")) {
    throw new Response("Configuration Issue", { status: 500 });
  }
  const code_verifier = session.get("code") as string;

  const tokenSet = await client.callback(`${process.env.BASE_URL}/callback`, params, { code_verifier });

  session.set("token", encodeToken(tokenSet));

  return redirect("/admin", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
