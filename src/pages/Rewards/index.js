import React, { useContext, useEffect, useState } from "react";
import moment from "moment-timezone";
import { Progress, Space, Tooltip } from "antd";

import Container from "../../components/containers/Container";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";

import { isMobileOrTablet, useIsMounted } from "../../util";
import {
  calculateMilestone,
  getNextMilestone,
  getUserRecentRewards,
  getUserRewardsProgress,
} from "./util";

function CounterDisplay({ counter, size, tooltip, title }) {
  return (
    <Space className="x-fill" direction="vertical">
      <Space align="center">
        <h4>
          {counter}/{getNextMilestone(counter, size)}
        </h4>
        <Tooltip placement="bottom" title={tooltip}>
          <h6 className="blue">{title}</h6>
        </Tooltip>
      </Space>
      <Progress
        percent={Math.round((counter / getNextMilestone(counter, size)) * 100)}
        strokeColor="#2096f2"
      />
      <Tooltip
        placement="bottom"
        title="The amount of karma you will receive after reaching your next milestone :)"
      >
        <p className="flex justify-end" style={{ lineHeight: 1.25 }}>
          {calculateMilestone(counter, size)} Karma Points
        </p>
      </Tooltip>
    </Space>
  );
}

function RewardsPage() {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const [userRewards, setUserRewards] = useState({});
  const [recentRewards, setRecentRewards] = useState([]);

  useEffect(() => {
    if (user) {
      getUserRecentRewards(isMounted, setRecentRewards, user.uid);
      getUserRewardsProgress(isMounted, setUserRewards, user.uid);
    }
  }, [isMounted, user]);

  return (
    <Page
      className="pa16"
      description="Make friends and earn some awesome rewards!"
      title="Rewards"
    >
      <Container>
        <Space className="column flex-fill" direction="vertical">
          <Container
            className="column bg-white pa32 br8"
            direction="vertical"
            size="large"
          >
            <h1 className="tac mb32">Your Upcoming Rewards</h1>
            <Container
              className="gap32"
              direction={isMobileOrTablet() ? "vertical" : "horizontal"}
              size="large"
            >
              <Space className="flex-fill" direction="vertical" size="large">
                <CounterDisplay
                  counter={userRewards.created_vents_counter}
                  size="small"
                  tooltip="The total number of vents you have created :)"
                  title="Vents Created"
                />
                <CounterDisplay
                  counter={userRewards.created_comments_counter}
                  size="small"
                  tooltip="The total number of comments you have created :)"
                  title="Comments Created"
                />
                <CounterDisplay
                  counter={userRewards.created_vent_supports_counter}
                  size="medium"
                  tooltip="The total number of vents you have supported :)"
                  title="Vents You Supported"
                />
              </Space>
              <Space className="flex-fill" direction="vertical" size="large">
                <CounterDisplay
                  counter={userRewards.created_comment_supports_counter}
                  size="medium"
                  tooltip="The total number of comments you have supported :)"
                  title="Comments You Supported"
                />
                <CounterDisplay
                  counter={userRewards.received_comment_supports_counter}
                  size="medium"
                  tooltip="The total number of supports on your comments :)"
                  title="Comment Supports Received"
                />
                <CounterDisplay
                  counter={userRewards.received_vent_supports_counter}
                  size="medium"
                  tooltip="The total number of supports on your vents :)"
                  title="Vent Supports Received"
                />
              </Space>
            </Container>
          </Container>
          <Container
            className="column flex-fill gap8"
            direction="vertical"
            size="large"
          >
            <h1>Recent Rewards</h1>
            {recentRewards.map((obj, index) => (
              <Container
                className="column x-fill bg-white pa16 br8"
                key={index}
              >
                <h6>{obj.title}</h6>
                <p className="blue">+ {obj.karma_gained} Karma Points</p>
                <p>{moment(obj.server_timestamp).fromNow()}</p>
              </Container>
            ))}
          </Container>
        </Space>
        <SubscribeColumn uniqueShareLink slot="1420086439" />
      </Container>
    </Page>
  );
}

export default RewardsPage;
