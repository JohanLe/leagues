const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

/**
 * When a new user is created on Authentication side,
 * A user docment is created on the database with same id and email as auth.
 */
exports.newUserSignup = functions.auth.user().onCreate((user) => {
  admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    firstName: "",
    lastName: "",
    hcp: -99,
    leagues: [],
    golfId: "",
    hcpHistory: [],
    leagueInvites: [],
    messages: [],
  });
});

/**
 * When user updates HCP in settings
 * Adds timestamp to current hcp and moves old {hcp:x, timestamp: x} to hcpHistory[{}]
 */
exports.updateHcp = functions.firestore
  .document("users/{userId}")
  .onUpdate((snap, context) => {
    try {
      let uid = context.params.userId;
      let oldHcp = snap.before.data().hcp;
      let newHcp = snap.after.data().hcp;
      if (oldHcp.hcp !== newHcp.hcp && oldHcp.hcp !== "-99") {
        console.log("Adding to history:");
        admin
          .firestore()
          .collection("users")
          .doc(uid)
          .update({
            hcpHistory: admin.firestore.FieldValue.arrayUnion(oldHcp),
          });
      }
    } catch (e) {
      console.log("Error:", e);
    }
  });

/**
 * When a player creates a new league
 */
exports.newLeagueCreated = functions.firestore
  .document("leagues/{leagueId}")
  .onCreate((snap, context) => {
    //firebase.firestore.FieldValue.arrayUnion(
    let data = snap.data();
    let userId = data.creator;
    console.table(data);
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        leagues: admin.firestore.FieldValue.arrayUnion(context.params.leagueId),
      });
  });

/**
 * When a league admin invites a player to the league
 * - Add to standingInvites @ user (Send invite to player)
 * - Send message to player // TODO
 */
exports.playerInvitedToLeague = functions.firestore
  .document("leagues/{leagueId}")
  .onUpdate((snap, context) => {
    let data = snap.after.data();
    let leagueId = context.params.leagueId;
    let invite = data.standingInvites.pop();
    let userId = invite.invitee.uid;

    let inviteInfo = {
      leagueName: data.name,
      leagueId: leagueId,
      inviter: invite.inviter,
      time: invite.time,
    };
    admin
      .firestore()
      .collection("users")
      .doc(userId)
      .update({
        leagueInvites: admin.firestore.FieldValue.arrayUnion(inviteInfo),
      });
  });

// TODO Trigger - När en runda sparas.
// Spara varje spelares resultat under dess rounds collection

// TODO En massa rigger när saker och ting tas bort. Tar en liga bort - ta bort från alla dokument där de finns osv..// T

/** Http Callable functons **/

//console.log("%c", "color: blue, font-weight:bold, backgorund-color: #222");
/**
 * Checks if user is invited to league.
 * @data = {leagueId, userId}. UserId = user who is invited.
 * //TODO Skriv snyggare kod. dela upp i functioner???
 */
exports.acceptLeagueInvite = functions.https.onCall(async (data, context) => {
  let league, user, leagueRef, userRef;
  leagueRef = admin.firestore().collection("leagues").doc(data.leagueId);
  userRef = admin.firestore().collection("users").doc(data.uid);

  try {
    //Get league doc
    let userIsInvited = false;
    userIsInvited = await leagueRef.get().then((doc) => {
      if (doc.exists) {
        let invites = doc.data().standingInvites;
        league = doc.data();

        invites.map((invite, index) => {
          if (invite.invitee.uid === data.uid) {
            userIsInvited = { invitee: invite.invitee, index: index };
          }
        });
        return userIsInvited;
      } else {
        throw new Error("Could not find document");
      }
    });
    /* 
     If user is invite
     League : Remove user from standingInvites and add to members.
     User: Remove league from leagueInvites and add league id to 
     */
    if (userIsInvited) {
      let newStandingInvites = league.standingInvites.splice(
        userIsInvited.index,
        1
      );

      await leagueRef
        .update({
          members: admin.firestore.FieldValue.arrayUnion(userIsInvited.invitee),
          standingInvites: newStandingInvites,
        })
        .then((res) => {
          return true;
        })
        .catch((res) => {
          throw new Error("Failed to remove invite from league");
        });
    } else {
      console.log("User not invited");
      throw new Error("User not invited");
    }

    //Get User doc
    let leagueInviteExists = false;
    leagueInviteExists = await userRef.get().then((doc) => {
      if (doc.exists) {
        let leagueInvite;
        let invites = doc.data().leagueInvites;
        user = doc.data();

        invites.map((invite, index) => {
          if (invite.leagueId === data.leagueId) {
            leagueInvite = { leagueInvite: invite, index: index };
          }
        });
        return leagueInvite;
      } else {
        throw new Error("Could not find document");
      }
    });

    if (leagueInviteExists) {
      let newInviteList = [];
      if (leagueInviteExists.index > 0) {
        newInviteList = user.leagueInvites.slice(leagueInviteExists.index, 1);
      } else {
        newInviteList = user.leagueInvites.shift();
      }

      let newUserData = {
        leagueInvites: newInviteList,
        leagues: admin.firestore.FieldValue.arrayUnion({
          name: leagueInviteExists.leagueInvite.leagueName,
          leagueId: leagueInviteExists.leagueInvite.leagueId,
          time: "Add admin.firestore...asdasd.servertime()",
        }),
      };
      userRef.update(newUserData);
    } else {
      throw new Error("Could not find league invite on user");
    }

    return leagueInviteExists;
  } catch (error) {
    console.log(error);
    return error;
  }
});

