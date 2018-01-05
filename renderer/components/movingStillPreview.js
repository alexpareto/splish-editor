import React from "react";
import * as globalStyles from "../globalStyles";
import preview from '../webgl/helpers/previewMovingStill';

class MovingStillPreview extends React.Component {
	componentDidMount()
	{
		preview();
	}
	render() {
		return (
			<div>
				<div>
					Hello Preview!
				</div>
			</div>
		);
	}
}

export default MovingStillPreview;
