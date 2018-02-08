import getFfmpeg from './getFfmpeg';
import electron from 'electron';

export default (outputPath, videoDimensions, callback) => {
  const remote = electron.remote || false;

  if (!remote) {
    return;
  }

  this.dir = remote.app.getPath('temp');

  const ffmpeg = getFfmpeg();
  let command = ffmpeg();

  command
    .input(this.dir + 'output.mp4')
    .input('./renderer/static/icons/watermark-1.png')
    .inputFPS(25)
    .fps(25)
    .complexFilter('overlay=10:10')
    .output(outputPath)
    .on('end', () => {
      console.log('UPLOADING');
    })
    .run();
};
