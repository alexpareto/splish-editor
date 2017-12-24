import React from "react";
import IconButton from "./iconButton";
import * as globalStyles from "../globalStyles";

class PreviewToggle extends React.Component {
	onClick = () => {
		if(this.props.viewMode) {

		} else {
			
		}
	}

	render() {
		const name = this.props.viewMode == "edit" ? "play" : "composer";
		return (
			<IconButton
				onClick={this.onClick}
				stroke={globalStyles.background}
				name={name}
				backgroundColor={globalStyles.secondary}
			/>
		);
	}
}

export default PreviewToggle;
