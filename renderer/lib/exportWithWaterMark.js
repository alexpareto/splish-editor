import getFfmpeg from './getFfmpeg';
import electron from 'electron';

export default (outputPath, videoDimensions, callback) => {
  const remote = electron.remote || false;

  if (!remote) {
    return;
  }

  const pixels = videoDimensions.width * videoDimensions.height;
  let size = 1;
  let waterMarkWidth = 100;
  let waterMarkHeight = 26;

  const mark1 = 50000;
  const mark2 = 1500000;

  if (pixels > mark2) {
    size = 3;
    waterMarkWidth = 250;
    waterMarkHeight = 66;
  } else if (pixels > mark2) {
    size = 2;
    waterMarkWidth = 150;
    waterMarkHeight = 39;
  }

  const dir = remote.app.getPath('temp') + 'frames/';

  const ffmpeg = getFfmpeg();
  let command = ffmpeg();

  command
    .input(dir + 'output.mp4')
    .input(
      `https://s3-us-west-2.amazonaws.com/splish-assets/icons/watermark-${size}.png`,
    )
    .inputFPS(25)
    .fps(25)
    .complexFilter(
      `overlay=${videoDimensions.width -
        (waterMarkWidth + 10)}:${videoDimensions.height -
        (waterMarkHeight + 10)}`,
    )
    .output(outputPath)
    .on('end', () => {
      callback();
    })
    .run();
};
