import React from "react";
import NavBar from "../../components/navBar";
import DrawingCanvas from "../../components/drawingCanvas";
import Trimmer from "../../components/trimmer";

class Cinemagraph extends React.Component {
	render() {
		return (
			<div>
				<NavBar
					selectCinemagraphVideo={this.props.selectCinemagraphVideo}
					initializeCinemagraphCanvas={this.props.initializeCinemagraphCanvas}
				/>
				<DrawingCanvas src={this.props.cinemagraph.videoPath} videoHeight={this.props.cinemagraph.videoHeight} />
				<Trimmer />
			</div>
		);
	}
}

export default Cinemagraph;
