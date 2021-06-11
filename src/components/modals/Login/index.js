import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

import Container from "../../containers/Container";
import Text from "../../views/Text";
import Button from "../../views/Button";

import { login } from "./util";

import "./style.css";

function LoginModal({ setActiveModal }) {
  const { register, handleSubmit } = useForm();
  const [canSeePassword, setCanSeePassword] = useState(false);

  return (
    <Container className="modal-container full-center">
      <Container className="modal container medium column align-center ov-auto bg-white br4">
        <Container className="x-fill justify-center bg-blue py16">
          <Text className="tac white" text="Log in to your Account" type="h4" />
        </Container>
        <Container className="x-fill column">
          <Container className="x-fill full-center px32">
            <Text className="x-fill tac border-bottom py16" type="p">
              Don't have an account?&nbsp;
              <Text
                className="clickable blue"
                onClick={() => setActiveModal("signUp")}
                type="span"
              >
                Create One
              </Text>
            </Text>
          </Container>
          <form
            className="x-fill column"
            onSubmit={handleSubmit(formData =>
              login(formData, () => setActiveModal(""))
            )}
          >
            <Container className="x-fill column px32 py16">
              <Text className="fw-400 mb8" text="Email Address" type="h5" />
              <input
                className="py8 px16 mb8 br4"
                type="text"
                name="email"
                placeholder="Email"
                ref={register}
                required
              />
              <Text className="fw-400 mb8" text="Password" type="h5" />
              <Container className="x-fill full-center">
                <input
                  className="flex-fill py8 px16 mb8 br4"
                  name="password"
                  type={canSeePassword ? "" : "password"}
                  placeholder="Password"
                  ref={register}
                  required
                />
                <FontAwesomeIcon
                  className={"clickable ml8 " + (canSeePassword ? "blue" : "")}
                  icon={faEye}
                  onClick={() => setCanSeePassword(!canSeePassword)}
                />
              </Container>
            </Container>

            <Container className="column x-fill full-center border-top px32 py16">
              <p
                className="tac clickable mb8"
                onClick={e => {
                  e.preventDefault();
                  setActiveModal("forgotPassword");
                }}
              >
                Have you forgotten your password?{" "}
                <span className="underline blue">Password reset</span>
              </p>
              <Button
                className="x-fill bg-blue white py8 br4"
                text="Log in"
                type="submit"
              />
            </Container>
          </form>
        </Container>
      </Container>
      <Container
        className="modal-background"
        onClick={() => setActiveModal("")}
      />
    </Container>
  );
}

export default LoginModal;
