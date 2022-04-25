import { init } from "next-firebase-auth";
import absoluteUrl from "next-absolute-url";

const TWELVE_DAYS_IN_MS = 12 * 60 * 60 * 24 * 1000;

const initAuth = () => {
  init({
    debug: false, // # TODO : CHANGE FALSE
    // authPageURL: "/auth",
    authPageURL: ({ ctx }) => {
      const isServerSide = typeof window === "undefined";

      const origin = isServerSide ? absoluteUrl(ctx.req).origin : window.location.origin;

      const destPath = isServerSide ? ctx.resolvedUrl : window.location.href;

      const destUrl = new URL(destPath, origin);
      return `/auth?redirect=${encodeURIComponent(destUrl.href)}`;
    },
    // appPageURL: "/",
    appPageURL: ({ ctx }) => {
      const isServerSide = typeof window === "undefined";

      const origin = isServerSide ? absoluteUrl(ctx.req).origin : window.location.origin;

      const params = isServerSide
        ? new URL(ctx.req.url, origin).searchParams
        : new URLSearchParams(window.location.search);

      const destinationParamVal = params.get("redirect")
        ? decodeURIComponent(params.get("redirect"))
        : undefined;

      let destUrl = "/";

      if (destinationParamVal) {
        const allowedHosts = [
          "localhost:3000",
          "secretdesanciens.fr",
          "sda-recruitment.vercel.app",
        ];
        const allowed = allowedHosts.includes(new URL(destinationParamVal).host);
        if (allowed) destUrl = destinationParamVal;
        else console.warn("Redirect to non-allowed host:", destinationParamVal);
      }

      return destUrl;
    },
    loginAPIEndpoint: "/api/login",
    logoutAPIEndpoint: "/api/logout",
    firebaseAdminInitConfig: {
      credential: {
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY
          ? JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY)
          : undefined,
      },
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    },
    firebaseClientInitConfig: {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    },
    cookies: {
      name: "SecretDesAnciens",
      keys: [process.env.COOKIE_SECRET_CURRENT, process.env.COOKIE_SECRET_PREVIOUS],
      httpOnly: true,
      maxAge: TWELVE_DAYS_IN_MS,
      overwrite: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NEXT_PUBLIC_COOKIE_SECURE === "true",
      signed: true,
    },
  });
};

export default initAuth;
