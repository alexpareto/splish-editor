import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';

import * as Actions from './actions.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import validateEmail from '../../lib/validateEmail';
import * as globalStyles from '../../globalStyles';

import Logo from '../../components/logo.js';
import Input from '../../components/input.js';
import Button from '../../components/button.js';
import A from '../../components/a.js';
import EyeLogo from '../../components/eyelogo';
import Holder from '../../components/holder';

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
      hasError: false,
      errorMessage: '',
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
      hasError: false,
      errorMessage: '',
    });
  };

  onLoginButtonClick = event => {
    this.props.loginUser(this.state.email, this.state.password);
  };

  onSignUpButtonClick = event => {
    // reset local error messages
    this.setState({
      hasError: false,
      errorMessage: '',
    });

    // check for valid password
    if (this.state.password !== this.state.passwordConfirm) {
      this.setState({
        errorMessage: 'Passwords do not match',
        hasError: true,
      });
      return;
    }

    // check for valid email
    if (!validateEmail(this.state.email)) {
      this.setState({
        errorMessage: 'Invalid email',
        hasError: true,
      });
      return;
    }
    this.props.signUpUser(this.state.email, this.state.password);
  };

  renderLogin = () => {
    if (!this.state.showLogin) {
      return null;
    }
    return (
      <div className="form-holder">
        <div className="input-element">
          <Input
            name="email"
            type="email"
            placeholder="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="input-element">
          <Input
            name="password"
            type="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
          <span className="confirm-button">
            <Button onClick={this.onLoginButtonClick}>login</Button>
          </span>
        </div>
        <div>
          or <A onClick={this.toggleLogin}>sign up</A>
        </div>
        <style jsx>{`
          .form-holder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .confirm-button {
            position: absolute;
            margin-left: 7px;
          }

          .input-element {
            margin: 7px 0;
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
      <div className="form-holder">
        <div className="input-element">
          <Input
            name="email"
            type="email"
            placeholder="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="input-element">
          <Input
            name="password"
            type="password"
            placeholder="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />
        </div>
        <div className="input-element">
          <Input
            name="passwordConfirm"
            type="password"
            placeholder="confirm password"
            value={this.state.passwordConfirm}
            onChange={this.handleInputChange}
          />
          <span className="confirm-button">
            <Button onClick={this.onSignUpButtonClick}>sign up</Button>
          </span>
        </div>
        <div>
          or <A onClick={this.toggleLogin}>login</A>
        </div>
        <style jsx>{`
          .form-holder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }

          .confirm-button {
            position: absolute;
            margin-left: 7px;
          }

          .input-element {
            margin: 7px 0;
          }
        `}</style>
      </div>
    );
  };

  renderError = () => {
    // check for server errors and local errors
    if (this.state.hasError) {
      return (
        <div>
          <span>{this.state.errorMessage}</span>
          <style jsx>{`
            div {
              color: ${globalStyles.errorColor};
            }
          `}</style>
        </div>
      );
    } else if (this.props.hasError) {
      return (
        <div>
          <span>{this.props.errorMessage}</span>
          <style jsx>{`
            div {
              color: ${globalStyles.errorColor};
            }
          `}</style>
        </div>
      );
    } else {
      return null;
    }
  };

  render() {
    return (
      <Holder>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            overflow: 'visible',
          }}
        >
          <div className="logo">
            <EyeLogo height={40} withText={true} />
          </div>
          {this.renderLogin()}
          {this.renderSignUp()}
          <div className="errorMessage">{this.renderError()}</div>
          <div className="forgot-password">
            <Link href="/forgotPassword">
              <A>forgot your password?</A>
            </Link>
          </div>
          <style jsx>{`
            .forgot-password {
              position: absolute;
              bottom: 10px;
            }

            .errorMessage {
              margin: 10px;
            }

            .logo {
              margin-bottom: 30px;
            }

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
          `}</style>
        </div>
      </Holder>
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
