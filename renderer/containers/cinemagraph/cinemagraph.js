import React from "react";
import NavBar from '../../components/navBar';
import DrawingCanvas from '../../components/drawingCanvas';
import Trimmer from '../../components/trimmer';
import Head from 'next/head'

class Cinemagraph extends React.Component {

	render() {
		return (
			<div>
				<Head>
					<script src="/static/lib/literallyCanvasCore.js"></script>
					<link rel="stylesheet" type="text/css" href="/static/css/literally.css"/>
				</Head>
				<NavBar />
				<DrawingCanvas />
				<Trimmer />
			</div>
		);
	}
}

export default Cinemagraph;
