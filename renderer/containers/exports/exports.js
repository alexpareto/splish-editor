import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';
import Logo from '../../components/logo.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';

import * as Actions from './actions.js';

class Exports extends React.Component {
  async componentDidMount() {
    const data = await checkLoggedIn();
    if (!data) {
      Router.push('/login');
    }
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <div>Upload some cool shit man!</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Exports);
