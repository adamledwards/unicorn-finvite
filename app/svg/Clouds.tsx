import { SVGProps, useEffect, useRef } from "react";
import Cloud from "~/svg/Cloud";

const Clouds = (props: SVGProps<SVGSVGElement>) => {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const timeline = gsap.timeline({ repeat: -1, yoyo: true });

    if (ref.current) {
      ref.current.querySelectorAll(".right").forEach((el, i) => {
        timeline.to(el, { x: 200, duration: 100 }, i * 10);
      });

      ref.current.querySelectorAll(".left").forEach((el, i) => {
        timeline.to(el, { x: -200, duration: 100 }, i * 10);
      });
    }
    timeline.play();
    return () => {
      timeline.kill();
    };
  });

  return (
    <svg
      ref={ref}
      className="cloudBunch"
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="500"
      {...props}
    >
      <defs>
        <Cloud defId="cloudBunch" />
      </defs>
      <use href="#cloudBunch" className="right" fill="#C1E6FA" transform="scale(2,2)" opacity={0.7} />
      <use href="#cloudBunch" className="left" fill="#C1E6FA" transform="scale(2,2)" opacity={0.7} x="150" />
      <use href="#cloudBunch" className="right" transform="scale(3,3)" fill="#CDF1F1" y="30" />
      <use href="#cloudBunch" className="right" transform="scale(3,3)" fill="#CDF1F1" y="75" x="50" />
      <use href="#cloudBunch" className="right" fill="#C1E6FA" transform="scale(1.5,1.5)" y="100" />
      <use href="#cloudBunch" className="left" fill="#C1E6FA" transform="scale(1.5,1.5)" y="75" x="200" />
      <use href="#cloudBunch" className="left" fill="#C1E6FA" transform="scale(1.5,1.5)" y="150" x="150" />
    </svg>
  );
};

export default Clouds;
