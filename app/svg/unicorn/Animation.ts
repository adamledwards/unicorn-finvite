type Timeline = ReturnType<typeof gsap.timeline>;
class Animation {
  eyeTimeline: Timeline;
  waveTimeline: Timeline;
  headTimeline: Timeline;
  toeTimeline: Timeline;
  tearDrop: Timeline;
  timeoutId?: number;
  wiggle: gsap.EaseFunction;

  constructor() {
    if (typeof document === "undefined") {
      new Error("Client only code");
    }
    this.eyeTimeline = gsap.timeline({ repeat: -1, repeatDelay: 3, paused: true });
    this.waveTimeline = gsap.timeline({ paused: true });
    this.headTimeline = gsap.timeline({ paused: true });
    this.toeTimeline = gsap.timeline({ paused: true });
    this.tearDrop = gsap.timeline({ repeat: -1, yoyo: true });

    this.wiggle = CustomEase.create(
      "wiggle",
      "M0,0 C0.041,0 0.083,1 0.166,1 0.333,1 0.333,0 0.5,0 0.666,0 0.666,1 0.833,1 0.916,1 0.916,0 1,0 ",
    ) as gsap.EaseFunction;

    this.eyeBlink();
    this.head();
    this.wave();
    this.toesWiggle();
  }

  private eyeBlink() {
    gsap.set(".eyes", {
      transformOrigin: "50% 50%",
    });
    this.eyeTimeline.to(".eyes", { scaleY: 1 }).addLabel("eye-closing");
    this.eyeTimeline.to(".eyes", { scaleY: 0, duration: 0.05 }, "eye-closing");
    this.eyeTimeline.to(".eyes", { scaleY: 1, duration: 0.05 });
  }

  start() {
    this.eyeTimeline.play();
  }

  runWaveAnimation() {
    gsap.set(".teardrop", {
      opacity: 0,
    });
    this.headPlay();
    this.wavePlay().eventCallback("onComplete", () => {
      this.toesWigglePlay().eventCallback("onComplete", () => {
        this.timeoutId = window.setTimeout(() => {
          this.runWaveAnimation();
        }, 2000);
      });
    });
  }

  runSadAnimation() {
    gsap.set("#right-foot", {
      rotation: 0,
      transformOrigin: "100% 50%",
      scaleX: -1,
      scaleY: 1,
    });
    gsap.set("#left-foot", {
      rotation: 0,
      transformOrigin: "100% 50%",
    });
    gsap.set("#mouth", {
      transformOrigin: "50% 50%",
      y: 3,
      rotate: "180deg",
      attr: {
        href: "#closed-mouth",
      },
    });

    gsap.to("#right-foot", {
      rotation: 0,
    });
    gsap.to("#left-foot", {
      rotation: 0,
    });

    gsap.to("#right-leg-full", {
      rotate: "0deg",
    });
    gsap.to("#left-leg-full", {
      rotate: "0deg",
    });
    gsap.set(".teardrop", {
      opacity: 1,
    });
    gsap.to(".eyebrows", {
      y: 4,
      duration: 0.5,
    });

    this.tearDrop.fromTo(".teardrop", { scaleY: 1, duration: 0.05 }, { scaleY: 0.6, duration: 0.05 });
  }

  headPlay() {
    gsap.set("#HeadGroup", {
      transformOrigin: "50% 50%",
    });

    return this.headTimeline.play(0);
  }

  head() {
    gsap.set(".eyebrows", {
      y: 0,
    });
    gsap.set("#mouth", {
      transformOrigin: "50% 50%",
      y: 0,
      rotate: "0",
      attr: {
        href: "#closed-mouth",
      },
    });

    this.headTimeline.to("#HeadGroup", {
      rotate: 0,
    }).addLabel("start");
    this.headTimeline.to("#HeadGroup", {
      rotate: "2deg",
    });

    this.headTimeline.to("#HeadGroup", {
      rotate: "-2deg",
    });
    this.headTimeline.to("#HeadGroup", {
      rotate: 0,
    }).add("end");

    this.headTimeline.to(".eyebrows", {
      y: -2,
      duration: 0.5,
    }, "start").to(".eyebrows", { y: 0, duration: 0.5, delay: 1 });

    this.headTimeline.to("#mouth", {
      attr: {
        href: "#open-mouth",
      },
    }, "start");

    this.headTimeline.to("#mouth", {
      attr: {
        href: "#closed-mouth",
      },
    }, "end");
  }

  wavePlay() {
    gsap.set("#right-leg-full", {
      rotate: "0deg",
      transformOrigin: "0% 0%",
    });
    gsap.set("#left-leg-full", {
      rotate: "0deg",
      transformOrigin: "100% 0%",
    });
    return this.waveTimeline.play(0);
  }

  wave() {
    this.waveTimeline.to("#right-leg-full", {
      rotate: "0deg",
      duration: 0.2,
    });

    this.waveTimeline.to("#right-leg-full", {
      rotate: "-5deg",
      duration: 0.5,
    });
    this.waveTimeline.to("#right-leg-full", {
      rotate: "-45deg",
      duration: 0.4,
    });

    this.waveTimeline.to("#right-leg-full", {
      rotate: "-30deg",
      duration: 0.2,
    });
    this.waveTimeline.to("#right-leg-full", {
      rotate: "-45deg",
      duration: 0.2,
    });
    this.waveTimeline.to("#right-leg-full", {
      rotate: "-30deg",
      duration: 0.2,
    });
    this.waveTimeline.to("#right-leg-full", {
      rotate: "-45deg",
      duration: 0.2,
    }).addLabel("waveEnd");
    this.waveTimeline.to("#right-leg-full", {
      rotate: "0deg",
      duration: 0.5,
    });

    this.waveTimeline.to("#left-leg-full", {
      rotate: "5deg",
      duration: 0.5,
    }, 0).to("#left-leg-full", {
      rotate: "0deg",
      duration: 0.5,
    }, "waveEnd");
    this.waveTimeline.delay(1);
  }

  toesWigglePlay() {
    gsap.set("#right-foot", {
      rotation: 0,
      transformOrigin: "100% 50%",
      scaleX: -1,
      scaleY: 1,
    });
    gsap.set("#left-foot", {
      rotation: 0,
      transformOrigin: "100% 50%",
    });
    this.waveTimeline.paused(true);
    this.waveTimeline.seek(0, true);

    return this.toeTimeline.play(0);
  }

  toesWiggle() {
    this.toeTimeline.to(this.waveTimeline, { time: 0.5 });
    this.toeTimeline.to("#right-foot", {
      rotation: -20,
      duration: 1,

      ease: this.wiggle,
    }, 0.5).addLabel("middle");
    this.toeTimeline.to("#right-foot", {
      rotation: 5,
      duration: 0.2,
    }).addLabel("end");

    this.toeTimeline.to("#right-foot", {
      rotation: 0,
      duration: 0.2,
    });

    this.toeTimeline.to("#left-foot", {
      rotation: 20,
      duration: 1,

      ease: this.wiggle,
    }, 0.5);
    this.toeTimeline.to("#left-foot", {
      rotation: -5,
      duration: 0.2,
    }, "middle");
    this.toeTimeline.to("#left-foot", {
      rotation: 0,
      duration: 0.2,
    }, "end");
    this.toeTimeline.to(this.waveTimeline, { time: 0 }, "middle");
  }
  destroy() {
    window.clearTimeout(this.timeoutId);

    this.eyeTimeline.kill();
    this.headTimeline.kill();
    this.waveTimeline.kill();
    this.toeTimeline.kill();
    this.tearDrop.kill();
  }
}

export default Animation;
