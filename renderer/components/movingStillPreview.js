import React from "react";
import * as globalStyles from "../globalStyles";
import preview from "../webgl/helpers/previewMovingStill";
import AnimationDebugger from "./animationDebugger";

class MovingStillPreview extends React.Component {
	componentDidMount() {
		preview(
			this.props.imgSrc,
			this.props.anchors,
			this.props.vectors,
			this.props.boundingRect,
			this.props.animationParams,
		);
	}

	render() {
		return (
			<div>
				<AnimationDebugger 
					animationParams={this.props.animationParams} 
					updateAnimationParams={this.props.updateAnimationParams} />
				<canvas
					style={{ position: "absolute" }}
					id="webglcanvas"
					width="800"
					height="800"
				/>
				<canvas
					style={{ position: "absolute" }}
					id="2dcanvas"
					width="800"
					height="800"
				/>
			</div>
		);
	}
}

export default MovingStillPreview;
