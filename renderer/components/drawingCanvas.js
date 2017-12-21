import React from "react";
import * as globalStyles from "../globalStyles";
import Head from "next/head";
import { remote } from "electron";

class DrawingCanvas extends React.Component {
	render() {
		const video = this.props.src
			? <video
					id="cinemagraphVideo"
					className="cinemagraphVideo"
					style={{
						width: "70vw",
						left: "15vw",
						position: "absolute"
					}}
					autoPlay={true}
					src={this.props.src}
					muted={true}
					loop
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
				<div className="literally core" />
				<style jsx>
					{`
						.cinemagraphVideo {
							width: 70vw;
						}

						.container {
							height: ${this.props.videoHeight}vw;
							width: 70vw;
							margin-left: calc(15vw - 8px);
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
