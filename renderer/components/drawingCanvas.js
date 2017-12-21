import React from "react";
import * as globalStyles from "../globalStyles";
import Head from 'next/head'

class DrawingCanvas extends React.Component {
	componentDidMount()
	{
		this.props.initializeCinemagraphCanvas();
	}

	render() {
		return (
			<div>
				<Head>
					<script src="/static/lib/literallyCanvasCore.js"></script>
					<link rel="stylesheet" type="text/css" href="/static/css/literally.css"/>
				</Head>
				<div id="tool-eraser"> </div>
				<div id="tool-pencil"> </div>
				<div className="literally core">
				</div>
				<style jsx>
						{` 
						`}
				</style>
			</div>
		);
	}
}

export default DrawingCanvas;
