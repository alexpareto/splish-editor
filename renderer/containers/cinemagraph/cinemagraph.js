import React from "react";
import NavBar from "../../components/navBar";
import DrawingCanvas from "../../components/drawingCanvas";
import Trimmer from "../../components/trimmer";
import { connect } from 'react-redux';
import * as Actions from './actions';


class Cinemagraph extends React.Component {
	render() {
		return (
			<div>
				<NavBar
					selectCinemagraphVideo={this.props.selectCinemagraphVideo}
					initializeCinemagraphCanvas={this.props.initializeCinemagraphCanvas}
					attemptPreviewCinemagraph={this.props.attemptPreviewCinemagraph}
				/>
				<DrawingCanvas src={this.props.cinemagraph.videoPath} videoHeight={this.props.cinemagraph.videoHeight} />
				<Trimmer />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
  return {
    initializeCinemagraphCanvas: () => dispatch(Actions.initializeCinemagraphCanvas()),
    selectCinemagraphVideo: (files) => dispatch(Actions.selectCinemagraphVideo(files)),
    attemptPreviewCinemagraph: () => dispatch(Actions.attemptPreviewCinemagraph()),
  };
};

const mapStateToProps = state => ({ cinemagraph: state.cinemagraph });

export default connect(mapStateToProps, mapDispatchToProps)(Cinemagraph)
