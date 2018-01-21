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
        <input
          name="first_name"
          placeholder="First Name"
          value={this.state.first_name}
          onChange={this.handleInputChange}
        />
        <input
          name="last_name"
          placeholder="Last Name"
          value={this.state.last_name}
          onChange={this.handleInputChange}
        />
        <button onClick={this.confirmUpdate}>Save changes</button>
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
        <img src={this.props.user.picture} />
        <p>First name:</p>
        <p>
          {this.props.user.first_name
            ? this.props.user.first_name
            : 'No first name yet'}
        </p>
        <p>Last name:</p>
        <p>
          {this.props.user.last_name
            ? this.props.user.last_name
            : 'No last name yet'}
        </p>
        <p>{this.props.user.email}</p>
        <button onClick={this.showUpdate}>Change</button>
        <div>
          <Link href="/mainMenu" prefetch>
            <a>Back to main menu</a>
          </Link>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div>
        {this.renderUpdateView()}
        {this.renderNormalView()}
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
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
