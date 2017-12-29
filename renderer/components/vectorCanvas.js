import React from "react";
import * as globalStyles from "../globalStyles";
import Head from "next/head";
import { remote } from "electron";
import * as d3 from "d3";

class DrawingCanvas extends React.Component {
	componentDidMount() {
		let svg = d3.select("#movingStillSVG");
		const md = this.onMouseDown;
		const mm = this.onMouseMove;
		console.log("COMPONENT MOUNTED");

		svg
			.on("mousedown", function() {
				const m = d3.mouse(this);
				md(m);
			})
			.on("mousemove", function() {
				const m2 = d3.mouse(this);
				mm(m2);
			});
	}

	onMouseDown = (mouse) => {
		console.log("MOUSE DOWN", mouse);
	};

	onMouseMove = (mouse) => {
		console.log("MOUSE MOVING", mouse);
	};

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
		console.log("IMAGE HEIGHT: ", this.props.imageHeight);

		return (
			<div className="container" id="movingStillContainer">
				<svg className="d3SVG" id="movingStillSVG" />
				{display}
				<style jsx>
					{`
						.cinemagraphVideo {
							width: 80vw;
							z-index: 0;
						}
						.container {
							stroke: 2;
							width: 80vw;
							margin-left: calc(10vw - 8px);
						}

						.d3SVG {
							width: 80vw;
							height: ${this.props.imageHeight}px;
							z-index: 30000;
							position: absolute;
						}

					`}
				</style>
			</div>
		);
	}
}

export default DrawingCanvas;
