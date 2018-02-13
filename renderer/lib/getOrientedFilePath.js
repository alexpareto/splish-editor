import electron from 'electron';
import getFfmpeg from './getFfmpeg';

export default (filePath, callback) => {
  var ExifImage = require('exif').ExifImage;

  const remote = electron.remote || false;

  if (!remote) {
    return;
  }

  const dir = remote.app.getPath('temp') + 'reoriented/';

  new ExifImage({ image: filePath.split('file://')[1] }, (error, exifData) => {
    console.log('ERROR: ', error);
    console.log('exifData: ', exifData);
    const ffmpeg = getFfmpeg();
  });
};
