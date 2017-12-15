import React, { Component } from "react";
import makeStore from "../redux/main/makeStore";
import withRedux from "next-redux-wrapper";

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
        <div>Prop from Redux {this.props.cinemagraph.test}</div>
        <div onClick={this.myClick}>Click me to change the above</div>
      </div>
    );
  }
}

Start = withRedux(makeStore, state => ({ cinemagraph: state.cinemagraph }))(
  Start
);

export default Start;
