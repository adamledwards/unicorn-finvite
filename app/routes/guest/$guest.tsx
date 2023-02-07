import { ActionArgs, json, LinksFunction, LoaderArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import Invite from "~/components/Invite";
import { db } from "~/utils/db.server";

import appStyles from "~/styles/App.css";
import globalStyles from "~/styles/index.css";
import { getInvite, updateRSVPInvite } from "~/utils/api/guest.server";
import FeedbackForm from "~/components/FeedbackForm";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&display=swap" },
    { rel: "stylesheet", href: globalStyles },
    { rel: "stylesheet", href: appStyles },
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  try {
    return json({
      guest: await getInvite(params.guest),
    });
  } catch {
    throw new Response("Not Found", {
      status: 404,
    });
  }
};

export const action = async ({ request }: ActionArgs) => {
  const data = await request.formData();
  const id = data.get("id") as string;
  const rsvp = data.get("rsvp") as string;

  if (request.method === "PUT") {
    await updateRSVPInvite(parseInt(id), rsvp === "yes");
  }
  return json({
    success: true,
  });
};

export default function Index() {
  const { guest } = useLoaderData<typeof loader>();
  const [rsvp, setRsvp] = useState<boolean | null>(guest.attending);
  return (
    <Invite
      rsvp={rsvp}
      guest={guest}
    >
      <FeedbackForm rsvp={rsvp}
        onRsvpChange={(newRsvp) => {
          setRsvp(newRsvp);
        }}
        guest={guest} />
    </Invite>
  );
}
