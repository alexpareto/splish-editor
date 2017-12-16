import React from "react";
import ss from "./cinemagraph.scss";

class Cinemagraph extends React.Component {

	myClick = () => {
		this.props.dispatch({type: 'CHANGE_TEST'});
	}

	render() {
		return (
			<div className={ss.cinemagraph} onClick={this.myClick}>
				Cinemagraph Container with test message: {this.props.cinemagraph.test}
			</div>
		);
	}
}

export default Cinemagraph;
