import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Logo from '../../components/logo.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import Router from 'next/router';

import { logoutUser } from '../login/actions.js';

class MainMenu extends React.Component {
	static async getInitialProps(ctx) {}

	async componentDidMount() {
		const user = await checkLoggedIn();
		if (!user) {
			Router.push('/mainMenu');
		}
	}

	logout = () => {
		this.props.logout();
		Router.push('/login');
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
				<div>
					<Link href="/cinemagraph" prefetch>
						<a>Create new Cinemagraph</a>
					</Link>
				</div>
				<div>
					<Link href="/movingStill" prefetch>
						<a>Create new Moving Still</a>
					</Link>
				</div>
				<button onClick={this.logout}>Logout</button>
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
