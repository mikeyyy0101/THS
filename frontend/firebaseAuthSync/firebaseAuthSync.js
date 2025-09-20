import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../app/firebase/firebase"; // your firebase config
import { setCurrentUser } from "../app/redux/slices/authSlice"; // your redux action

export default function FirebaseAuthSync() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("✅ Firebase logged in user:", user.uid, user.email);
        dispatch(setCurrentUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        }));
      } else {
        console.log("⚠️ Firebase user logged out");
        dispatch(setCurrentUser(null));
      }
    });

    return () => unsubscribe(); // clean up listener
  }, [dispatch]);

  return null;
}
