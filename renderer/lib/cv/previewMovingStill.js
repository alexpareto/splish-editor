import { remote } from "electron";
import fs from "fs";

export default (imagePath, vectors, anchors, dimensions) => {
	let cv;
	if (remote) {
		cv = remote.require("opencv4nodejs");
		imagePath = imagePath.split("ile://")[1];

		let image = cv.imread(imagePath);

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
