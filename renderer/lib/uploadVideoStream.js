import getFfmpeg from '../../lib/getFfmpeg';
import fs from 'fs';
import electron from 'electron';

class UploadVideoStream {
  constructor(stream, exportCallback) {
    this.stream = stream;
    const ffmpeg = getFfmpeg();
    let command = ffmpeg();
    const remote = electron.remote || false;

    if (!remote) {
      return;
    }

    filePath = remote.app.getPath('temp') + '/renderer/static/temp/';

    command
      .input(this.stream)
      .inputFPS(25)
      .fps(25)
      .output(filePath + 'output.mp4')
      .on('end', () => {
        console.log('FINISHED EXPORT');
        this.exportCallback(filePath + 'output.mp4');
      })
      .run();
  }

  upload = () => {};
}
