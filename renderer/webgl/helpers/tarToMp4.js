import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import tar from 'tar-fs';
import stream from 'stream';

class TarToMp4 {
  constructor(tarBlob) {
    console.log('Converting Tar to MP4');
    // local state
    this.exportRequested = false;
    this.bufferStreamCompleted = false;
    this.exportPath = '';

    const frameDir = './renderer/static/temp/frames';

    let url = window.URL.createObjectURL(tarBlob);

    const reader = new FileReader();

    reader.onload = () => {
      // exctract .tar to file system
      const buffer = new Buffer(reader.result);
      const bufferStream = new stream.PassThrough();
      bufferStream.end(buffer);

      const stream = bufferStream.pipe(tar.extract(frameDir));

      stream.on('finish', () => {
        this.bufferStreamCompleted = true;

        if (this.exportRequested) {
          this.export(this.exportPath);
        }
      });
    };

    reader.readAsArrayBuffer(tarBlob);
  }

  reset = () => {
    this.exportRequested = false;
    this.bufferStreamCompleted = false;
    this.exportPath = '';
  };

  // export to local file system
  export = filePath => {
    this.exportPath = filePath;
    this.exportRequested = true;

    if (this.bufferStreamCompleted) {
      let command = ffmpeg();
      command
        .input('./renderer/static/temp/frames/0000%03d.jpg')
        .output(this.filePath)
        .on('end', function() {
          console.log('EXPORTED MP4 to: ', this.filePath);
        })
        .run();
    }
  };
}

export default TarToMp4;
