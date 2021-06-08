import React, { useCallback, useEffect, useReducer } from "react";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseInit from "../firebase";

const SET_USER = "SET_USER";
const UNSET_USER = "UNSET_USER";

const authReducer = (state, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        isLoading: false,
        user: (action.user && action.user.attributes) || null,
      };
    case UNSET_USER:
      return { ...state, isLoading: false, user: null };
    default:
      throw new Error(`Invalid action type: ${action.type}`);
  }
};

export const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { isLoading: true, user: null });

  const isSignedIn = !!(state.user && state.user.sub);
  const userId = (state.user && state.user.sub) || null;

  const setUser = useCallback((user) => dispatch({ type: SET_USER, user }), []);
  const unsetUser = useCallback(() => dispatch({ type: UNSET_USER }), []);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) setUser(user);
    else unsetUser();
  });

  return (
    <AuthContext.Provider value={{ isSignedIn, userId, userAttrs: state.user, setUser, unsetUser }}>
      {state.isLoading ? <div>Loading ...</div> : children}
    </AuthContext.Provider>
  );
};
