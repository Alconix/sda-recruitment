import { createContext, useEffect, useState, useContext } from "react";
import nookies from "nookies";

import { auth } from "../firebase/admin";
import firebase from "../firebase";

const AuthContext = createContext({
  user: null,
});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);

  // listen for token changes
  // call setUser and write new token as a cookie
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).nookies = nookies;
    }

    return firebase.auth().onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.set(undefined, "token", "", { path: "/" });
        nookies.destroy(null, "token");
      } else {
        const token = await user.getIdToken();
        setUser(user);
        nookies.destroy(null, "token");
        nookies.set(undefined, "token", token, { path: "/" });
      }
    });
  }, []);

  // force refresh the token every 10 minutes
  useEffect(() => {
    const handle = setInterval(async () => {
      const user = firebase.auth().currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    // clean up setInterval
    return () => clearInterval(handle);
  }, []);

  return <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  return useContext(AuthContext);
};
