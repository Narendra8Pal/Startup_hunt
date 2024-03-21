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
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import { setShowDocIdIcon } from "@/store/docIdIcon";

//firebase
import { collection, doc, getDoc } from "firebase/firestore";
import { getFirestore } from "firebase/firestore";
import FirebaseApp from "../../../utils/firebase";

const TasksDocId = () => {
  const router = useRouter();

  const dispatch = useDispatch();
  const { docId, id } = router.query;

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

  useEffect(() => {
    const getUserData = () => {
      getDoc(doc(db, "users", `${docId}`))
        .then((docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            dispatch(setShowDocIdIcon(true));
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document: ", error);
        });
    };
    getUserData();
  }, [docId]);

  return (
    <>
      <Sidebar />
      <Tasks />
    </>
  );
};

export default TasksDocId;
