import React, { Component } from "react";
import makeStore from "../lib/makeStore";
import withRedux from "next-redux-wrapper";
import Cinemagraph from "../containers/cinemagraph/cinemagraph";
import * as Actions from "../containers/cinemagraph/actions";

const mapDispatchToProps = dispatch => {
  return {
    initializeCinemagraphCanvas: () => dispatch(Actions.initializeCinemagraphCanvas()),
    selectCinemagraphVideo: (files) => dispatch(Actions.selectCinemagraphVideo(files)),
  };
};

const mapStateToProps = state => ({ cinemagraph: state.cinemagraph });

export default withRedux(
  makeStore,
  mapStateToProps,
  mapDispatchToProps
)(Cinemagraph);
