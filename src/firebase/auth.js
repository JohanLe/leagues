import firebase from "firebase/app";
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
try {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} catch(e){
    console.log("Firebase init error: " + e);
}


class Auth {
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
    return firebase
      .auth()
      .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function (result) {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        return firebase
          .auth()
          .signInWithEmailAndPassword(credentials.email, credentials.password)
          .then(res => {
              return res.user.uid;
          })
      })
      .catch(function (error) {
        // Handle Errors here.
        // var errorCode = error.code;
        var errorMessage = error.message;
        throw errorMessage;
      });
  }


}

export default Auth;
