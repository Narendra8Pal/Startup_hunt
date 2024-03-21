// next.js, files, style
import React from "react";
import Sidebar from "@/utils/sidebar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Tasks from "../index";
import styles from "@/styles/tasks.module.css";
//redux
import { setUser } from "@/store/userName";
import { setUsersDocId } from "@/store/usersDocId";
import { useDispatch } from "react-redux";
import { setShowDocIdIcon } from "@/store/docIdIcon";

//firebase
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import FirebaseApp from "../../../utils/firebase";

const TasksId = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { docId, Id } = router.query;

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
    dispatch(setShowDocIdIcon(false));
  }, [docId]);

  return (
    <>
      <Sidebar />
      <Tasks Id={Id} />
    </>
  );
};

export default TasksId;
