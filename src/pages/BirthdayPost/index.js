import React, { useContext, useState } from "react";
import { useLocation } from "react-router-dom";
import loadable from "@loadable/component";

import { faBirthdayCake } from "@fortawesome/pro-duotone-svg-icons/faBirthdayCake";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { UserContext } from "../../context";

const Container = loadable(() =>
  import("../../components/containers/Container")
);
const NewVentComponent = loadable(() => import("../../components/NewVent"));
const Page = loadable(() => import("../../components/containers/Page"));
const StarterModal = loadable(() => import("../../components/modals/Starter"));
const SubscribeColumn = loadable(() =>
  import("../../components/SubscribeColumn")
);

function NewVentPage() {
  const location = useLocation();
  const { user } = useContext(UserContext);

  const { search } = location;
  const [starterModal, setStarterModal] = useState(!user);

  return (
    <Page className="pa16" title="Happy Birthday!">
      <Container>
        <Container className="column flex-fill gap16">
          <Container className="full-center gap8">
            <h1 className="tac">Happy Birthday! ☺️ ☺️</h1>
            <FontAwesomeIcon className="blue" icon={faBirthdayCake} size="5x" />
          </Container>
          <NewVentComponent
            isBirthdayPost
            ventID={search ? search.substring(1) : null}
          />
        </Container>
        <SubscribeColumn slot="3872937497" />
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
}

export default NewVentPage;
