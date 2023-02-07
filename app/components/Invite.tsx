import { Guest } from "@prisma/client";
import { Form } from "@remix-run/react";
import Clouds from "~/svg/Clouds";
import Rainbow from "~/svg/Rainbow";
import Unicorn from "~/svg/unicorn";

type InviteProps = {
  rsvp: boolean | null;
  guest?: Guest;
  children?: React.ReactNode;
};
export default function Invite({ rsvp, guest, children }: InviteProps) {
  return (
    <div className="App">
      <section>
        <header className="header">
          <div>
            <p className="name__at">{guest?.name || "Please"}</p>
            <p className="small">Join us for a</p>
          </div>
          <svg viewBox="0 0 85 20" width={220} xmlns="http://www.w3.org/2000/svg">
            <path
              id="MyPath"
              fill="none"
              stroke="none"
              d="M10,20 Q37.5 0, 75 20"
            />
            <text>
              <textPath href="#MyPath" fontFamily="'Baloo 2', cursive" style={{ fill: "var(--text-color)" }}>
                FUN TIME
              </textPath>
            </text>
          </svg>
          <div className="name">
            <span className="name__at">at</span>
            <span className="name__name">Lia's</span>
          </div>
          <span className="text__birthday">5th birthday party</span>
        </header>
        <div className="stage">
          <Rainbow />
          <Unicorn sad={rsvp === false} className="unicorn" />
        </div>
      </section>
      <section>
        <main className="main">
          <div className="detail">
            <div className="date">
              <span className="date__month">April</span>
              <span className="date large">15</span>
              <span className="date__day">Saturday</span>
            </div>
            <div className="address">
              Jump In<br />
              22, Lumina park<br />Lumina Way,<br />Enfield EN1 1FS<br />
            </div>
            <div className="time">
              <span className="time_title">Time</span>
              <span className="time_time large">11 am</span>
            </div>
          </div>
          <div className="RSVP">
            <Clouds />
            {children}
          </div>
        </main>
      </section>
    </div>
  );
}