exports.declineLeagueInvite = functions.https.onCall(async (data, context) => {
  let league, user, leagueRef, userRef;
  leagueRef = admin.firestore().collection("leagues").doc(data.leagueId);
  userRef = admin.firestore().collection("users").doc(data.uid);

  try {
    //Get league doc
    let userIsInvited = false;
    userIsInvited = await leagueRef.get().then((doc) => {
      if (doc.exists) {
        let invites = doc.data().standingInvites;
        league = doc.data();

        invites.map((invite, index) => {
          if (invite.invitee.uid === data.uid) {
            userIsInvited = { invitee: invite.invitee, index: index };
          }
        });
        return userIsInvited;
      } else {
        throw new Error("Could not find document");
      }
    });
    /* 
     If user is invite
     League : Remove user from standingInvites and add to members.
     User: Remove league from leagueInvites and add league id to 
     */
    if (userIsInvited) {
      let newStandingInvites = league.standingInvites.splice(
        userIsInvited.index,
        1
      );

      await leagueRef
        .update({
          standingInvites: newStandingInvites,
        })
        .then((res) => {
          return true;
        })
        .catch((res) => {
          throw new Error("Failed to remove invite from league");
        });
    } else {
      console.log("User not invited");
      throw new Error("User not invited");
    }

    //Get User doc
    let leagueInviteExists = false;
    leagueInviteExists = await userRef.get().then((doc) => {
      if (doc.exists) {
        let leagueInvite;
        let invites = doc.data().leagueInvites;
        user = doc.data();

        invites.map((invite, index) => {
          if (invite.leagueId === data.leagueId) {
            leagueInvite = { leagueInvite: invite, index: index };
          }
        });
        return leagueInvite;
      } else {
        throw new Error("Could not find document");
      }
    });

    if (leagueInviteExists) {
      let newInviteList = [];
      if (leagueInviteExists.index > 0) {
        newInviteList = user.leagueInvites.slice(leagueInviteExists.index, 1);
      } else {
        newInviteList = user.leagueInvites.shift();
      }

      let newUserData = {
        leagueInvites: newInviteList,
      };
      userRef.update(newUserData);
    } else {
      throw new Error("Could not find league invite on user");
    }

    return leagueInviteExists;
  } catch (error) {
    console.log(error);
    return error;
  }
});


/**
 * Add a played round to a league
 */
exports.registerRound = functions.https.onCall(async (data, context) => {
  let leagueRef;

  leagueRef = admin
    .firestore()
    .collection("leagues")
    .doc(data.leagueId)
    .collection("rounds");

  leagueRef
    .add({
      results: data.round.results,
      club: data.round.club,
      course: data.round.course,
      date: data.round.date,
      name: "temp",
    })
    .then((res) => {

      return true;
    })
    .catch((e) => {
      return e;
    });
    //TODO Lägg till så varje spelares resultat hämnar hos varje spelare.

  return "Return round register";
});
