import React from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../utils/firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import Styles from "@/styles/auth.module.css";

const Auth = () => {
//   const auth = getAuth();
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //     });

  return (
    <>
    <div className={Styles.auth_body}>
      <div className={Styles.container}>

        <div className={Styles.auth}>
        <input type="text" />
        <input type="password" />
        <button>Sign Up</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default Auth;
