import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import firebaseConfig from "../utils/firebase";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/router";
import Image from "next/image";
import Styles from "@/styles/auth.module.css";

const Auth: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, setLogin] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<boolean>(false);

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const router = useRouter();

  const handleSignUp = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user, "user brother");
        router.push("/startups");
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
        router.push("/startups");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  };

  return (
    <>
      <div className={Styles.auth_body}>
        <div className={Styles.container}>
          <div className={Styles.auth}>
            <div className={Styles.logo}>
              <Image
                src="/logo.png"
                alt="logo"
                width={123}
                height={123}
                priority={true}
              />

              <p className={Styles.title}>
                {login ? "Welcome Back!" : "Sign Up for loop"}
              </p>
              <p className={Styles.desc}>Please enter your details.</p>
            </div>

            <div>
              <form className={Styles.form}>
                {!login && (
                  <>
                    <p className={Styles.input_title}>Username</p>
                    <input
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </>
                )}
                <p className={Styles.input_title}>email</p>
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className={Styles.input_title}>password</p>
                <div className={Styles.pass_icon_div}>
                  <div className={Styles.eye_icon}>
                    <Image
                      src={visibility ? "/hidden_eye.png" : "/eye.png"}
                      alt="eye"
                      width={16}
                      height={16}
                      priority={true}
                      onClick={() => setVisibility(!visibility)}
                      className="cursor-pointer"
                    />
                  </div>
                  <input
                    type={visibility ? "text" : "password"}
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="on"
                  />
                </div>
              </form>

              <div className={Styles.btm_part}>
                <button
                  onClick={login ? handleLogIn : handleSignUp}
                  className={Styles.btn}
                >
                  {login ? "LogIn" : "Sign Up"}
                </button>
                <div className="justify-center flex text-sm opacity-70">
                  {!login ? "already have an account?" : "not a user?"}
                </div>
                <div
                  onClick={() => (!login ? setLogin(true) : setLogin(false))}
                  className={Styles.dual_btn}
                >
                  {!login ? "LogIn here" : "SignUp here"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
