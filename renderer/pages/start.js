import React, { Component } from "react";
import makeStore from "../containers/makeStore";
import withRedux from "next-redux-wrapper";
import Cinemagraph from "../containers/cinemagraph/cinemagraph";

class Start extends Component {
  static getInitialProps({ store, isServer, pathname, query }) {
    return {};
  }

  myClick = () => {
    this.props.dispatch({type: 'CHANGE_TEST'});
  };

  render() {
    return (
      <div>
        <Cinemagraph dispatch={this.props.dispatch} cinemagraph={this.props.cinemagraph} />
      </div>
    );
  }
}

Start = withRedux(makeStore, state => ({ cinemagraph: state.cinemagraph }))(
  Start
);

export default Start;
