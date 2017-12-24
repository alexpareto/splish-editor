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

		// let maskedOverlay = new cv.Mat(overlay.rows, overlay.cols, cv.CV_8UC4);
		// overlay.copyToAsync(maskedOverlay, mask);
		
		const [B, G, R] = overlay.splitChannels();
		const maskedOverlay = new cv.Mat([B, G, R, A]);
		console.log("mask: ", maskedOverlay);

		// for(let i = 0; i < maskedOverlay.rows; i++) {
		// 	for(let j = 0; j < maskedOverlay.cols; j++) {
		// 		maskedOverlay.data[i][j][3] = 255;
		// 	}
		// }

		cv.imwrite("./renderer/temp/overlay.png", maskedOverlay);

		return "./renderer/temp/overlay.png";
	}
};
