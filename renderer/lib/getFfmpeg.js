const electron = require('electron');
import ffmpeg from 'fluent-ffmpeg';

export default () => {
  const remote = electron.remote || false;

  if (!remote) {
    return null;
  }

  const ffmpegPath = remote.getGlobal('ffmpegpath');
  const ffprobePath = remote.getGlobal('ffprobepath');

  ffmpeg.setFfmpegPath(ffmpegPath);
  ffmpeg.setFfprobePath(ffprobePath);
  return ffmpeg;
};
