import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
// files, packages
import FirebaseApp from "../utils/firebase";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Styles from "@/styles/auth.module.css";
import { toast } from "react-toastify";

const Auth: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, setLogin] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<boolean>(false);

  // const app = initializeApp(FirebaseApp);
  const db = getFirestore(FirebaseApp);

  const router = useRouter();

  const handleSignUp = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user, "user brother");
        toast.success("account created sucessfully!");
        router.push("/explore");
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      });
  };

  const handleLogIn = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        // console.log(user, "user logged in success!");
        toast.success("Logged in successfully!");
        router.push("/profile");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast.error("Oops! Error logging in.");
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
                <p className={Styles.input_title}>Email</p>
                <input
                  type="email"
                  placeholder="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className={Styles.input_title}>Password</p>
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
