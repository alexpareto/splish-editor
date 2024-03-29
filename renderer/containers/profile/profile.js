import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';

import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import { logoutUser } from '../login/actions.js';
import * as Actions from './actions.js';
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
    this.props.getUser();
  }

  constructor(props) {
    super(props);

    this.state = {
      showUpdateView: false,
      errorMessage: '',
      hasError: false,
    };
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  logout = () => {
    this.props.logout();
    Router.push('/login');
  };

  renderLoading = () => {
    return <div>loading!</div>;
  };

  confirmUpdate = () => {
    this.setState({ hasError: false, errorMessage: '' });

    if (!validateEmail(this.state.email)) {
      this.setState({ hasError: true, errorMessage: 'Invalid email' });
      return;
    }
    const data = new FormData();
    data.append('first_name', this.state.first_name);
    data.append('last_name', this.state.last_name);
    data.append('email', this.state.email);

    this.props.updateUser(data);

    this.setState({
      showUpdateView: false,
    });
  };

  renderUpdateView = () => {
    if (!this.state.showUpdateView) {
      return;
    }

    if (this.props.loading) {
      return this.renderLoading();
    }

    const errorMessage = this.state.hasError ? (
      <div className="input-element">
        <span className="error">{this.state.errorMessage}</span>
        <style jsx>{`
          .error {
            color: ${globalStyles.errorColor};
          }
        `}</style>
      </div>
    ) : null;

    return (
      <div>
        <div className="input-element">
          <Input
            name="email"
            placeholder="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="input-element">
          <Input
            name="first_name"
            placeholder="first name"
            value={this.state.first_name}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="input-element">
          <Input
            name="last_name"
            placeholder="last name"
            value={this.state.last_name}
            onChange={this.handleInputChange}
          />
        </div>
        {errorMessage}
        <div className="input-element">
          <Button onClick={this.confirmUpdate}>save</Button>
        </div>
        <style jsx>{`
          .input-element {
            margin: 7px 0;
          }
        `}</style>
      </div>
    );
  };

  showUpdate = () => {
    this.setState({
      showUpdateView: true,
      first_name: this.props.user.first_name,
      last_name: this.props.user.last_name,
      email: this.props.user.email,
    });
  };

  renderNormalView = () => {
    if (this.state.showUpdateView) {
      return;
    }

    if (this.props.loading) {
      return this.renderLoading();
    }

    return (
      <div>
        <div className="name-holder">
          <img className="proficon" src="/static/icons/splish-proficon.png" />
          <span className="name">
            {this.props.user.first_name ? this.props.user.first_name : ''}{' '}
            {this.props.user.last_name ? this.props.user.last_name : ''}
          </span>
        </div>
        <div>{this.props.user.email}</div>
        <div className="change-button">
          <Button onClick={this.showUpdate}>change</Button>
        </div>
        <div>
          <Link href="/mainMenu" prefetch>
            <A>back to main menu</A>
          </Link>
        </div>

        <style jsx>{`
          .proficon {
            height: 50px;
            width: 50px;
            margin-right: 20px;
          }

          .change-button {
            margin: 20px 0;
          }

          .name-holder {
            font-size: 24px;
            margin-bottom: 20px;
            height: 50px;
            display: flex;
            flex-direction: row;
            align-items: center;
          }
        `}</style>
      </div>
    );
  };

  render() {
    return (
      <Holder>
        <div className="eye-logo">
          <EyeLogo height={30} withText={true} />
        </div>
        <div className="profile-holder">
          {this.renderUpdateView()}
          {this.renderNormalView()}
          <div className="logout">
            <A onClick={this.logout}>logout</A>
          </div>
        </div>
        <div className="export-holder">
          <Exports />
        </div>
        <style jsx>{`
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

          .profile-holder {
            width: 30%;
            box-sizing: border-box;
            display: inline-flex;
            flex-direction: column;
            justify-content: center;
            height: 100%;
            padding-left: 50px;
            vertical-align: top;
          }

          .logout {
            position: absolute;
            bottom: 30px;
          }

          .export-holder {
            display: inline-flex;
            box-sizing: border-box;
            padding: 80px 20px;
            width: 69%;
            height: 100%;
            overflow: scroll;
            vertical-align: top;
          }
        `}</style>
      </Holder>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.profile.user,
    loading: state.profile.requestSent,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUser: () => dispatch(Actions.getSelfRequest()),
    updateUser: data => dispatch(Actions.updateSelfRequest(data)),
    logout: () => dispatch(logoutUser()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
