import { remote } from 'electron';
import fs from 'fs';

export default (mask, video, newPath) => {
  let cv;
  if (remote) {
    cv = remote.require('opencv4nodejs');
    const vc = new cv.VideoCapture(video);
    let frame = vc.read();

    const path = './renderer/static/assets/mask.png';
    fs.writeFileSync(path, mask, { encoding: 'base64' });

    let mMask = cv
      .imread(path, cv.IMREAD_GRAYSCALE)
      .resize(frame.rows, frame.cols)
      .threshold(10, 255, cv.THRESH_BINARY);

    let mMaskInverse = mMask.bitwiseNot();

    let overlay = new cv.Mat(frame.rows, frame.cols, cv.CV_8UC3);

    frame.copyTo(overlay, mMask);

    const vw = new cv.VideoWriter(
      newPath,
      cv.VideoWriter.fourcc('MJPG'),
      24,
      new cv.Size(frame.cols, frame.rows),
    );

    console.log('CV: ', cv);
    let movement = new cv.Mat(frame.rows, frame.cols, cv.CV_8UC3);
    let blended = new cv.Mat(frame.rows, frame.cols, cv.CV_8UC3);

    while (!frame.empty) {
      frame.copyTo(movement, mMaskInverse);
      blended = overlay.add(movement);
      vw.write(blended);
      frame = vc.read();
    }

    vc.release();
    vw.release();

    return newPath;
  }
};
