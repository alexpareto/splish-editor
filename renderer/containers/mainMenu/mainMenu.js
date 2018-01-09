import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import Logo from "../../components/logo.js";

class MainMenu extends React.Component {
	render() {
		return (
			<div>
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
				<Logo size={150} />
			</div>
		);
	}
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(MainMenu);
