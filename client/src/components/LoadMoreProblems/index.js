import React, { Component } from "react";
import Consumer, { ExtraContext } from "../../context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/pro-solid-svg-icons/faFire";

import LoadingHeart from "../loaders/Heart";

import Container from "../../components/containers/Container";
import Text from "../../components/views/Text";

class LoadMoreProblems extends Component {
  state = { hasScrolled: false };
  componentDidMount() {
    this._ismounted = true;
    window.addEventListener("scroll", this.scrollListener);
  }
  componentWillUnmount() {
    this._ismounted = false;
    window.removeEventListener("scroll", this.scrollListener);
  }
  handleChange = stateObj => {
    if (this._ismounted) this.setState(stateObj);
  };
  scrollListener = () => {
    const { loadMore = () => {} } = this.props;
    const { hasScrolled } = this.state;

    if (
      window.innerHeight + window.scrollY + 5 >= document.body.scrollHeight &&
      !hasScrolled
    ) {
      this.handleChange({ hasScrolled: true });
      loadMore();
    }

    setTimeout(() => this.handleChange({ hasScrolled: false }), 100);
  };
  render() {
    const { loadMore = () => {} } = this.props;

    return (
      <Container className="column x-fill full-center" onClick={loadMore}>
        <Container className="clickable x-fill column bg-white mb16 br8">
          <Container className="justify-between pt16 px32">
            <Container>
              <div className="round-icon bg-grey-2 mr8" />
              <div
                className=" bg-grey-2 br16"
                style={{ width: "140px", height: "24px" }}
              />
            </Container>
            <div
              className="bg-grey-2 br16"
              style={{ width: "140px", height: "24px" }}
            />
          </Container>
          <Container className="pt16 px32">
            <div className="x-fill bg-grey-2 br8" style={{ height: "100px" }} />
          </Container>
          <Container className="py16 px32">
            <div
              className=" bg-grey-2 br16"
              style={{ width: "140px", height: "24px" }}
            />
          </Container>
        </Container>

        <LoadingHeart />
      </Container>
    );
  }
}

LoadMoreProblems.contextType = ExtraContext;

export default LoadMoreProblems;
