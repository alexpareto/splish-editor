import { remote } from "electron";
import fs from "fs";

export default (mask, video, dimensions, newPath) => {
	let cv;
	if (remote) {
		cv = remote.require("opencv4nodejs");
		const vc = new cv.VideoCapture(video);
		let frame = vc.read();

		const path = "./renderer/static/assets/mask.png";
		fs.writeFileSync(path, mask, { encoding: "base64" });

		let A = cv
			.imread(path, cv.IMREAD_GRAYSCALE)
			.resize(frame.rows, frame.cols)
			.threshold(10, 255, cv.THRESH_BINARY);

		const [B, G, R] = frame.splitChannels();
		const maskedOverlay = new cv.Mat([B, G, R, A]);

		const vw = new cv.VideoWriter(
			newPath,
			cv.VideoWriter.fourcc("MJPG"),
			24,
			new cv.Size(dimensions.width, dimensions.height)
		);

		while(!frame.empty)
		{
			frame = vc.read();
			vw.write(frame);
		}

		vc.release();
		vw.release();

		return newPath;
	}
};
