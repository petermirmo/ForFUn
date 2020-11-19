import firebase from "firebase/app";
import "firebase/auth";

export const login = ({ email, password }, close, notify) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((res) => {
      window.location.reload();
    })
    .catch((error) => {
      notify(error);
    });
};