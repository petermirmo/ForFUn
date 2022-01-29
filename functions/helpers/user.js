const admin = require("firebase-admin");
const moment = require("moment-timezone");
const { createNotification } = require("./notification");
const { createBirthdayLink, createRewardsLink } = require("./util");

const link_sign_up = require("./email_templates/link_sign_up");

const checkForBirthdays = async () => {
  console.log("starting birthday checker");
  const usersInfoSnapshot = await admin
    .firestore()
    .collection("users_info")
    .orderBy("birth_date")
    .get();

  for (let index in usersInfoSnapshot.docs) {
    const userInfoDoc = usersInfoSnapshot.docs[index];

    const usersBirthday = new moment(userInfoDoc.data().birth_date);
    const today = new moment();

    if (usersBirthday.format("MMDD") === today.format("MMDD")) {
      createNotification(
        true,
        false,
        createBirthdayLink(),
        "From your friends at VWS, have an amazing Birthday!!! :)",
        userInfoDoc.id
      );
    }
  }
};

const createMilestone = async (reward, title, userID) => {
  await admin
    .firestore()
    .collection("users_display_name")
    .doc(userID)
    .set(
      {
        karma: admin.firestore.FieldValue.increment(reward),
      },
      { merge: true }
    );

  await admin.firestore().collection("rewards").add({
    karma_gained: reward,
    server_timestamp: admin.firestore.Timestamp.now().toMillis(),
    title,
    userID,
  });

  /*
  createNotification(
    true,
    true,
    createRewardsLink(),
    title + " +" + reward + " Karma Points",
    userID
  );*/
};

const checkIfCanCreateMilestone = async (
  counter,
  size,
  title,
  secondTitle,
  userID
) => {
  let reward;
  let first;
  if (size === "tiny") {
    if (counter === 250) {
      reward = 5000;
    } else if (counter === 100) {
      reward = 2000;
    } else if (counter === 50) {
      reward = 1000;
    } else if (counter === 20) {
      reward = 500;
    } else if (counter === 10) {
      reward = 250;
    } else if (counter === 3) {
      reward = 100;
    } else if (counter === 1) {
      reward = 25;
    }
  } else if (size === "small") {
    if (counter === 500) {
      reward = 2500;
    } else if (counter === 250) {
      reward = 1250;
    } else if (counter === 100) {
      reward = 500;
    } else if (counter === 50) {
      reward = 250;
    } else if (counter === 25) {
      reward = 125;
    } else if (counter === 10) {
      reward = 50;
    } else if (counter === 1) {
      reward = 5;
      first = true;
    }
  } else if (size === "medium") {
    if (counter === 5000) {
      reward = 1000;
    } else if (counter === 2000) {
      reward = 400;
    } else if (counter === 1000) {
      reward = 200;
    } else if (counter === 500) {
      reward = 100;
    } else if (counter === 250) {
      reward = 50;
    } else if (counter === 100) {
      reward = 20;
    } else if (counter === 50) {
      reward = 10;
    } else if (counter === 10) {
      reward = 5;
    }
  }

  if (reward) {
    createMilestone(reward, first ? secondTitle : title(counter), userID);
  }
};

const newUserSetup = async (user) => {
  await admin.firestore().collection("user_rewards").doc(user.uid).set({
    created_comment_supports_counter: 0,
    created_comments_counter: 0,
    created_quote_supports_counter: 0,
    created_quotes_counter: 0,
    created_vent_supports_counter: 0,
    created_vents_counter: 0,
    quote_contests_won_counter: 0,
    received_comment_supports_counter: 0,
    received_quote_supports_counter: 0,
    received_vent_supports_counter: 0,
  });

  await admin
    .firestore()
    .collection("invite_uid")
    .add({ primary_uid: user.uid });
};

const signPeopleOut = () => {
  admin
    .database()
    .ref("total_online_users")
    .on("value", (doc) => {
      if (doc.val())
        admin
          .database()
          .ref("status")
          .orderByChild("state")
          .limitToLast(doc.val())
          .once("value", (snapshot) => {
            let numberOfUsersOnline = 0;

            snapshot.forEach((data) => {
              if (data.val().status === "online") numberOfUsersOnline++;

              const hoursInactive = Math.floor(
                new moment().diff(new moment(data.val().last_online)) /
                  1000 /
                  3600
              );
              if (!data.val().last_online) {
                admin
                  .database()
                  .ref("status/" + data.key)
                  .update({
                    last_online: admin.database.ServerValue.TIMESTAMP,
                  });
              }

              if (hoursInactive >= 8) {
                admin
                  .database()
                  .ref("status/" + data.key)
                  .update({
                    state: "offline",
                  });
              }
            });
          });
    });
};

