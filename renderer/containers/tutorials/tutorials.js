import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';
import { shell } from 'electron';

import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import { logoutUser } from '../login/actions.js';
import validateEmail from '../../lib/validateEmail';
import * as globalStyles from '../../globalStyles';

import Button from '../../components/button';
import A from '../../components/a';
import Input from '../../components/input';
import Exports from '../exports/exports';
import EyeLogo from '../../components/eyelogo';
import Holder from '../../components/holder';

class Profile extends React.Component {
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
      <Holder>
        <div className="eye-logo">
          <EyeLogo height={30} withText={true} />
        </div>
        <div className="tutorial-holder">
          <div className="tutorial-links">
            <div
              className="tutorial-link"
              onClick={() =>
                shell.openExternal(
                  'https://blog.splish.io/2018/02/07/first-animagraph/',
                )
              }
            >
              <Button>intro to animagraphs</Button>
            </div>
            <div
              className="tutorial-link"
              onClick={() =>
                shell.openExternal(
                  'https://blog.splish.io/2018/02/07/first-cinemagraph/',
                )
              }
            >
              <Button>into to cinemagraphs</Button>
            </div>
            <div
              className="tutorial-link"
              onClick={() =>
                shell.openExternal('https://blog.splish.io/category/tutorials/')
              }
            >
              <Button>more tutorials</Button>
            </div>
          </div>
          <div className="back">
            <Link href="/mainMenu" prefetch>
              <A>back to main menu</A>
            </Link>
          </div>
        </div>
        <style jsx>{`
          .tutorial-holder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
          }

          .tutorial-link {
            width: 150px;
            margin: 20px;
            text-align: center;
          }

          .tutorial-links {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }

          .eye-logo {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            padding: 5px;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </Holder>
    );
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
