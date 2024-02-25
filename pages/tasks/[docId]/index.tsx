// next.js, files, style
import React from "react";
import Sidebar from "@/utils/sidebar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Tasks from "../index";
import styles from '@/styles/tasks.module.css'
//redux
import { setUser } from "@/store/userName";
import { setUsersDocId } from "@/store/usersDocId";
import { useDispatch } from "react-redux";

//firebase
import { collection, doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import FirebaseApp from "../../../utils/firebase";

const TasksDocId = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { docId, id} = router.query;

  const db = getFirestore(FirebaseApp);
  const docRef = doc(db, "users", `${docId}`);

  useEffect(() => {
    console.log(docId, id, 'docid and id bro')
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
    <>
      <Sidebar />
      <Tasks />
    </>
  );
};

export default TasksDocId;
