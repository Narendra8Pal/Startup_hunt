import React from "react";
import { useEffect } from "react";
import { useRouter } from "next/router";

import Sidebar from "@/utils/sidebar";
import Explore from "./index";

//redux
import { useDispatch } from "react-redux";
import { setUser } from "@/store/userName";
import { setUsersDocId } from "@/store/usersDocId";

//firebase
import { collection, doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import FirebaseApp from "../../utils/firebase";

const startupName = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { docId } = router.query;

  const db = getFirestore(FirebaseApp);
  const docRef = doc(db, "users", `${docId}`);

  useEffect(() => {
    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const name = docSnap.data().username;
          dispatch(setUser(name));
        }
      })
      .catch((error) => {
        console.error("Error getting document: ", error);
      });
    dispatch(setUsersDocId(docId));
  }, [docId]);

  return (
    <div>
      <Explore />
    </div>
  );
};

export default startupName;
