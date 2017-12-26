import React from "react";
import fs from "fs";
import {remote} from 'electron';
import IconButton from "./iconButton";
import * as globalStyles from "../globalStyles";

class FileSelection extends React.Component {

	chooseFileDialog = () => {
		const path = remote.dialog.showSaveDialog({
				title: "Choose a video!",
				filters: [
			    {name: 'Movies', extensions: ['avi']},
			  ],
				buttonLabel: "Render",
				properties: ['openFile'],
			});

		this.props.fileHandler(path);
	};

	render() {
		return (
			<div onClick={this.chooseFileDialog}>
				<IconButton
					stroke={globalStyles.background}
					name="share"
					backgroundColor={globalStyles.secondary}
				/>
			</div>
		);
	}
}

export default FileSelection;
