import React from "react";
import * as globalStyles from "../globalStyles";
import IconButton from "./iconButton";
import Slider from "rc-slider";

class AnimationDebugger extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			isShown: false
		};
	}

	updateParams = () => {
		if(this.state.isShown){
			let params = {};
			this.props.updateAnimationParams(params);
		}
		this.setState({ isShown: !this.state.isShown });
	};

	render() {
		const sliders = this.state.isShown ? <div> 

		</div> : null;
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
						flex-direction: column;
						justify-content: center;
						margin-left: -8px;
						align-items: center;
						z-index: 3000000;
						top: 5vh;
						width: 100vw;
						background-color: ${globalStyles.background};
					};`}
				</style>
			</div>
		);
	}
}

export default AnimationDebugger;
