import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

const webmToMp4 = (videoBlob, handler) => {
  console.log('videoBlob', videoBlob);

  let url = window.URL.createObjectURL(videoBlob);

  var reader = new FileReader();

  reader.onload = () => {
    var buffer = new Buffer(reader.result);

    fs.writeFile(
      './renderer/static/assets/temp.webm',
      buffer,
      {},
      (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('video saved');
      },
    );
  };

  reader.readAsArrayBuffer(videoBlob);
};

export default webmToMp4;
