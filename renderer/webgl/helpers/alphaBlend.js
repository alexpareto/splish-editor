import { remote } from 'electron';
import fs from 'fs';

class AlphaBlend {
  constructor(mask, videoPath, exportCallBack) {
    this.mask = mask;
    this.videoPath = videoPath;
    this.exportCallBack = exportCallBack;
  }

  export = () => {
    const cv = remote.require('opencv4nodejs');

    // initialize video reader
    const vc = new cv.VideoCapture(this.videoPath);
    let frame = vc.read();
    // initialize video writer
    const vw = new cv.VideoWriter(
      './renderer/static/temp/output.mp4',
      cv.VideoWriter.fourcc('H264'),
      24,
      new cv.Size(frame.cols, frame.rows),
    );

    fs.writeFile('./renderer/static/temp/mask.png', this.mask, 'base64', () => {
      console.log('1');

      let overlayWithAlpha = cv.imread(
        './renderer/static/temp/mask.png',
        cv.IMREAD_UNCHANGED,
      );
      let [matB, matG, matR, alpha] = overlayWithAlpha.splitChannels();
      let overlay = new cv.Mat([matB, matG, matR]);
      overlay = overlay.convertTo(cv.CV_32FC3);
      alpha = alpha.convertTo(cv.CV_32FC1);
      console.log('2');

      // normalize the alpha between zero and 1
      // then get inverseAlpha 1 - alpha
      let normalizedAlpha = alpha.div(255.0);
      let multiplier = new cv.Mat([
        normalizedAlpha,
        normalizedAlpha,
        normalizedAlpha,
      ]);
      overlay = overlay.hMul(multiplier);
      let double = normalizedAlpha.mul(2.0);
      let ones = new cv.Mat(frame.rows, frame.cols, cv.CV_32FC1, 1.0);
      normalizedAlpha = normalizedAlpha.add(ones);
      normalizedAlpha = normalizedAlpha.sub(double);
      console.log('3');

      multiplier = new cv.Mat([
        normalizedAlpha,
        normalizedAlpha,
        normalizedAlpha,
      ]);

      let i = 0;

      while (!frame.empty) {
        frame = frame.convertTo(cv.CV_32FC3);
        frame = frame.hMul(multiplier);
        frame = frame.add(overlay);
        frame = frame.convertTo(cv.CV_8UC3);
        vw.write(frame);
        frame = vc.read();
        console.log('FRAME ', i);
        i++;
      }

      vc.release();
      vw.release();
      console.log('Video Export Complete');

      this.exportCallBack('./renderer/static/temp/output.mp4');
    });
  };
}

export default AlphaBlend;
