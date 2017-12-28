import React from "react";
import * as globalStyles from "../globalStyles";
import Head from "next/head";
import { remote } from "electron";

class DrawingCanvas extends React.Component {
	render() {
		const video = this.props.videoSrc
			? <video
					id="movingStillVideo"
					className="movingStillVideo"
					style={{
						width: "80vw",
						left: "10vw",
						position: "absolute"
					}}
					autoPlay={true}
					src={this.props.videoSrc}
					muted={true}
					loop
				/>
			: null;

		const img = this.props.imgSrc
			? <img
					id="movingStillImage"
					style={{
						width: "80vw",
						left: "10vw",
						position: "absolute"
					}}
					src={this.props.imgSrc}
				/>
			: null;

		const display = this.props.viewMode == "edit" ? img : video;

		return (
			<div className="container">
				{display}
				<style jsx>
					{`
						.cinemagraphVideo {
							width: 80vw;
							z-index: 0;
						}
						.container {
							width: 80vw;
							margin-left: calc(10vw - 8px);
						}
					`}
				</style>
			</div>
		);
	}
}

export default DrawingCanvas;
