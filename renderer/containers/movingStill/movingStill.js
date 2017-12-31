import React from "react";
import ToolBar from "../../components/movingStillToolBar";
import VectorCanvas from "../../components/vectorCanvas";
import Trimmer from "../../components/trimmer";
import { connect } from "react-redux";
import * as Actions from "./actions";

class MovingStill extends React.Component {
	render() {
		return (
			<div>
				<ToolBar
					selectMovingStillImage={this.props.selectMovingStillImage}
					viewMode={this.props.movingStill.viewMode}
					initializeMovingStillCanvas={this.props.initializeMovingStillCanvas}
					selectAnchorTool={this.props.selectAnchorTool}
					selectVectorTool={this.props.selectVectorTool}
					isInitialized={this.props.movingStill.isInitialized}
				/>
				<VectorCanvas
					currentTool={this.props.movingStill.currentTool}
					imgSrc={this.props.movingStill.imgPath}
					viewMode={this.props.movingStill.viewMode}
					initializeMovingStillCanvas={this.props.initializeMovingStillCanvas}
					isInitialized={this.props.movingStill.isInitialized}
					imageHeight={this.props.movingStill.imageHeight}
					addVector={this.props.addVector}
					addAnchor={this.props.addAnchor}
				/>
				<Trimmer />
			</div>
		);
	}
}

const mapDispatchToProps = dispatch => {
	return {
		initializeMovingStillCanvas: (tool) =>
			dispatch(Actions.initializeMovingStillCanvas(tool)),
		selectMovingStillImage: files =>
			dispatch(Actions.selectMovingStillImage(files)),
		startMovingStillPreviewMode: () =>
			dispatch(Actions.startMovingStillPreviewMode()),
		startMovingStillEditMode: () =>
			dispatch(Actions.startMovingStillEditMode()),
		renderMovingStill: path => dispatch(Actions.renderMovingStill(path)),
		selectVectorTool: () => dispatch(Actions.selectVectorTool()),
		selectAnchorTool: () => dispatch(Actions.selectAnchorTool()),
		addVector: vector => dispatch(Actions.addVector(vector)),
		addAnchor: anchor => dispatch(Actions.addAnchor(anchor)),
	};
};

const mapStateToProps = state => ({ movingStill: state.movingStill });

export default connect(mapStateToProps, mapDispatchToProps)(MovingStill);
