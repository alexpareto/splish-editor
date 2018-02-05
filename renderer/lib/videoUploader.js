import getFfmpeg from './getFfmpeg';
import fs from 'fs';
import electron from 'electron';

class UploadVideoStream {
  constructor(exportCallback) {
    this.exportCallback = exportCallback;

    const remote = electron.remote || false;

    if (!remote) {
      return;
    }

    this.dir = remote.app.getPath('temp') + 'frames/';

    if (!fs.existsSync(this.dir)) {
      fs.mkdirSync(this.dir);
    }

    fs.readdir(this.dir, (err, files) => {
      if (files) {
        for (const file of files) {
          fs.unlinkSync(this.dir + file);
        }
      }
    });

    console.log('WRITING TO ', this.dir);
  }

  addFrame = (dataUrl, count) => {
    const data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');
    let leadingZero = count / 100 < 1 ? '0' : '';
    leadingZero = count / 10 < 1 ? '00' : leadingZero;

    fs.writeFileSync(`${this.dir}${leadingZero}${count}.jpg`, data, 'base64');
  };

  upload = () => {
    const ffmpeg = getFfmpeg();
    let command = ffmpeg();
    command
      .input(this.dir + '%03d.jpg')
      .inputFPS(25)
      .fps(25)
      .output(this.dir + 'output.mp4')
      .on('end', () => {
        this.exportCallback(this.dir + 'output.mp4');
      })
      .run();
  };
}

export default UploadVideoStream;
