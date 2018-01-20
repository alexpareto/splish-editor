import React from 'react';
import Link from 'next/link';

import * as api from '../../lib/api';
import Logo from '../../components/logo';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      hasError: false,
      errorMessage: '',
      success: false,
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

  requestEmail = async () => {
    // reset error
    this.setState({
      hasError: false,
      errorMessage: '',
    });

    // construct body
    const body = new FormData();
    body.append('email', this.state.email);

    // send off request
    const res = await api.call('password/reset', 'POST', body);
    const json = await res.json();

    // if request fails return error
    if (!res.ok) {
      this.setState({
        hasError: true,
        errorMessage: json.error,
      });
      return;
    }

    // otherwise all is well
    this.setState({
      success: true,
    });
  };

  renderError = () => {
    if (!this.state.hasError) {
      return;
    }
    return (
      <span>
        {this.state.errorMessage}
        <style jsx>
          {`
            span {
              color: red;
            }
          `}
        </style>
      </span>
    );
  };

  renderSuccess = () => {
    if (!this.state.success) {
      return;
    }
    return <span>Awesome! An email has been sent to {this.state.email}.</span>;
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
        <p>
          Type in your email and we'll send a link for you to reset your
          password.
        </p>
        <input
          name="email"
          type="email"
          placeholder="email"
          value={this.state.email}
          onChange={this.handleInputChange}
        />
        <button onClick={this.requestEmail}>Get Email</button>
        {this.renderError()}
        {this.renderSuccess()}
        <Link href="/login">
          <a>Back to login</a>
        </Link>
      </div>
    );
  }
}
