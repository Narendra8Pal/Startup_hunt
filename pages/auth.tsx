import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../utils/firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import Styles from "@/styles/auth.module.css";

const  Auth: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, setLogin] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<boolean>(false);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const handleSignUp = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user, "user brother");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage, "error here");
      });
  };

  const handleLogIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user, "user logged in success!");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <>
      <div className={Styles.orange}>
        <h1 className={Styles.title}>StartupHunt</h1>
      </div>

      <div className={Styles.auth_body}>
        <div className={Styles.container}>
          <div className={Styles.auth}>
            <input
              type="email"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type={visibility ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={login ? handleLogIn : handleSignUp}>
              {login ? "LogIn" : "Sign Up"}
            </button>
          </div>
          {!login ? "already have an account?" : "not a user?"}
          <button onClick={() => (!login ? setLogin(true) : setLogin(false))}>
            {!login ? "LogIn here" : "SignUp here"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Auth;
