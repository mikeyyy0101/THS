import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function DebugUser() {
  const currentUser = useSelector((state) => state.auth.currentUser);

  useEffect(() => {
    if (currentUser?.uid) {
      console.log("✅ Current User ID:", currentUser.uid);
    } else {
      console.log("⚠️ No user logged in");
    }
  }, [currentUser]);

  return null; // This component doesn't render anything
}
