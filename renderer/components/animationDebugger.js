import React from "react";
import * as globalStyles from "../globalStyles";
import IconButton from "./iconButton";

class AnimationDebugger extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isShown: false
		};
	}

	updateParams = () => {
		let params = {};
		this.props.updateAnimationParams(params);
		this.setState({ isShown: !this.state.isShown });
	};

	render() {
		const sliders = this.state.isShown ? <div> hey hey </div> : null;
		const icon = this.state.isShown ? "x" : "zap";

		return (
			<div className="container">
				<div className="button">
					<IconButton
						stroke={globalStyles.background}
						name={icon}
						backgroundColor={globalStyles.secondary}
						onClick={this.updateParams}
					/>
				</div>
				{sliders}
				<style jsx>
					{`
					.button {
						width: 40px;
					}

					.container { 
						position: absolute;
						display: flex;
						justify-content: right;
						right: 0;
						top: 10vh;
						height: 45px;
						width: 300px;
						background-color: ${globalStyles.background};
					};`}
				</style>
			</div>
		);
	}
}

export default AnimationDebugger;
