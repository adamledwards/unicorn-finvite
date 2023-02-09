import { createCookieSessionStorage } from "@remix-run/node";


const getSecret = () => {
  if (process.env.NODE_ENV === 'production') {
    return process.env.SECRET_SESSION_KEY ? process.env.SECRET_SESSION_KEY : (() => { throw new Error('Missing key') })()
  }
  return 's3cret1'
}


const { getSession, destroySession, commitSession } = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 60 * 60,
    path: "/",
    sameSite: "lax",
    secrets: [getSecret()],
    secure: true,
  },
});
export { commitSession, destroySession, getSession };
