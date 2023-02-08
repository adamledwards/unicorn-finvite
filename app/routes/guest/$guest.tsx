import { ActionArgs, json, LinksFunction, LoaderArgs } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import confetti from "canvas-confetti";

import { useEffect, useRef, useState } from "react";
import Invite from "~/components/Invite";

import FeedbackForm from "~/components/FeedbackForm";
import appStyles from "~/styles/App.css";
import globalStyles from "~/styles/index.css";
import { getInvite, updateRSVPInvite } from "~/utils/api/guest.server";

export const links: LinksFunction = () => {
  return [
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
    await updateRSVPInvite(id, rsvp === "yes");
  }
  return json({
    success: true,
  });
};

function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [finished, setDone] = useState(false);
  useEffect(() => {
    const runConfetti = async () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const myConfetti = confetti.create(canvas, {
          resize: true,
          useWorker: true,
        });
        await myConfetti({
          particleCount: 100,
          spread: 160,
        });

        setDone(true);
      }
    };

    runConfetti();
  }, []);
  return finished ? null : <canvas ref={canvasRef} style={{ inset: 0, position: "absolute", width: "100%" }} />;
}
export default function Index() {
  const { guest } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  const [rsvp, setRsvp] = useState<boolean | null>(guest.attending);

  return (
    <>
      <Invite
        rsvp={rsvp}
        guest={guest}
      >
        <FeedbackForm
          rsvp={rsvp}
          onRsvpChange={(newRsvp) => {
            setRsvp(newRsvp);
          }}
          guest={guest}
        />

        {data?.success && <Confetti />}
      </Invite>
    </>
  );
}
