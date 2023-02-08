import { Guest } from "@prisma/client";
import { Form } from "@remix-run/react";

type InviteProps = {
  rsvp: boolean | null;
  name?: string;
  onRsvpChange: (rsvp: boolean) => void;
  guest: Guest;
};

export default function FeedbackForm({ rsvp, onRsvpChange, guest }: InviteProps) {
  return (
    <div className="RSVP__content">
      {guest.attending === null
        && (
          <>
            Please RSVP
            <Form method="put">
              <div>
                <input
                  required
                  checked={rsvp === true}
                  type="radio"
                  id="rsvpYes"
                  name="rsvp"
                  value="yes"
                  onChange={(evt) => {
                    if (evt.target.checked) {
                      onRsvpChange(true);
                    }
                  }}
                />
                <label htmlFor="rsvpYes">Yes, I can attend 🎉</label>
              </div>
              <div>
                <input
                  required
                  checked={rsvp === false}
                  onChange={(evt) => {
                    if (evt.target.checked) {
                      onRsvpChange(false);
                    }
                  }}
                  type="radio"
                  id="rsvpNo"
                  name="rsvp"
                  value="no"
                />
                <label htmlFor="rsvpNo">No, I cannot attend 😞</label>
              </div>
              <input type="hidden" name="id" value={guest.id} />
              <button type="submit">Submit</button>
            </Form>
          </>
        )}
      {guest.attending
        && <>We look forward to seeing you soon.</>}
      {guest.attending === false
        && <>That's a shame, you will be missed!</>}
      <br />
      Contact Sophie on <a href="https://wa.me/447939950966">07939950966</a>
    </div>
  );
}
