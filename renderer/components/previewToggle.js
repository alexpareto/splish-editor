import React from "react";
import IconButton from "./iconButton";
import * as globalStyles from "../globalStyles";

class PreviewToggle extends React.Component {

	render() {
		const name = this.props.viewMode == "edit" ? "play" : "composer";
		const onClick = this.props.viewMode == "edit" ? this.props.attemptPreviewCinemagraph : this.props.startCinemagraphEditMode;
		return (
			<IconButton
				onClick={onClick}
				stroke={globalStyles.background}
				name={name}
				backgroundColor={globalStyles.secondary}
			/>
		);
	}
}

export default PreviewToggle;
