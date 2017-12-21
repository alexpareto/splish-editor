import React from "react";
import * as globalStyles from "../globalStyles";
import Head from "next/head";
import { remote } from "electron";

class DrawingCanvas extends React.Component {
	componentDidMount() {
		this.props.initializeCinemagraphCanvas();
	}

	render() {
		const video = this.props.src ? <video src={'file:///Users/zdenham/Desktop/IMG_0205.MOV'} /> : null;
		return (
			<div>
				<Head>
					<script src="/static/lib/literallyCanvasCore.js" />
					<link
						rel="stylesheet"
						type="text/css"
						href="/static/css/literally.css"
					/>
				</Head>
				{video}
				<div id="tool-eraser"> </div>
				<div id="tool-pencil"> </div>
				<div className="literally core" />
				<style jsx>
					{`  `}
				</style>
			</div>
		);
	}
}

export default DrawingCanvas;
