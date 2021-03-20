import React, { useContext, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useCollectionData } from "react-firebase-hooks/firestore";
import db from "../../config/firebase";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnalytics } from "@fortawesome/pro-duotone-svg-icons/faAnalytics";
import { faConciergeBell } from "@fortawesome/pro-duotone-svg-icons/faConciergeBell";
import { faBell } from "@fortawesome/pro-duotone-svg-icons/faBell";
import { faSearch } from "@fortawesome/pro-solid-svg-icons/faSearch";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";

import { UserContext } from "../../context";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import Text from "../views/Text";

import Button from "../views/Button";

import LoginModal from "../modals/Login";
import SignUpModal from "../modals/SignUp";
import NotificationList from "../NotificationList";

import { capitolizeFirstChar, isPageActive } from "../../util";
import {
  getNotifications,
  newNotificationCounter,
  readNotifications
} from "./util";

function Header({ history, location }) {
  const user = useContext(UserContext);

  const [showFeedback, setShowFeedback] = useState(false);
  const [loginModalBoolean, setLoginModalBoolean] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(
    false
  );
  const [signUpModalBoolean, setSignUpModalBoolean] = useState(false);
  const [ventSearchString, setVentSearchString] = useState("");

  const { pathname } = location;

  const searchPosts = ventSearchString => {
    setVentSearchString(ventSearchString);
    history.push("/search?" + ventSearchString);
  };

  if (user) {
    var conversationsQuery = db
      .collection("conversations")
      .where(user.uid, "==", false);

    var [unreadConversations] = useCollectionData(conversationsQuery, {
      idField: "id"
    });
  }

  useEffect(() => {
    if (user) getNotifications(setNotifications, user);
  }, [location]);

  return (
    <Container
      className="column sticky top-0 x-fill justify-center bg-white shadow-2 border-top large active"
      style={{ zIndex: 10 }}
    >
      <Container className="x-fill align-center">
        <Container
          className="full-center"
          style={{ width: "calc(12.5vw - 24px)" }}
        >
          <img
            alt=""
            className="clickable"
            onClick={() => history.push("/")}
            src={require("../../svgs/icon.svg")}
            style={{ height: "50px" }}
          />
          <a
            href="https://www.instagram.com/ventwithstrangers/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <FontAwesomeIcon
              className="clickable common-border white round-icon round pa8"
              icon={faInstagram}
              style={{
                backgroundColor: "#cd486b"
              }}
            />
          </a>
        </Container>

        <Container
          className="align-center wrap"
          style={{
            maxWidth: "1500px",
            width: "60vw"
          }}
        >
          <Link
            className={
              "button-3 py16 mr32 " +
              isPageActive("/recent", pathname.substring(0, 7)) +
              isPageActive("/", pathname)
            }
            to="/recent"
          >
            <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
            Recent
          </Link>
          <Link
            className={
              "button-3 py16 mr32 " +
              isPageActive("/trending", pathname.substring(0, 9))
            }
            to="/trending"
          >
            <FontAwesomeIcon className="mr8" icon={faAnalytics} />
            Trending
          </Link>
          <Link
            className={
              "full-center flex button-3 relative mr32 " +
              isPageActive("/conversations", pathname.substring(0, 14))
            }
            to="/conversations"
          >
            <FontAwesomeIcon className="py16 mr8" icon={faComments} />
            <p className="py16">Inbox</p>

            {unreadConversations && unreadConversations.length !== 0 && (
              <p className="fs-14 bg-red white round ml4 pa4 br4">
                {unreadConversations.length}
              </p>
            )}
          </Link>
          <Link
            className={
              "button-3 py16 mr32 " +
              isPageActive("/about-us", pathname.substring(0, 9))
            }
            to="/about-us"
          >
            About Us
          </Link>

          <Container className="full-center bg-grey-4 py4 px8 my16 mr16 br4">
            <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
            <input
              className="no-border bg-grey-4 br4"
              onChange={e => searchPosts(e.target.value)}
              placeholder="Search"
              type="text"
              value={ventSearchString}
            />
          </Container>
          <Link
            className="button-2 no-bold py8 px16 my16 br8"
            to="/vent-to-strangers"
          >
            Post a Vent
          </Link>
        </Container>
        <Container className="flex-fill full-center wrap mx32 my16">
          {!user && (
            <Button
              className="blue fw-300 mx32"
              text="Login"
              onClick={() => setLoginModalBoolean(true)}
            />
          )}
          {!user && (
            <Button
              className="white blue-fade px32 py8 br4"
              text="Sign Up"
              onClick={() => setSignUpModalBoolean(true)}
            />
          )}
          {user && (
            <Container className="align-center wrap">
              <Link className="flex full-center mr16" to="/activity">
                {user.displayName && (
                  <Text
                    className="round-icon bg-blue white mr8"
                    text={capitolizeFirstChar(user.displayName[0])}
                    type="h6"
                  />
                )}

                <Text
                  className="mr8"
                  text={`Hello, ${capitolizeFirstChar(user.displayName)}`}
                  type="p"
                />
                <FontAwesomeIcon icon={faChevronDown} />
              </Link>

              <HandleOutsideClick
                className="relative"
                close={() => setShowNotificationDropdown(false)}
              >
                <FontAwesomeIcon
                  className="clickable blue"
                  icon={faBell}
                  onClick={() => {
                    setShowNotificationDropdown(!showNotificationDropdown);

                    readNotifications(notifications);
                  }}
                  size="2x"
                />
                {showNotificationDropdown && (
                  <Container
                    className="container small bg-white shadow-2 ov-auto br8"
                    style={{
                      position: "absolute",
                      top: "calc(100% + 8px)",
                      right: 0,
                      maxHeight: "300px"
                    }}
                  >
                    <NotificationList notifications={notifications} />
                  </Container>
                )}
                {newNotificationCounter(notifications) &&
                  !showNotificationDropdown && (
                    <Text
                      className="fs-14 bg-red white pa4 br8"
                      style={{
                        position: "absolute",
                        top: "-12px",
                        right: "-12px",
                        pointerEvents: "none"
                      }}
                      type="p"
                    >
                      {newNotificationCounter(notifications)}
                    </Text>
                  )}
              </HandleOutsideClick>
            </Container>
          )}
        </Container>
      </Container>

      {showFeedback && (
        <Container className="flex-fill wrap full-center bg-grey-4 px32">
          <p className="flex-fill tac py16">
            <Link to="/feedback">
              Give us feedback on our website <span className="blue">here</span>
            </Link>
          </p>
          <Container
            className="clickable round-icon bg-red"
            onClick={() => setShowFeedback(false)}
          >
            <FontAwesomeIcon className="white" icon={faTimes} />
          </Container>
        </Container>
      )}

      {loginModalBoolean && (
        <LoginModal
          close={() => setLoginModalBoolean(false)}
          openSignUpModal={() => {
            setSignUpModalBoolean(true);
            setLoginModalBoolean(false);
          }}
        />
      )}
      {signUpModalBoolean && (
        <SignUpModal
          close={() => setSignUpModalBoolean(false)}
          openLoginModal={() => {
            setSignUpModalBoolean(false);
            setLoginModalBoolean(true);
          }}
        />
      )}
    </Container>
  );
}

export default withRouter(Header);
