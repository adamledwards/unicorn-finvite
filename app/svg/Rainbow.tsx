import { useEffect, useRef } from "react";
import { SVGProps } from "react";
import Cloud from "~/svg/Cloud";

const Rainbow = (props: SVGProps<SVGSVGElement>) => {
  const rainbowEl = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const timeline = gsap.timeline({ paused: true });
    if (rainbowEl.current) {
      const paths = rainbowEl.current.querySelectorAll("path");
      gsap.set(rainbowEl.current, { opacity: 1 });
      gsap.set("#rainbowCloudPath", { opacity: 1 });
      timeline.addLabel("start", 0);
      timeline.to("#rainbow-cloud-1", {
        opacity: 1,
        duration: 0.3,
      }, "start");

      Array.from(paths).forEach((path) => {
        const length = path.getTotalLength();

        gsap.set(path, {
          attr: {
            "stroke-dashoffset": length,
            "stroke-dasharray": length,
          },
        });
        timeline.to(path, {
          attr: {
            "stroke-dashoffset": 0,
            "stroke-dasharray": length,
          },
          duration: 3,
          delay: 1,
        }, "start<");
      });

      timeline.to("#rainbow-cloud-2", {
        opacity: 1,
        duration: 0.3,
      }, "start");

      timeline.play();
    }
    return () => {
      timeline.kill();
    };
  }, []);
  return (
    <svg
      ref={rainbowEl}
      viewBox="0 0 470 200"
      className="rainbow"
      opacity={0}
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      {...props}
    >
      <defs>
        <Cloud id="rainbowCloud" />
      </defs>
      <g
        fill="none"
        id="rainbowCloudPath"
        fillRule="evenodd"
        transform="translate(60,0)"
        strokeWidth={12.525}
        opacity={0}
      >
        <path
          d="M7 182C7 85.35 85.574 7 182.5 7S358 85.35 358 182"
          stroke="#F2B5D3"
        />
        <path
          d="M19.536 182c0-89.746 72.961-162.5 162.964-162.5S345.464 92.254 345.464 182"
          stroke="#FBE3B1"
        />
        <path
          d="M32.071 182c0-82.843 67.35-150 150.429-150 83.08 0 150.429 67.157 150.429 150"
          stroke="#FEF2A9"
        />
        <path
          d="M44.607 182c0-75.94 61.737-137.5 137.893-137.5S320.393 106.06 320.393 182"
          stroke="#CFE7B7"
        />
        <path
          d="M57.143 182c0-69.036 56.124-125 125.357-125s125.357 55.964 125.357 125"
          stroke="#B6E4EF"
        />
      </g>
      <g>
        <use opacity="0" id="rainbow-cloud-1" href="#rainbowCloud" width="155" height="91" y="110" x="10" fill="red" />

        <use
          opacity="0"
          id="rainbow-cloud-2"
          href="#rainbowCloud"
          transform="scale(-1,1) translate(-155,0) "
          width="155"
          height="91"
          y="110"
          x="-300"
          fill="red"
        />
      </g>
    </svg>
  );
};

export default Rainbow;
