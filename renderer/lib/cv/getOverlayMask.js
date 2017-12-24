import { remote } from "electron";
import fs from "fs";

export default (mask, video, videoTime = 0) => {
	let cv;
	if (remote) {
		cv = remote.require("opencv4nodejs");
		const vc = new cv.VideoCapture(video);
		let overlay = vc.read();

		const path = "./renderer/static/assets/mask.png";
		fs.writeFileSync(path, mask, { encoding: "base64" });
		let A = cv
			.imread(path, cv.IMREAD_GRAYSCALE)
			.resize(overlay.rows, overlay.cols)
			.threshold(10, 255, cv.THRESH_BINARY);
		
		const [B, G, R] = overlay.splitChannels();
		const maskedOverlay = new cv.Mat([B, G, R, A]);

		cv.imwrite("./renderer/static/assets/overlay.png", maskedOverlay);

		return "./static/assets/overlay.png";
	}
};
