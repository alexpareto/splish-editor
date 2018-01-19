import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import tar from 'tar-fs';

const tarToMp4 = (tarBlob, handler) => {
  console.log('tarBlob', tarBlob);

  let url = window.URL.createObjectURL(tarBlob);

  var reader = new FileReader();

  reader.onload = () => {
    var buffer = new Buffer(reader.result);

    fs.writeFile(
      './renderer/static/assets/temp.tar',
      buffer,
      {},
      (err, res) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log('video saved');
        fs
          .createReadStream('./renderer/static/assets/temp.tar')
          .pipe(tar.extract('./renderer/static/assets/temp'));

        let command = ffmpeg();

        setTimeout(() => {
          command
            .input('./renderer/static/assets/temp/0000%03d.jpg')
            .output('./renderer/static/assets/export.mp4')
            .on('end', function() {
              console.log('Finished processing');
            })
            .run();
        }, 500);
      },
    );
  };

  reader.readAsArrayBuffer(tarBlob);
};

export default tarToMp4;
