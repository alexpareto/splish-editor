import fs from 'fs';
import tar from 'tar-fs';
import stream from 'stream';
import getFfmpeg from '../../lib/getFfmpeg';

const electron = require('electron');

class TarToMp4 {
  constructor(tarBlob) {
    const remote = electron.remote || false;

    if (!remote) {
      return;
    }

    console.log('Converting Tar to MP4');
    const directory =
      remote.app.getPath('temp') + '/renderer/static/temp/frames';
    // local state
    this.exportRequested = false;
    this.bufferStreamCompleted = false;
    this.exportPath = '';
    this.exportCallback = () => {};

    fs.readdir(directory, (err, files) => {
      if (files) {
        for (const file of files) {
          fs.unlinkSync(directory + '/' + file);
        }
      }

      const frameDir =
        remote.app.getPath('temp') + '/renderer/static/temp/frames';

      let url = window.URL.createObjectURL(tarBlob);

      const reader = new FileReader();

      reader.onload = () => {
        // exctract .tar to file system
        const buffer = new Buffer(reader.result);
        const bufferStream = new stream.PassThrough();
        bufferStream.end(buffer);

        const streamer = bufferStream.pipe(tar.extract(frameDir));

        streamer.on('finish', () => {
          this.bufferStreamCompleted = true;

          if (this.exportRequested) {
            this.export(this.exportPath, this.exportCallback);
          }
        });
      };

      reader.readAsArrayBuffer(tarBlob);
    });
  }

  reset = () => {
    this.exportRequested = false;
    this.bufferStreamCompleted = false;
    this.exportPath = '';
  };

  // export to local file system
  export = (filePath, callback) => {
    console.log('EXPORTING');
    const remote = electron.remote || false;

    if (!remote) {
      return;
    }

    filePath = remote.app.getPath('temp') + '/renderer/static/temp/';

    this.exportPath = filePath;
    this.exportRequested = true;
    this.exportCallback = callback;

    if (this.bufferStreamCompleted) {
      const ffmpeg = getFfmpeg();
      let command = ffmpeg();
      console.log('OUR REPO: ', remote.app.getPath('temp'));
      command
        .input(
          remote.app.getPath('temp') +
            '/renderer/static/temp/frames/0000%03d.jpg',
        )
        .inputFPS(25)
        .fps(25)
        .output(filePath + 'output.mp4')
        .on('end', () => {
          this.exportCallback(filePath + 'output.mp4');
        })
        .run();
    }
  };
}

export default TarToMp4;
