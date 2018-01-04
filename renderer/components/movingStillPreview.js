import React from "react";
import * as globalStyles from "../globalStyles";
import Head from 'next/head';

class MovingStillPreview extends React.Component {
	render() {
		return (
			<div>
				<Head>
					<script src="/static/lib/previewMovingStill.js" />
				</Head>
				<div>
					Hello Preview!
				</div>
			</div>
		);
	}
}

export default MovingStillPreview;
