import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';
import Logo from '../../components/logo.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';

import * as Actions from './actions.js';

class Login extends React.Component {
  async componentDidMount() {
    const data = await checkLoggedIn();
    if (data) {
      Router.push('/mainMenu');
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      passwordConfirm: '',
      showLogin: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.token) {
      Router.push('/mainMenu');
    }
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  toggleLogin = event => {
    this.setState({
      showLogin: !this.state.showLogin,
    });
  };

  onLoginButtonClick = event => {
    this.props.loginUser(this.state.email, this.state.password);
  };

  onSignUpButtonClick = event => {
    if (this.state.password !== this.state.passwordConfirm) {
      return;
    }
    this.props.signUpUser(this.state.email, this.state.password);
  };

  renderLogin = () => {
    if (!this.state.showLogin) {
      return null;
    }
    return (
      <div>
        <input
          name="email"
          type="email"
          placeholder="email"
          value={this.state.email}
          onChange={this.handleInputChange}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          value={this.state.password}
          onChange={this.handleInputChange}
        />
        <button onClick={this.onLoginButtonClick}>Login</button>
        <button onClick={this.toggleLogin}>or Sign Up</button>
        <style jsx>{`
          div {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  };

  renderSignUp = () => {
    if (this.state.showLogin) {
      return null;
    }

    return (
      <div>
        <input
          name="email"
          type="email"
          placeholder="email"
          value={this.state.email}
          onChange={this.handleInputChange}
        />
        <input
          name="password"
          type="password"
          placeholder="password"
          value={this.state.password}
          onChange={this.handleInputChange}
        />
        <input
          name="passwordConfirm"
          type="password"
          placeholder="confirm password"
          value={this.state.passwordConfirm}
          onChange={this.handleInputChange}
        />
        <button onClick={this.onSignUpButtonClick}>Sign Up</button>
        <button onClick={this.toggleLogin}>or Login</button>
        <style jsx>{`
          div {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  };

  renderError = () => {
    if (!this.props.hasError) {
      return null;
    }
    return <div>{this.props.errorMessage}</div>;
  };

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
        <Logo size={150} />
        <div>Version 0.2.1</div>
        {this.renderLogin()}
        {this.renderSignUp()}
        {this.renderError()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    loading: state.auth.requestSent,
    user: state.auth.user,
    token: state.auth.token,
    errorMessage: state.auth.errorMessage,
    hasError: state.auth.hasError,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    loginUser: (email, password) =>
      dispatch(Actions.loginUserRequest(email, password)),
    signUpUser: (email, password) =>
      dispatch(Actions.signUpUserRequest(email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
