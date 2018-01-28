import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';

import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import { logoutUser } from '../login/actions.js';

import Logo from '../../components/logo.js';
import Button from '../../components/button.js';
import * as globalStyles from '../../globalStyles';

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

  logout = () => {
    this.props.logout();
    Router.push('/login');
  };

  render() {
    if (this.state.loading) {
      return <div> loading </div>;
    }
    return (
      <div className="holder">
        <div className="button-holder">
          <Link href="/profile" prefetch>
            <div className="action-button">
              <div className="icon">icon</div>
              <span>profile</span>
            </div>
          </Link>
          <Link href="/cinemagraph" prefetch>
            <div className="action-button">
              <div className="icon">icon</div>
              <span>cinemagrapher</span>
            </div>
          </Link>
          <Link href="/movingStill" prefetch>
            <div className="action-button">
              <div className="icon">icon</div>
              <span>liquigrapher</span>
            </div>
          </Link>
        </div>
        <style jsx>
          {`
            .holder {
            }

            .button-holder {
              width: 30%;

              display: flex;
              flex-direction: column;
              justify-content: center;
              height: 100vh;
              padding-left: 50px;
            }

            .action-button {
              height: 80px;
              font-size: 24px;
              cursor: pointer;
              line-height: 80px;
              display: flex;
              flex-direction: row;
              align-items: center;
            }

            .icon {
              display: inline-block;
              height: 50px;
              width: 50px;
              margin-right: 20px;
              box-shadow: ${globalStyles.lighterBoxShadow};
              transition: all 0.3s ease;
            }

            .action-button:hover .icon {
              box-shadow: ${globalStyles.heavierBoxShadow};
              transform: translateY(-3px);
            }
          `}
        </style>
      </div>
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
