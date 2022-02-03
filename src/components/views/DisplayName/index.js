import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loadable from "@loadable/component";

const Container = loadable(() => import("../../containers/Container"));
const KarmaBadge = loadable(() => import("../../views/KarmaBadge"));
const MakeAvatar = loadable(() => import("../../views/MakeAvatar"));

function DisplayName({
  big,
  displayName,
  isLink = true,
  isUserOnline,
  noAvatar,
  noBadgeOnClick,
  noTooltip,
  userBasicInfo,
  userID,
}) {
  const [capitolizedDisplayName, setCapitolizedDisplayName] = useState(
    "Anonymous"
  );

  useEffect(() => {
    import("../../../util").then((functions) => {
      setCapitolizedDisplayName(functions.capitolizeFirstChar(displayName));
    });
  }, [displayName]);

  if (isLink)
    return (
      <Container className="align-center flex-fill ov-hidden">
        <Link
          className="flex clickable align-center ov-hidden"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          to={"/profile?" + userID}
        >
          <MakeAvatar
            displayName={userBasicInfo.displayName}
            userBasicInfo={userBasicInfo}
          />
          {userBasicInfo && (
            <Container className="full-center flex-fill ov-hidden gap4">
              <h5 className="button-1 ellipsis fw-400 grey-11">
                {capitolizedDisplayName}
              </h5>
              {isUserOnline && <div className="online-dot" />}
            </Container>
          )}
        </Link>
        {userBasicInfo && (
          <KarmaBadge
            noOnClick={noBadgeOnClick}
            noTooltip={noTooltip}
            userBasicInfo={userBasicInfo}
          />
        )}
      </Container>
    );
  else
    return (
      <Container className="align-center flex-fill ov-hidden">
        <Container className="flex-fill align-center ov-hidden">
          {!noAvatar && (
            <MakeAvatar
              displayName={userBasicInfo.displayName}
              userBasicInfo={userBasicInfo}
            />
          )}
          {userBasicInfo && (
            <Container className="full-center flex-fill ov-hidden gap4">
              <h5
                className={
                  "ellipsis fw-400 " + (big ? "fs-24 primary" : "grey-11")
                }
              >
                {capitolizedDisplayName}
              </h5>
              {isUserOnline && <div className="online-dot" />}
              {userBasicInfo && (
                <KarmaBadge
                  noOnClick={noBadgeOnClick}
                  userBasicInfo={userBasicInfo}
                />
              )}
            </Container>
          )}
        </Container>
      </Container>
    );
}

export default DisplayName;