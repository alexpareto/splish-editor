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
				Hello Preview!
				<canvas
					style={{ position: "absolute" }}
					id="webglcanvas"
					width="600"
					height="600"
				/>
				<canvas
					style={{ position: "absolute" }}
					id="2dcanvas"
					width="600"
					height="600"
				/>
				<label>
					<input
						type="checkbox"
						name="showUniforms"
						id="showUniforms"
					/>
				</label>
				<label><input type="radio" name="rendertype" id="renderLines" /></label>
				<label>
					<input type="radio" name="rendertype" id="renderTriangles" />
				</label>
			</div>
		);
	}
}

export default MovingStillPreview;
