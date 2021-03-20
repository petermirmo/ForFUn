import db from "../../config/firebase";

export const getNotifications = (setNotifications, user) => {
  db.collection("notifications")
    .orderBy("server_timestamp")
    .where("userID", "==", user.uid)
    .limitToLast(10)
    .onSnapshot("value", snapshot => {
      if (snapshot.docs)
        setNotifications(
          snapshot.docs
            .map((item, i) => {
              return { id: item.id, ...item.data(), doc: item };
            })
            .reverse()
        );
      else setNotifications([]);
    });
};

export const newNotificationCounter = notifications => {
  let counter = 0;

  for (let index in notifications) {
    if (!notifications[index].hasSeen) counter++;
  }

  if (!counter) return false;
  else return counter;
};

export const readNotifications = notifications => {
  for (let index in notifications) {
    const notification = notifications[index];
    if (!notification.hasSeen) {
      db.collection("notifications")
        .doc(notification.id)
        .update({
          hasSeen: true
        });
    }
  }
};
