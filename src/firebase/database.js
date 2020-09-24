import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/firestore";
import "firebase/functions";

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
try {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
} catch (e) {
  console.log("Firebase init error: " + e);
}

const db = firebase.firestore();
const { serverTimestamp } = firebase.firestore.FieldValue;

//Helper funktions

function idGenerator(length) {
  var result = "";
  var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//FIXME Gö alla funktioner async
class Database {
  /**
   *
   * @param {*} col Collection to get from
   * @param {*} doc Document to get
   * Gets document and @returns the data as object
   */
  async getDocument(col, doc) {
    let res = await db
      .collection(col)
      .doc(doc)
      .get()
      .catch((e) => {
        console.log(e);
        throw new Error("Failed to get user");
      });
    return res.data();
  }

  /**
   *
   * @param {*} col Collection
   * @param {*} doc Document
   * @param {*} secondCol Collection of document
   * Gets whole collection of documents from inside a document
   * @retuns the whole firebase collection.
   */
  async getCollectionOfDocument(col, doc, secondCol) {
    return await db.collection(col).doc(doc).collection(secondCol).get();
  }

  /** User related **/
  /**
   *
   * @param {*} userId  String of user id
   * returns user data in form of object
   */
  async getUser(userId) {
    let res = await db
      .collection("users")
      .doc(userId)
      .get()
      .catch((e) => {
        console.log(e);
        throw new Error("Failed to get user");
      });
    return res.data();
  }
  /**
   * Update user data
   * @param {*} userId
   * @param {*} userData
   */
  updateUser(userId, userData) {
    var userDoc = db.collection("users").doc(userId);

    userDoc
      .update({
        email: userData.email,
        golfId: userData.golfId,
        hcp: {
          hcp: parseFloat(userData.hcp),
          time: serverTimestamp(),
        },
        firstName: userData.firstName,
        lastName: userData.lastName,
      })
      .then(() => {
        console.log("Updated successfully");
      })
      .catch((error) => {
        console.log("Updated failed");
        throw error;
      });
  }

  /** League related **/
  /**
   * Creates a new Doc in League Collection
   * @param {*} userId
   * @param {*} leagueName
   */
  createLeague(userId, leagueName) {
    let id = idGenerator(9);
    let urlIdentifier = leagueName + "-" + id;

    db.collection("leagues").add({
      name: leagueName,
      pathName: urlIdentifier,
      time: serverTimestamp(),
      creator: userId,
      admins: [userId],
      members: [userId],
      oldMembers: [],
      standingInvites: [],
      previusInvites: [],
    });
  }

  /**
   * Invite player to a league.
   * Check if user exists
   * Add Invitee,inviter and time to leagues standingInvites
   *
   * // TODO Kolla om invite redan har skickats. Kolla både på league & user.
   *          - om man redan är medlem i ligan
   * @param {*} leagueId
   * @param {*} userId
   * @param {*} inviter
   */
  invitePlayerWithGolfId(leagueId, golfId, inviter) {
    let time = firebase.firestore.Timestamp.now();
    let invite = {
      invitee: { golfId: golfId, uid: "", name: "" },
      inviter: inviter,
      time: time,
    };
    let userRef = db.collection("users");

    userRef
      .where("golfId", "==", golfId)
      .get()
      .then((snap) => {
        snap.docs.forEach((user) => {
          let userData = user.data();

          invite.invitee["uid"] = user.id;
          invite.invitee["name"] = userData.firstName + " " + userData.lastName;
          console.log(invite);
          return db
            .collection("leagues")
            .doc(leagueId)
            .update({
              standingInvites: firebase.firestore.FieldValue.arrayUnion(invite),
            });
        });
      });
  }

  /**
   * Register new round
   */
  async registerNewRound(roundData, leagueId) {
    let regRoundRef = firebase.functions().httpsCallable("registerRound");

    return await regRoundRef({ leagueId: leagueId, round: roundData });
  }

  async getLastUpdated(col, doc) {
    try {
      let ref = db.collection(col).doc(doc);

      let result = await ref.get();
      return result.data().time.seconds;
    } catch (e) {
      console.log("failed to get time");
    }
  }
}
export default Database;
