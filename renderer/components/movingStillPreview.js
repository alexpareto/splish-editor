import React from "react";
import * as globalStyles from "../globalStyles";
import preview from "../webgl/helpers/previewMovingStill";

class MovingStillPreview extends React.Component {
	componentDidMount() {
		preview(
			this.props.imgSrc,
			this.props.anchors,
			this.props.vectors,
			this.props.boundingRect
		);
	}

	render() {
		return (
			<div>
				<canvas
					style={{ position: "absolute" }}
					id="webglcanvas"
					width="1000"
					height="800"
				/>
				<canvas
					style={{ position: "absolute" }}
					id="2dcanvas"
					width="1000"
					height="800"
				/>
			</div>
		);
	}
}

export default MovingStillPreview;
