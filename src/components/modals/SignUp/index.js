import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import loadable from "@loadable/component";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/pro-solid-svg-icons/faEye";

const Container = loadable(() => import("../../containers/Container"));

function SignUpModal({ setActiveModal }) {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();

  const [canSeePassword, setCanSeePassword] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState();

  useEffect(() => {
    import("../../../util").then((functions) => {
      setIsMobileOrTablet(functions.getIsMobileOrTablet());
    });
  });

  return (
    <Container className="modal-container full-center">
      <Container
        className={
          "modal column align-center ov-auto bg-white br4 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <Container className="x-fill justify-center bg-blue py16">
          <h4 className="tac white">Create an Account</h4>
        </Container>

        <Container className="x-fill column">
          <form
            className="x-fill column"
            onSubmit={handleSubmit((data) => {
              import("./util").then((functions) => {
                functions.signUp(data, navigate, setActiveModal);
              });
            })}
          >
            <Container className="x-fill column px32 py16">
              <input
                className="py8 px16 mb8 br4"
                type="text"
                name="displayName"
                placeholder="Display Name"
                {...register("displayName", {
                  required: "Required",
                })}
              />
              <input
                className="py8 px16 br4"
                name="email"
                type="text"
                placeholder="Email Address"
                {...register("email", {
                  required: "Required",
                })}
              />
              <p className="fw-400 mb8">
                (Your email address will never be shown to anyone.)
              </p>
              <Container className="x-fill wrap">
                <Container
                  className={
                    "column " + (isMobileOrTablet ? "x-100" : "x-50 pr8")
                  }
                >
                  <input
                    className="py8 px16 mb8 br4"
                    name="password"
                    type={canSeePassword ? "" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "Required",
                    })}
                  />
                </Container>
                <Container
                  className={
                    "column " + (isMobileOrTablet ? "x-100" : "x-50 pl8")
                  }
                >
                  <Container className="x-fill full-center">
                    <input
                      className="py8 px16 mb8 br4"
                      name="passwordConfirm"
                      type={canSeePassword ? "" : "password"}
                      placeholder="Confirm Password"
                      {...register("passwordConfirm", {
                        required: "Required",
                      })}
                    />
                    <FontAwesomeIcon
                      className={
                        "clickable ml8 " + (canSeePassword ? "blue" : "")
                      }
                      icon={faEye}
                      onClick={() => setCanSeePassword(!canSeePassword)}
                    />
                  </Container>
                </Container>
              </Container>
            </Container>
            <Container className="column x-fill full-center border-top px32 py16">
              <button className="x-fill bg-blue white py8 br4" type="submit">
                Create Account
              </button>

              <p className="x-fill tac mt8">
                Already have an account?&nbsp;
                <span
                  className="clickable blue"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveModal("login");
                  }}
                >
                  Login
                </span>
              </p>
            </Container>
          </form>
        </Container>
      </Container>
      <Container
        className="modal-background"
        onClick={(e) => {
          e.preventDefault();
          setActiveModal("");
        }}
      />
    </Container>
  );
}

export default SignUpModal;
