import { redirect } from "@remix-run/node";
import { BaseClient, Issuer, TokenSet, TokenSetParameters } from "openid-client";
import { getSession } from "./session.server";

let _client: BaseClient;
export async function getClient(): Promise<BaseClient> {
  if (!_client && process.env.ISSUER_BASE_URL) {
    const issuer = await Issuer.discover(process.env.ISSUER_BASE_URL);
    _client = new issuer.Client({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.SECRET,
      redirect_uris: [`${process.env.BASE_URL}/auth/callback`],
    });
  }
  return _client;
}

export function encodeToken(tokenSet: TokenSet) {
  return Buffer.from(JSON.stringify(tokenSet)).toString("base64");
}

export function decodeToken(str: string): TokenSet {
  const tokenString = Buffer.from(str, "base64").toString("utf-8");
  const tokenJson = JSON.parse(tokenString) as TokenSetParameters;
  return new TokenSet(tokenJson);
}

export async function requiresAuth(request: Request) {
  const session = await getSession(request.headers.get("cookie"));
  if (!session.has("token") || decodeToken(session.get("token")).expired()) {
    throw redirect("/login");
  }
}
