import React from "react";
import { connect } from "react-redux";
import Link from "next/link";
import Logo from "../../components/logo.js";

class MainMenu extends React.Component {
	render() {
		return (
			<div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh"}}>
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
			</div>
		);
	}
}

const mapStateToProps = state => ({});

export default connect(mapStateToProps)(MainMenu);
