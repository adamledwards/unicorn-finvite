import { LoaderArgs, redirect } from "@remix-run/node";
import { generators } from "openid-client";
import { getClient } from "~/utils/auth.server";
import { commitSession, getSession } from "~/utils/session.server";

export async function loader(args: LoaderArgs) {
  const client = await getClient();

  const code_verifier = generators.codeVerifier();

  const code_challenge = generators.codeChallenge(code_verifier);
  const session = await getSession(args.request.headers.get("cookie"));
  session.set("code", code_verifier);

  const authorizationUrl = client.authorizationUrl({
    scope: "openid email profile",
    code_challenge,
    code_challenge_method: "S256",
  });
  if (!process.env.ISSUER_BASE_URL) {
    throw new Response("Configuration Issue", { status: 500 });
  }

  return redirect(authorizationUrl, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}