const userRewardsListener = async (change, context) => {
  const { userID } = context.params;
  const afterUserRewards = { id: change.after.id, ...change.after.data() };
  const beforeUserRewards = { id: change.before.id, ...change.before.data() };

  if (afterUserRewards && beforeUserRewards) {
    if (
      afterUserRewards.quote_contests_won_counter !==
      beforeUserRewards.quote_contests_won_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.quote_contests_won_counter,
        "tiny",
        (number) => "You have won " + number + " quote contests!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_comment_supports_counter !==
      beforeUserRewards.created_comment_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_comment_supports_counter,
        "medium",
        (number) => "You have supported " + number + " comments!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_comments_counter !==
      beforeUserRewards.created_comments_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_comments_counter,
        "small",
        (number) => "You have created " + number + " comments!",
        "You have created your first comment!!!",
        userID
      );
    if (
      afterUserRewards.created_vent_supports_counter !==
      beforeUserRewards.created_vent_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_vent_supports_counter,
        "medium",
        (number) => "You have supported " + number + " vents!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_vents_counter !==
      beforeUserRewards.created_vents_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_vents_counter,
        "small",
        (number) => "You have created " + number + " vents!",
        "You have created your first vent!!!",
        userID
      );
    if (
      afterUserRewards.received_comment_supports_counter !==
      beforeUserRewards.received_comment_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.received_comment_supports_counter,
        "medium",
        (number) => "Your comments have received " + number + " supports!",
        undefined,
        userID
      );
    if (
      afterUserRewards.received_vent_supports_counter !==
      beforeUserRewards.received_vent_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.received_vent_supports_counter,
        "medium",
        (number) => "Your vents have received " + number + " supports!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_quotes_counter !==
      beforeUserRewards.created_quotes_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_quotes_counter,
        "small",
        (number) => "You have created " + number + " quotes!",
        undefined,
        userID
      );

    if (
      afterUserRewards.received_quote_supports_counter !==
      beforeUserRewards.received_quote_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.received_quote_supports_counter,
        "medium",
        (number) => "Your quotes have received " + number + " supports!",
        undefined,
        userID
      );
    if (
      afterUserRewards.created_quote_supports_counter !==
      beforeUserRewards.created_quote_supports_counter
    )
      checkIfCanCreateMilestone(
        afterUserRewards.created_quote_supports_counter,
        "medium",
        (number) => "You have supported " + number + " quotes!",
        "You have created your first quote!!!",
        userID
      );
  }
};

const userWasInvited = async (doc, context) => {
  // Check we have all information that we need
  if (!doc.exists) return;

  let userIDThatGotInvited = doc.id;

  if (!userIDThatGotInvited) return;
  if (!doc.data() || !doc.data().referral_secondary_uid) return;

  const getPrimaryuidDoc = await admin
    .firestore()
    .collection("invite_uid")
    .doc(doc.data().referral_secondary_uid)
    .get();

  let userIDThatInvited;
  if (getPrimaryuidDoc.data() && getPrimaryuidDoc.data().primary_uid)
    userIDThatInvited = getPrimaryuidDoc.data().primary_uid;

  if (!userIDThatInvited) return;

  // We now have both primary uids

  // Give user karma
  await admin
    .firestore()
    .collection("users_display_name")
    .doc(userIDThatInvited)
    .set(
      {
        karma: admin.firestore.FieldValue.increment(50),
      },
      { merge: true }
    );

  const userSettingsDoc = await admin
    .firestore()
    .collection("users_settings")
    .doc(userIDThatInvited)
    .get();

  // Make notification
  if (userSettingsDoc.data() && userSettingsDoc.data().master_link_sign_up)
    createNotification(
      userSettingsDoc.data().mobile_link_sign_up === true,
      userSettingsDoc.data().email_link_sign_up === true
        ? {
            html: link_sign_up,
            subject: "Someone signed up from your link! +50 Karma",
          }
        : undefined,
      "",
      "Someone signed up from your link! +50 Karma",
      userIDThatInvited
    );
  return;
};

module.exports = {
  checkForBirthdays,
  newUserSetup,
  signPeopleOut,
  userRewardsListener,
  userWasInvited,
};
