import { remote } from "electron";
import fs from "fs";

export default (imagePath, vectors, anchors, dimensions) => {
	let cv;
	if (remote) {
		cv = remote.require("opencv4nodejs");
		imagePath = imagePath.split("ile://")[1];

		let image = cv.imread(imagePath);
		let frame = image;

		let scale = image.rows / dimensions.height;

		let i;
		// normalize to image size
		for(i in anchors) {
			anchors[i].x *= scale;
			anchors[i].y *= scale;
		}

		for(i in vectors) {
			vectors[i][0].x *= scale;
			vectors[i][0].y *= scale;
			vectors[i][1].x *= scale;
			vectors[i][1].y *= scale;
		}

		const vw = new cv.VideoWriter(
			"./renderer/static/assets/previewMovingStill.mp4",
			cv.VideoWriter.fourcc("H264"),
			24,
			new cv.Size(image.cols, image.rows)
		);

		for(let i = 0; i < 48; i++)
		{
			vw.write(image);
		}

		vw.release();

		return './static/assets/previewMovingStill.mp4';	
	}
};
