import React from "react";
import * as globalStyles from "../globalStyles";
import Head from "next/head";
import { remote } from "electron";
import * as d3 from "d3";

class DrawingCanvas extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			svg: null,
			isDown: false,
			hasMoved: false,
			currentAnchor: null,
			data: [],
			path: null
		};
	}

	componentDidMount() {
		let svg = d3.select("#movingStillSVG");
		const md = this.onMouseDown;
		const mm = this.onMouseMove;
		const mu = this.onMouseUp;

		svg
			.on("mousedown", function() {
				const m = d3.mouse(this);
				md(m);
			})
			.on("mousemove", function() {
				const m2 = d3.mouse(this);
				mm(m2);
			})
			.on("mouseup", function() {
				const m3 = d3.mouse(this);
				mu(m3);
			});

		this.setState({ svg });
	}

	lineFunction = d3
		.line()
		.x(function(data) {
			return data.x;
		})
		.y(function(data) {
			return data.y;
		});

	onMouseDown = mouse => {
		if (this.props.currentTool == "vector") {
			let data = [{ x: mouse[0], y: mouse[1] }, {}];
			this.setState({ data, isDown: true });
		} else {
			let circle = this.state.svg.append("circle");
			circle.attr("cx", mouse[0]).attr("cy", mouse[1]).attr("r", 3);
		}
	};

	onMouseMove = mouse => {
		if (this.state.isDown) {
			let path = this.state.path;
			if (!path) {
				path = this.state.svg.append("path");
				path
					.attr("stroke", "#000")
					.attr("stroke-width", 1)
					.attr("stroke-dasharray", "3, 5")
					.attr("stroke-linecap", "round");
				this.setState({ path });
			}
			let data = this.state.data;
			data[1] = { x: mouse[0], y: mouse[1] };
			path.attr("d", this.lineFunction(data));
		}
	};

	onMouseUp = mouse => {
		if (this.props.currentTool == "vector") {
			let path = this.state.svg.append("path");
			let dx = mouse[0] - this.state.data[0].x;
			let dy = mouse[1] - this.state.data[0].y;
			let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
			let headLength = 5;
			let headWidth = 3;
			let p = [mouse[0] - dx * headLength / d, mouse[1] - dy * headLength / d];
			let p1 = [p[0] - dy * headWidth / d, p[1] + dx * headWidth / d];
			let p2 = [p[0] + dy * headWidth / d, p[1] - dx * headWidth / d];
			let dataPath = [
				{ x: p1[0], y: p1[1] },
				{ x: mouse[0], y: mouse[1] },
				{ x: p2[0], y: p2[1] }
			];
			path
				.attr("d", this.lineFunction(dataPath))
				.attr("stroke", "red")
				.attr("fill", "none");
		}
		this.setState({ data: [], isDown: false, path: null });
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
	            user-select: none;
						}
						path {
							stroke-width: 2;
							stroke: #000;
						}
					`}
				</style>
			</div>
		);
	}
}

export default DrawingCanvas;
