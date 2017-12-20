import React from "react";
import fs from "fs";
import {remote} from 'electron';
import IconButton from "./iconButton";
import * as globalStyles from "../globalStyles";

class NavBar extends React.Component {

	openFileDialog = () => {
		const files = remote.dialog.showOpenDialog();
	};

	render() {
		return (
			<div onClick={this.openFileDialog}>
				<IconButton
					stroke={globalStyles.background}
					name="plus"
					backgroundColor={globalStyles.secondary}
				/>
			</div>
		);
	}
}

export default NavBar;
