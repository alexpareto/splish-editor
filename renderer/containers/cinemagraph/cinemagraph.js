import React from "react";
import NavBar from "../../components/navBar";
import DrawingCanvas from "../../components/drawingCanvas";
import Trimmer from "../../components/trimmer";

class Cinemagraph extends React.Component {
	render() {
		return (
			<div>
				<NavBar selectCinemagraphVideo={this.props.selectCinemagraphVideo} />
				<DrawingCanvas
					src={this.props.cinemagraph.videoPath}
					initializeCinemagraphCanvas={this.props.initializeCinemagraphCanvas}
				/>
				<Trimmer />
			</div>
		);
	}
}

export default Cinemagraph;
