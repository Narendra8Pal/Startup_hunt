var firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  //   authDomain: "PROJECT_ID.firebaseapp.com",
  databaseURL: "https://DATABASE_NAME.firebaseio.com",
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
  //   storageBucket: "PROJECT_ID.appspot.com",
  //   messagingSenderId: "SENDER_ID",
  appId: process.env.NEXT_PUBLIC_APP_ID,
};

export default firebaseConfig