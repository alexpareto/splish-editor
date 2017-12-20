import React, { Component } from "react";
import makeStore from "../lib/makeStore";
import withRedux from "next-redux-wrapper";
import Cinemagraph from "../containers/cinemagraph/cinemagraph";
import { bindActionCreators } from "redux";
import * as Actions from "../containers/cinemagraph/actions";

class Start extends Component {
  static getInitialProps({ store, isServer, pathname, query}) {
    return {}
  }

  render() {
    return (
      <div>
        <Cinemagraph />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initializeCinemagraphCanvas: bindActionCreators(Actions.initializeCinemagraphCanvas, dispatch),
    selectCinemagraphVideo: bindActionCreators(Actions.selectCinemagraphVideo, dispatch),
  };
};

const mapStateToProps = state => ({ cinemagraph: state.cinemagraph });

export default withRedux(
  makeStore,
  mapStateToProps,
  mapDispatchToProps
)(Start);
