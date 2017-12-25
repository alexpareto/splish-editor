import React from "react";
import * as globalStyles from '../globalStyles';
import FileSelection from './fileSelection';
import IconButton from './iconButton';
import PreviewToggle from './previewToggle';

class NavBar extends React.Component {

	render() {
		return (
			<div className="container">
				<div className="flex">
					<FileSelection type="video" filesHandler={this.props.selectCinemagraphVideo} />
					<IconButton
						onClick={this.props.initializeCinemagraphCanvas}
						stroke={globalStyles.background}
						name="crosshair"
						backgroundColor={globalStyles.secondary}
					/>
					<PreviewToggle 
						viewMode={this.props.viewMode}
						attemptPreviewCinemagraph={this.props.attemptPreviewCinemagraph}
						startCinemagraphEditMode={this.props.startCinemagraphEditMode}
						/>
					<IconButton
						onClick={this.props.attemptRenderCinemagraph}
						stroke={globalStyles.background}
						name="share"
						backgroundColor={globalStyles.secondary}
					/>
				</div>
				<style jsx>{
					`
					.flex {
						display:flex;
						align-items: center;
						justify-content: center;
						height: 100%;
					}

					.container { 
						left; 0; 
						top: 0;
						margin-left: -8px;
						margin-top: -8px;
						height: 45px;
						width: 100vw;
						border-bottom: 1px solid ${globalStyles.primary};
						background-color: ${globalStyles.background};
					};`}
				</style>
			</div>
		);
	}
}

export default NavBar;
