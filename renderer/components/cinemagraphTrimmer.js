import React from 'react';
import * as globalStyles from '../globalStyles';
import electron from 'electron';

class Trimmer extends React.Component {
  render() {
    const remote = electron.remote || false;

    if (!remote) {
      return null;
    }

    const wrapperHeight = 70;
    const trimmerHeight = 40;
    const trimmerHPadding = 30;
    const trimmerVPadding = (wrapperHeight - trimmerHeight) / 2;
    const win = remote.getCurrentWindow();
    const width = win.getBounds().width - 2 * trimmerHPadding;
    const aspectRatio =
      this.props.videoDimensions.width / this.props.videoDimensions.height;
    const thumbnailWidth = aspectRatio * trimmerHeight;
    const numImages = Math.ceil(width / thumbnailWidth);
    const everyImage = this.props.numThumbnails / numImages;
    const dir = 'file://' + remote.app.getPath('temp') + 'thumbnails/';
    console.log('GOING TO DIRECTORY: ', dir);

    let thumbnailImages = [];

    if (this.props.thumbnailsLoaded) {
      for (let i = 1; i <= numImages; i++) {
        const thumbnail = Math.max(Math.floor(everyImage * i), 1);
        const leadingZero = thumbnail / 10 < 1 ? '0' : '';
        const thumbnailName = `${dir}${leadingZero}${thumbnail}.jpg`;
        thumbnailImages.push(thumbnailName);
      }
    }

    return (
      <div className="trimContainer">
        <div className="thumbnails">
          {thumbnailImages.map((imgSrc, index) => {
            return (
              <img
                key={index}
                style={{
                  width: `${thumbnailWidth}px`,
                  height: `${trimmerHeight}px`,
                  margin: 0,
                }}
                src={imgSrc}
              />
            );
          })}
        </div>
        <style jsx>
          {`
						.thumbnails {
							overflow: hidden;
							width: ${width}px;
							height: ${trimmerHeight}px;
							margin-top: ${trimmerVPadding}px;
							white-space: nowrap;
						};

            .trimContainer {
            	position: fixed;
            	height: ${wrapperHeight}px;
            	width: 100%;
            	bottom: 0;
            	padding-left: ${trimmerHPadding}px;
            	padding-right ${trimmerHPadding}px;
            	z-index: 10;
            };
          `}
        </style>
      </div>
    );
  }
}

export default Trimmer;
