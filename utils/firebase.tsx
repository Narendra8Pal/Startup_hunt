import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  //   authDomain: "loop-c046d.firebaseapp.com",
  databaseURL: "https://loop.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  //   storageBucket: "loop-c046d.appspot.com",
  //   messagingSenderId: "442090753636,
  appId: process.env.NEXT_PUBLIC_APP_ID,
};
const FirebaseApp = initializeApp(firebaseConfig);

export default FirebaseApp;
