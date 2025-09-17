"use client";

import { Provider as ReduxProvider } from "react-redux";
import { store } from "./redux/store";
import { AuthProvider } from "./context/AuthContext";

export default function Providers({ children }) {
  return (
    <ReduxProvider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </ReduxProvider>
  );
}
