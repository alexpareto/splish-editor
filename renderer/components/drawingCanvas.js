import React from "react";
import * as globalStyles from "../globalStyles";
import Head from "next/head";
import { remote } from "electron";

class DrawingCanvas extends React.Component {
	render() {
		const video = this.props.videoSrc
			? <video
					id="cinemagraphVideo"
					className="cinemagraphVideo"
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

		console.log("OVERLAY SOURCE: ", this.props.overlaySrc);
		const overlay = this.props.viewMode == "preview"
			? <img
					src={this.props.overlaySrc}
					className="overlay"
					style={{
						width: "80vw",
						height: `${this.props.videoHeight}vw`,
						"zIndex": "1002",
						position: 'absolute'
					}}
				/>
			: null;

		return (
			<div className="container">
				<Head>
					<script src="/static/lib/literallyCanvasCore.js" />
					<link
						rel="stylesheet"
						type="text/css"
						href="/static/css/literally.css"
					/>
				</Head>
				{video}
				{overlay}
				<div className="literally core" />
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

						.literally core {
							height: ${this.props.videoHeight}vw;
						}
					`}
				</style>
			</div>
		);
	}
}

export default DrawingCanvas;
