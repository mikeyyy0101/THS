"use client";

import { Provider as ReduxProvider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { store } from "./redux/store";
import { AuthProvider } from "./context/AuthContext";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/firebase";

// Create a component to handle Firebase auth state
function AuthListener({ children }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch({ type: "auth/setCurrentUser", payload: user });
      } else {
        dispatch({ type: "auth/setCurrentUser", payload: null });
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return children;
}

export default function Providers({ children }) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>
        <AuthListener>{children}</AuthListener>
      </AuthProvider>
    </ReduxProvider>
  );
}
