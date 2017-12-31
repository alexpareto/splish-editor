import { remote } from "electron";
import fs from "fs";

export default (image, vectors, anchors, dimensions) => {
	let cv;
	if (remote) {
		cv = remote.require("opencv4nodejs");
		console.log("RENDERING MOVING STILL UH OH PLOTA", image, vectors, anchors, dimensions);
		return '';	
	}
};
