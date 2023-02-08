import type gsap from "gsap";

declare global {
  interface Window {
    gsap: typeof gsap;
  }
  namespace NodeJS {
    interface ProcessEnv {
      CLIENT_ID: string;
      SECRET: string;
      BASE_URL: string;
      EMAIL_KEY: string
    }
  }
}
