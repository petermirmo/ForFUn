import React, { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment-timezone";
import Avatar from "avataaars";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons/faComments";
import { faUserLock } from "@fortawesome/free-solid-svg-icons/faUserLock";
import { faPray } from "@fortawesome/free-solid-svg-icons/faPray";
import { faLandmark } from "@fortawesome/free-solid-svg-icons/faLandmark";
import { faBaby } from "@fortawesome/free-solid-svg-icons/faBaby";
import { faGlassCheers } from "@fortawesome/free-solid-svg-icons/faGlassCheers";
import { faSchool } from "@fortawesome/free-solid-svg-icons/faSchool";

import Button from "../../components/views/Button";
import Container from "../../components/containers/Container";

import KarmaBadge from "../../components/KarmaBadge";
import { UserContext } from "../../context";

import {
  calculateKarma,
  capitolizeFirstChar,
  getUserBasicInfo,
  isMobileOrTablet
} from "../../util";
import { startConversation } from "../../components/Vent/util";

import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
  religiousBeliefsList
} from "../../PersonalOptions";

function UserComponent({
  displayName,
  showAdditionaluserInformation,
  showMessageUser,
  userID
}) {
  const componentIsMounted = useRef(true);
  const user = useContext(UserContext);

  const [userInfo, setUserInfo] = useState({ displayName, id: userID });

  useEffect(() => {
    getUserBasicInfo(newUserInfo => {
      if (componentIsMounted.current) setUserInfo(newUserInfo);
    }, userID);

    if (componentIsMounted.current) {
    }
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  return (
    <Link
      className={
        "flex container twentyvw ov-hidden column bg-white pa16 mb16 br8 " +
        (isMobileOrTablet() ? "" : "")
      }
      to={"/profile?" + userInfo.id}
    >
      <Container className="x-fill full-center">
        {userInfo && !userInfo.avatar && (
          <Container
            className="bg-blue full-center mb16 br-round"
            style={{
              height: "84px",
              width: "84px"
            }}
          >
            <h1 className="white fs-40">{displayName[0]}</h1>
          </Container>
        )}
        {userInfo && userInfo.avatar && (
          <Avatar
            avatarStyle={"Circle"}
            topType={userInfo.avatar.topType}
            accessoriesType={userInfo.avatar.accessoriesType}
            hairColor={userInfo.avatar.hairColor}
            facialHairType={userInfo.avatar.facialHairType}
            clotheType={userInfo.avatar.clotheType}
            eyeType={userInfo.avatar.eyeType}
            eyebrowType={userInfo.avatar.eyebrowType}
            mouthType={userInfo.avatar.mouthType}
            skinColor={userInfo.avatar.skinColor}
            style={{ width: "96px", height: "96px" }}
            className="mr8"
          />
        )}
      </Container>

      <Container className="align-center">
        <h1 className="primary mr8">{displayName}</h1>
        <KarmaBadge karma={calculateKarma(userInfo)} />
      </Container>
      <h6 className="grey-1 fw-400">{calculateKarma(userInfo)} Karma Points</h6>
      <Container className="mt8">
        {Boolean(
          new moment().year() - new moment(userInfo.birth_date).year()
        ) && (
          <Container className="column">
            <h6 className="fw-400">Age</h6>
            <h6 className="grey-1 fw-400">
              {new moment().year() - new moment(userInfo.birth_date).year()}
            </h6>
          </Container>
        )}
        {userInfo.gender && (
          <Container className="column ml8">
            <h6 className="fw-400">Gender</h6>
            <h6 className="grey-1 fw-400">{userInfo.gender}</h6>
          </Container>
        )}
        {userInfo.pronouns && (
          <Container className="column ml8">
            <h6 className="fw-400">Pronouns</h6>
            <h6 className="grey-1 fw-400">{userInfo.pronouns}</h6>
          </Container>
        )}
      </Container>

      {showAdditionaluserInformation && (
        <Container className="wrap gap8 mt8">
          {userInfo.education !== undefined && (
            <Container className="border-all align-center px8 py4 br4">
              <FontAwesomeIcon className="mr8" icon={faSchool} />
              {educationList[userInfo.education]}
            </Container>
          )}
          {userInfo.kids !== undefined && (
            <Container className="border-all align-center px8 py4 br4">
              <FontAwesomeIcon className="mr8" icon={faBaby} />
              {kidsList[userInfo.kids]}
            </Container>
          )}
          {userInfo.partying !== undefined && (
            <Container className="border-all align-center px8 py4 br4">
              <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
              {partyingList[userInfo.partying]}
            </Container>
          )}
          {userInfo.politics !== undefined && (
            <Container className="border-all align-center px8 py4 br4">
              <FontAwesomeIcon className="mr8" icon={faLandmark} />
              {politicalBeliefsList[userInfo.politics]}
            </Container>
          )}
          {userInfo.religion !== undefined && (
            <Container className="border-all align-center px8 py4 br4">
              <FontAwesomeIcon className="mr8" icon={faPray} />
              {userInfo.religion}
            </Container>
          )}
        </Container>
      )}
      {showMessageUser && (
        <Container className="align-center justify-between mt16">
          {userInfo.displayName && user && (
            <Button
              className="button-2 px16 py8 mr16 br8"
              onClick={e => {
                e.preventDefault();

                if (!user) alert("You must make an account to message user!");
                startConversation(history, user.uid, userInfo.userID);
              }}
            >
              <FontAwesomeIcon className="mr8" icon={faComments} />
              Message User
            </Button>
          )}
        </Container>
      )}
    </Link>
  );
}

export default UserComponent;