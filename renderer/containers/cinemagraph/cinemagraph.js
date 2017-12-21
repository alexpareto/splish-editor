import React from "react";
import NavBar from "../../components/navBar";
import DrawingCanvas from "../../components/drawingCanvas";
import Trimmer from "../../components/trimmer";
import { connect } from 'react-redux'


class Cinemagraph extends React.Component {
	render() {
		console.log("PROPS: ", this.props);
		return (
			<div>
				hello still
			</div>
		);
	}
}

export default connect(state => state)(Cinemagraph)
