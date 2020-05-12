import React, { Component } from "react";
import axios from "axios";
import moment from "moment-timezone";
import { Route, Switch, withRouter } from "react-router-dom";
import Cookies from "universal-cookie";

import Consumer, { ExtraContext } from "../context";

import LoadingHeart from "../components/loaders/Heart";
import Container from "../components/containers/Container";

import Header from "../components/Header";
import MobileHeader from "../components/Header/MobileHeader";
import CookiesComponent from "../components/Cookies";

import AccountPage from "./Account";
import NotificationsPage from "./Notifications";
import SearchPage from "./Search";
import VentsPage from "./Vents";
import FindStrangerPage from "./FindStranger";
import NewVentPage from "./NewVent";
import VentPage from "./Vent";
import HotTagsPage from "./HotTags";
import BlogPage from "./Blog";
import CreateBlogPage from "./CreateBlog";
import NotFoundPage from "./NotFound";
import PrivacyPolicyPage from "./PrivacyPolicy";

import { searchVents } from "./Search/util";
import { isMobileOrTablet } from "../util";
import {
  getNotifications,
  getUsersComments,
  getUsersPosts,
  initSocket
} from "./util";

const cookies = new Cookies();

class Routes extends Component {
  state = {
    databaseConnection: false,
    hasVisitedSite: cookies.get("hasVisitedSite")
  };

  componentDidMount() {
    const { handleChange, notify } = this.context;

    axios.get("/api/user").then(res => {
      const { success, user, message } = res.data;

      if (success) {
        initSocket(stateObj => {
          handleChange({ ...stateObj, user });
          this.setState({ databaseConnection: true });
          this.getDataNeededForPage(this.props.location, undefined, true);
          stateObj.socket.emit("set_user_id");
          if (user.password) {
            getNotifications(0, stateObj.socket);
            this.initReceiveNotifications();
          }
        });
      } else {
        notify({ message, type: "danger" });
      }
    });

    this.unlisten = this.props.history.listen(this.getDataNeededForPage);
  }
  componentWillUnmount() {
    this.unlisten();
  }
  getDataNeededForPage = (location, action, initialPageLoad) => {
    let { pathname, search } = location;
    const { getVents, handleChange, notify, socket } = this.context; // Functions
    const { vents, skip, user } = this.context; // Variables

    handleChange({ vents: undefined, skip: 0 }, () => {
      search = search.slice(1, search.length);

      if (
        pathname.substring(0, 8) === "/popular" ||
        pathname.substring(0, 7) === "/recent" ||
        pathname.substring(0, 9) === "/trending"
      )
        getVents(pathname, search);
      else if (pathname === "/") getVents("/trending", search);
      else if (pathname.substring(0, 5) === "/home")
        getVents("/trending", search);
      else if (pathname === "/search")
        searchVents(handleChange, undefined, search, skip, socket);
      else if (pathname === "/activity") {
        getUsersPosts(handleChange, notify, vents, search, skip, socket, user);
        getUsersComments(handleChange, notify, search, socket, user);
      }
    });
  };

  initReceiveNotifications = () => {
    const { socket } = this.context;
    socket.on("receive_new_notifications", dataObj => {
      const { handleChange } = this.context; // Functions
      const { notifications } = this.context; // Variables
      const { newNotifications } = dataObj;

      if (notifications.length > 0) {
        if (newNotifications && newNotifications.length > 0) {
          if (
            moment(newNotifications[0].createdAt) <
            moment(notifications[0].createdAt)
          )
            handleChange({
              notifications: notifications.concat(newNotifications)
            });
          else
            handleChange({
              notifications: newNotifications.concat(notifications)
            });
        }
      } else handleChange({ notifications: newNotifications });
    });
  };
  render() {
    const { databaseConnection, hasVisitedSite } = this.state;
    const { pathname } = this.props.location;

    if (!databaseConnection)
      return (
        <Container className="screen-container full-center pr32">
          <img
            alt=""
            className="loading-animation"
            src={require("../svgs/icon.svg")}
            style={{ height: "280px" }}
          />
        </Container>
      );

    return (
      <Consumer>
        {context => (
          <Container
            className="screen-container column"
            style={{
              maxHeight: pathname === "/vent-to-a-stranger" ? "100vh" : "auto"
            }}
          >
            {!isMobileOrTablet() && <Header />}
            {isMobileOrTablet() && <MobileHeader />}
            <Switch>
              <Route path="/account/" component={AccountPage} exact />
              <Route path="/activity/" component={AccountPage} />
              <Route path="/settings/" component={AccountPage} exact />
              <Route path="/notifications/" component={NotificationsPage} />
              <Route path="/search/" component={SearchPage} />
              <Route path="/hot-tags/" component={HotTagsPage} />
              <Route path="/" component={VentsPage} exact />
              <Route path="/home/" component={VentsPage} />
              <Route path="/trending/" component={VentsPage} />
              <Route path="/recent/" component={VentsPage} />
              <Route path="/popular/" component={VentsPage} />
              <Route path="/vent-to-a-stranger/" component={FindStrangerPage} />
              <Route path="/post-a-problem/" component={NewVentPage} />
              <Route path="/problem/" component={VentPage} />
              <Route path="/blog/" component={BlogPage} />
              <Route path="/create-blog/" component={CreateBlogPage} />
              <Route path="/privacy-policy/" component={PrivacyPolicyPage} />
              <Route component={NotFoundPage} />
            </Switch>
            {!hasVisitedSite && (
              <CookiesComponent
                accept={() => {
                  cookies.set("hasVisitedSite", true);
                  this.setState({ hasVisitedSite: true });
                }}
              />
            )}
          </Container>
        )}
      </Consumer>
    );
  }
}
Routes.contextType = ExtraContext;

export default withRouter(Routes);
