import type { MetaFunction, LinksFunction } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Lia's 5th Birthday",
  viewport: "width=device-width,initial-scale=1",
  robots: "noindex",
});

export const links: LinksFunction = () => {
  return [
    { rel: "icon", href: "favicon.svg", type: "image/svg+xml" },
    { rel: "icon", href: "favicon.png", type: "image/png" },
  ];
};


export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/CustomEase.min.js"></script>
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
