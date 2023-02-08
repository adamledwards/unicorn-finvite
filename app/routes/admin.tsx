import { Prisma } from "@prisma/client";
import { ActionArgs, json, LinksFunction, LoaderArgs, redirect, Response } from "@remix-run/node";
import { Form, Outlet, useActionData, useLoaderData } from "@remix-run/react";
import stylesUrl from "~/styles/admin.css";
import { createInvite, deleteInvite, getInvites } from "~/utils/api/guest.server";
import { requiresAuth } from "~/utils/auth.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: stylesUrl },
  ];
};

export async function loader({ request }: LoaderArgs) {
  await requiresAuth(request);
  return json({
    guests: await getInvites(),
  });
}

export async function action({ request }: ActionArgs) {
  await requiresAuth(request);
  const data = await request.formData();
  const name = data.get("name") as string;
  const id = data.get("__delete") as string;

  let error: {
    message: string;
    status: number;
  } | undefined;

  if (request.method === "POST") {
    try {
      if (!name) {
        throw new Error("MISSING_VALUE");
      }
      await createInvite(name);
    } catch (e) {
      error = {
        message: "unknown",
        status: 500,
      };
      const prismaError = e instanceof Prisma.PrismaClientKnownRequestError;
      if (prismaError && e.code === "P2002") {
        error.status = 400;
        error.message = `${name} is has already been invited`;
      }
      if (prismaError && e.code === "P2011" || e instanceof Error && e.message === "MISSING_VALUE") {
        error.status = 400;
        error.message = `Name cannot be empty`;
      }
    }
  }

  if (request.method === "DELETE") {
    try {
      if (!id) {
        throw new Error("MISSING_VALUE");
      }
      await deleteInvite(id);
    } catch (e) {
      error = {
        message: "unknown",
        status: 500,
      };
    }
  }

  if (error) {
    return json({
      message: error.message,
    }, {
      status: error.status,
    });
  }
  return redirect("/admin/");
}

export default function Admin() {
  const { guests } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  const attendingText = (attending: Boolean | null) => {
    if (attending === null) {
      return "Not yet responded";
    }
    return attending ? "Yes" : "No";
  };

  return (
    <>
      {data?.message && <div className="error-box">{data.message}</div>}
      <header>
        <h2>Add Guest</h2>
      </header>
      <main>
        <div className="guest">
          <Form method="post" className="guest-form">
            <div>
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" />
            </div>
            <button type="submit">Add</button>
          </Form>
          <div className="guest-list">
            <ul>
              {guests.map(({ name, attending, id, slug }) => (
                <li key={id}>
                  <div className="guest-list-details">
                    <div className="guest-list-name">
                      {name}
                    </div>
                    <div className="guest-list-status">
                      {attendingText(attending)}
                    </div>
                  </div>
                  <div className="guest-list-action">
                    <button
                      onClick={() => {
                        navigator.share({
                          title: "Lia's 5th Birthday",
                          text: `We hope ${name} can make it`,
                          url: `${window.location.origin}/guest/${slug}/`,
                        });
                      }}
                      className="guest-list-status"
                    >
                      Share
                    </button>
                    <div>
                      <Form method="delete">
                        <button type="submit" className="danger" name="__delete" value={id}>Delete</button>
                      </Form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
