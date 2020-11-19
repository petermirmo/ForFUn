import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnalytics } from "@fortawesome/pro-duotone-svg-icons/faAnalytics";
import { faConciergeBell } from "@fortawesome/pro-duotone-svg-icons/faConciergeBell";
import { faBell } from "@fortawesome/pro-duotone-svg-icons/faBell";
import { faFireAlt } from "@fortawesome/pro-duotone-svg-icons/faFireAlt";
import { faFire } from "@fortawesome/pro-solid-svg-icons/faFire";
import { faComments } from "@fortawesome/pro-solid-svg-icons/faComments";
import { faSearch } from "@fortawesome/pro-solid-svg-icons/faSearch";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";

import Consumer, { ExtraContext } from "../../context";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import Text from "../views/Text";

import Button from "../views/Button";

import LoginModal from "../modals/Login";
import SignUpModal from "../modals/SignUp";
import NotificationList from "../NotificationList";

import { capitolizeFirstChar, isPageActive } from "../../util";
import { newNotificationCounter } from "./util";

class Header extends Component {
  state = {
    loginModalBoolean: false,
    signUpModalBoolean: false,
    searchPostString: "",
    showNotificationDropdown: false,
  };
  componentDidMount() {
    this._ismounted = true;
  }
  componentWillUnmount() {
    this.ismounted = false;
  }
  handleChange = (stateObj) => {
    if (this._ismounted) this.setState(stateObj);
  };

  searchPosts = (searchPostString) => {
    const { history } = this.props;

    this.handleChange({ searchPostString });
    history.push("/search?" + searchPostString);
  };
  readNotifications = () => {
    const { socket } = this.context;

    socket.emit("read_notifications", (result) => {
      const { success } = result;

      const { handleChange, notifications } = this.context;
      for (let index in notifications) {
        notifications[index].hasSeen = true;
      }
      handleChange({ notifications });
    });
  };

  render() {
    const {
      loginModalBoolean,
      signUpModalBoolean,
      searchPostString,
      showNotificationDropdown,
    } = this.state;
    const { history, location } = this.props;
    const { pathname } = location;

    return (
      <Consumer>
        {(context) => (
          <Container
            className="sticky top-0 x-fill justify-center bg-white shadow-2 border-top large active"
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
              </Container>
              <Container
                className="align-center wrap"
                style={{
                  maxWidth: "1500px",
                  width: "60vw",
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

                <Container className="border-all active py4 mr16 my16 br4">
                  <Link
                    className="border-right active blue px8"
                    to="/post-a-problem"
                  >
                    Vent
                  </Link>
                  <Link className="blue px8" to="/chats">
                    Chat
                  </Link>
                </Container>

                <Container className="full-center bg-grey-4 py4 px8 my16 mr16 br4">
                  <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
                  <input
                    className="no-border bg-grey-4 br4"
                    onChange={(e) => this.searchPosts(e.target.value)}
                    placeholder="Search"
                    type="text"
                    value={searchPostString}
                  />
                </Container>

                <a
                  className="button-2 no-bold py8 px16 my16 br8"
                  href="https://donorbox.org/vws-site-donation?default_interval=o"
                  target="_blank"
                >
                  Donate
                </a>
              </Container>
              <Container className="flex-fill full-center wrap mx32 my16">
                {!context.user && (
                  <Button
                    className="blue fw-300 mx32"
                    text="Login"
                    onClick={() =>
                      this.handleChange({ loginModalBoolean: true })
                    }
                  />
                )}
                {!context.user && (
                  <Button
                    className="white blue-fade px32 py8 br4"
                    text="Sign Up"
                    onClick={() =>
                      this.handleChange({ signUpModalBoolean: true })
                    }
                  />
                )}
                {context.user && (
                  <Container className="align-center wrap">
                    <Link className="flex full-center mr16" to="/activity">
                      <Text
                        className="round-icon bg-blue white mr8"
                        text={capitolizeFirstChar(context.user.displayName[0])}
                        type="h6"
                      />

                      <Text
                        className="mr8"
                        text={`Hello, ${capitolizeFirstChar(
                          context.user.displayName
                        )}`}
                        type="p"
                      />
                      <FontAwesomeIcon icon={faChevronDown} />
                    </Link>

                    <HandleOutsideClick
                      className="relative"
                      close={() =>
                        this.handleChange({
                          showNotificationDropdown: false,
                        })
                      }
                    >
                      <FontAwesomeIcon
                        className="clickable blue"
                        icon={faBell}
                        onClick={() => {
                          this.handleChange({
                            showNotificationDropdown: !showNotificationDropdown,
                          });

                          this.readNotifications();
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
                            maxHeight: "300px",
                          }}
                        >
                          <NotificationList />
                        </Container>
                      )}
                      {newNotificationCounter(context.notifications) &&
                        !showNotificationDropdown && (
                          <Text
                            className="fs-14 bg-red white pa4 br8"
                            style={{
                              position: "absolute",
                              top: "-12px",
                              right: "-12px",
                              pointerEvents: "none",
                            }}
                            type="p"
                          >
                            {newNotificationCounter(context.notifications)}
                          </Text>
                        )}
                    </HandleOutsideClick>
                  </Container>
                )}
              </Container>
            </Container>

            {loginModalBoolean && (
              <LoginModal
                close={() => this.handleChange({ loginModalBoolean: false })}
                openSignUpModal={() =>
                  this.handleChange({
                    signUpModalBoolean: true,
                    loginModalBoolean: false,
                  })
                }
              />
            )}
            {signUpModalBoolean && (
              <SignUpModal
                close={() => this.handleChange({ signUpModalBoolean: false })}
                openLoginModal={() =>
                  this.handleChange({
                    signUpModalBoolean: false,
                    loginModalBoolean: true,
                  })
                }
              />
            )}
          </Container>
        )}
      </Consumer>
    );
  }
}
Header.contextType = ExtraContext;

export default withRouter(Header);