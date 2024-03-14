import { FirebaseOptions, getApp, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  databaseURL: process.env.NEXT_PUBLIC_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
};

function createFirebaseApp(config: FirebaseOptions) {
  try {
    return getApp();
  } catch {
    return initializeApp(config);
  }
}

const FirebaseApp = createFirebaseApp(firebaseConfig);
const FirebaseAuth = getAuth(FirebaseApp);

export default FirebaseApp;
