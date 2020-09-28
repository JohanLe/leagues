import firebase from "firebase/app";
import React, { useEffect, useState, useContext } from "react";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firebase-firestore";

/**
 * Class to help set,gather and update data on firebase
 */

var firebaseConfig = {
  apiKey: "AIzaSyBxT1O1076h5kRVLjGfTGy14-wKL5ijPAg",
  authDomain: "leagues-1e314.firebaseapp.com",
  databaseURL: "https://leagues-1e314.firebaseio.com",
  projectId: "leagues-1e314",
  storageBucket: "leagues-1e314.appspot.com",
  messagingSenderId: "711120148184",
  appId: "1:711120148184:web:cf679ccf49f2dfb9a369ad",
  measurementId: "G-T43ZCY9YM1",
};
// Initialize Firebase
// Initialize Firebase
let firebaseApp;
try {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} catch (e) {
  console.log("Firebase init error: " + e);
}

export class Auth {
  createUser(user) {
    firebase
      .auth()
      .createUserWithEmailAndPassword(user.email, user.password)
      .then(() => {
        console.log("Auth register success");
      })
      .catch(function (error) {
        // Handle Errors here.
        // var errorCode = error.code;
        var errorMessage = error.message;
        // ...
        throw errorMessage;
      });
  }

  async login(credentials) {
    try {
      let user = await firebase
        .auth()
        .signInWithEmailAndPassword(credentials.eValue, credentials.pValue);
      return user.user.uid;
    } catch (e) {
      console.log("Loggin failed: ", e);
    }
  }
  signOut() {
    firebase
      .auth()
      .signOut()
      .then(function () {
        sessionStorage.clear();
        console.log("User signed out");
      })
      .catch(function (error) {
        // An error happened.
      });
  }
}

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [pending, setPending] = useState(true);

  useEffect(() => {
    firebaseApp.auth().onAuthStateChanged((user) => {
      setCurrentUser(user);
      setPending(false);
    });
  }, []);

  if(pending){
    return <>Loading...</>
  }

  return (
    <AuthContext.Provider
      value={{
        currentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
