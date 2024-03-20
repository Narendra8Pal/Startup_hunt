//next.js , style
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Styles from "@/styles/auth.module.css";

// firebase
import FirebaseApp from "../utils/firebase";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
//other packages
import { toast } from "react-toastify";

const Auth = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [login, setLogin] = useState<boolean>(false);
  const [visibility, setVisibility] = useState<boolean>(false);

  const db = getFirestore(FirebaseApp);

  const router = useRouter();

  const handleSignUp = async () => {
    const auth = getAuth();
    let docId: string;
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      const uid = user.uid;
      toast.success("account created successfully!");

      const docRef = await addDoc(collection(db, "users"), {
        username: username,
        userId: uid,
        twitterUsername: "",
        githubUsername: "",
        profile_img: "",
      });
      // console.log(docRef, 'docRef bro')
      docId = docRef.id;
      router.push(`/profile/${docId}`);
      emptyInput();
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error.message;
      toast.error(errorMessage);
    }
  };

  const handleLogIn = async () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const q = query(
          collection(db, "users"),
          where("userId", "==", user.uid)
        );
        handleDocs(q);
        toast.success("Logged in successfully!");
        emptyInput();
      })
      .catch((error) => {
        const errorMessage = error.message;
        toast.error("Oops! Error logging in.", errorMessage);
      });
  };

  const handleDocs = async (q: any) => {
    let docId: string;
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      docId = doc.id;
      router.push(`/profile/${docId}`);
    });
  };

  const emptyInput = () => {
    setEmail("");
    setPassword("");
    setUsername("");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (login) {
      handleLogIn();
    } else {
      handleSignUp();
    }
  };

  const handleChangeAuth = () => {
    emptyInput();
    if (!login) {
      setLogin(true);
    } else {
      setLogin(false);
    }
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
                onClick={() => router.push("/")}
              />

              <p className={Styles.title}>
                {login ? "Welcome Back!" : "Sign Up for loop"}
              </p>
              <p className={Styles.desc}>Please enter your details.</p>
            </div>

            <div>
              <form className={Styles.form} onSubmit={handleSubmit}>
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

                <div className={Styles.btm_part}>
                  <button className={Styles.btn} type="submit">
                    {login ? "LogIn" : "Sign Up"}
                  </button>
                  <div className="justify-center flex text-sm opacity-70">
                    {!login ? "already have an account?" : "not a user?"}
                  </div>
                  <div onClick={handleChangeAuth} className={Styles.dual_btn}>
                    {!login ? "LogIn here" : "SignUp here"}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
