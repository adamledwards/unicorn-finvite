import { LinksFunction } from "@remix-run/node";
import Invite from "~/components/Invite";

import appStyles from "~/styles/App.css";
import globalStyles from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap" },
    { rel: "stylesheet", href: globalStyles },
    { rel: "stylesheet", href: appStyles },
  ];
};

export default function Index() {
  return (
    <Invite
      rsvp={null}
    />
  );
}
