import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';

import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import { logoutUser } from '../login/actions.js';
import * as Actions from './actions.js';

import Button from '../../components/button';
import A from '../../components/a';
import Input from '../../components/input';
import Exports from '../exports/exports';
import EyeLogo from '../../components/eyelogo';

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
      email: '',
      password: '',
      showUpdateView: false,
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
    const data = new FormData();
    data.append('first_name', this.state.first_name);
    data.append('last_name', this.state.last_name);
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

    return (
      <div>
        <div className="input-element">
          <Input
            name="first_name"
            placeholder="First Name"
            value={this.state.first_name}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="input-element">
          <Input
            name="last_name"
            placeholder="Last Name"
            value={this.state.last_name}
            onChange={this.handleInputChange}
          />
        </div>
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
            {this.props.user.first_name ? this.props.user.first_name : 'Alex'}{' '}
            {this.props.user.last_name ? this.props.user.last_name : 'Pareto'}
          </span>
        </div>
        <div>{this.props.user.email}</div>
        <div className="change-button">
          <Button onClick={this.showUpdate}>Change</Button>
        </div>
        <div>
          <Link href="/mainMenu" prefetch>
            <A>Back to main menu</A>
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
      <div className="holder">
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
            top: 5px;
            left: 0;
            right: 0;
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
            height: 100vh;
            padding-left: 50px;
            position: relative;
          }

          .logout {
            position: absolute;
            bottom: 30px;
          }

          .export-holder {
            display: inline-flex;
            box-sizing: border-box;
            padding: 20px;
            width: 69%;
            height: 100vh;
            overflow: scroll;
          }
        `}</style>
      </div>
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
