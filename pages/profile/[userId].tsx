import React from "react";
import Sidebar from "@/utils/sidebar";
import Profile from "./index";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

//firebase
import { collection, doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import FirebaseApp from "../../utils/firebase";

const Username = () => {
  const router = useRouter();
  const { userId } = router.query;

  const [username, setUsername] = useState<string>("");

  const db = getFirestore(FirebaseApp);
  const docRef = doc(db, "users", `${userId}`);

  useEffect(() => {
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const name = docSnap.data().username;
          setUsername(name);
        } else {
          console.log("No such document!");
        }
      })
      .catch((error) => {
        console.error("Error getting document: ", error);
      });
  }, [userId]);

  return (
    <>
      <Sidebar />
      <Profile username={username} />
    </>
  );
};

export default Username;
