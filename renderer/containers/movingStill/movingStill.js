import React from "react";
import ToolBar from "../../components/movingStillToolBar";
import VectorCanvas from "../../components/vectorCanvas";
import Trimmer from "../../components/trimmer";
import { connect } from "react-redux";
import * as Actions from "./actions";

class Cinemagraph extends React.Component {
	render() {
		return (
			<div>
				<ToolBar />
				<VectorCanvas />
				<Trimmer />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		initializeMovingStillCanvas: () =>
			dispatch(Actions.initializeMovingStillCanvas()),
		selectCinemagraphVideo: files =>
			dispatch(Actions.selectMovingStillImage(files)),
		startMovingStillPreviewMode: () =>
			dispatch(Actions.startMovingStillPreviewMode()),
		startMovingStillEditMode: () =>
			dispatch(Actions.startMovingStillEditMode()),
		renderMovingStill: path =>
			dispatch(Actions.renderMovingStill(path))
	};
};

const mapStateToProps = state => ({ cinemagraph: state.cinemagraph });

export default connect(mapStateToProps, mapDispatchToProps)(Cinemagraph);
