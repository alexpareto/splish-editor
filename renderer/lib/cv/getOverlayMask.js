import { remote } from "electron";
import fs from "fs";

export default (mask, video, videoTime = 0) => {
	let cv;
	if (remote) {
		cv = remote.require("opencv4nodejs");
		const vc = new cv.VideoCapture(video);
		console.log("CV: ", cv);
		let overlay = vc.read();

		const path = "./renderer/temp/mask.png";
		fs.writeFileSync(path, mask, { encoding: "base64" });
		let A = cv
			.imread(path, cv.IMREAD_GRAYSCALE)
			.resize(overlay.rows, overlay.cols)
			.threshold(10, 255, cv.THRESH_BINARY);

		cv.imwrite("./renderer/temp/greymask.png", A);
		
		const [B, G, R] = overlay.splitChannels();
		const maskedOverlay = new cv.Mat([B, G, R, A]);
		console.log("mask: ", maskedOverlay);

		cv.imwrite("./renderer/temp/overlay.png", maskedOverlay);

		return "./renderer/temp/overlay.png";
	}
};
