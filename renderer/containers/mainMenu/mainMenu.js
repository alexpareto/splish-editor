import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';

import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import * as globalStyles from '../../globalStyles';

import Logo from '../../components/logo.js';
import Button from '../../components/button.js';
import EyeLogo from '../../components/eyelogo.js';
import Loading from '../../components/loading';
import Holder from '../../components/holder';

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  async componentDidMount() {
    const data = await checkLoggedIn();
    if (!data) {
      Router.push('/login');
    } else {
      this.setState({ loading: false });
    }
  }

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Holder>
        <div className="eye-logo">
          <EyeLogo height={30} withText={true} />
        </div>
        <div className="button-holder">
          <Link href="/profile" prefetch>
            <div className="action-button">
              <img className="icon" src="/static/icons/splish-proficon.png" />
              <span>profile</span>
            </div>
          </Link>
          <Link href="/cinemagraph" prefetch>
            <div className="action-button">
              <img className="icon" src="/static/icons/splish-solidlogo.png" />
              <span>cinemagraph</span>
            </div>
          </Link>
          <Link href="/movingStill" prefetch>
            <div className="action-button">
              <img className="icon" src="/static/icons/splish-liquidlogo.png" />
              <span>animagraph</span>
            </div>
          </Link>
        </div>
        <style jsx>
          {`
            .eye-logo {
              position: absolute;
              top: 5px;
              left: 0;
              right: 0;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
            }

            .button-holder {
              width: 30%;
              display: inline-flex;
              box-sizing: border-box;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              padding-left: 50px;
            }

            .action-button {
              height: 100px;
              font-size: 24px;
              font-weight: normal;
              cursor: pointer;
              line-height: 100px;
              display: flex;
              flex-direction: row;
              align-items: center;
            }

            .icon {
              display: inline-block;
              height: 50px;
              margin-right: 20px;
              filter: drop-shadow(3px 5px 3px rgba(0, 0, 0, 0.6));
              transition: all 0.3s ease;
            }

            .action-button:hover .icon {
              filter: drop-shadow(4px 7px 4px rgba(0, 0, 0, 0.9));
              transform: translateY(-3px);
            }
          `}
        </style>
      </Holder>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logoutUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
