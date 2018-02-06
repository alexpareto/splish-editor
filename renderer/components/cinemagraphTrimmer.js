import React from 'react';
import * as globalStyles from '../globalStyles';
import electron from 'electron';

class Trimmer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSeeking: false,
    };

    this.wrapperHeight = 70;
    this.trimmerHeight = 40;
    this.trimmerHPadding = 30;
    this.trimmerVPadding = (this.wrapperHeight - this.trimmerHeight) / 2;
  }

  // set up listeners
  componentDidMount() {
    const remote = electron.remote || false;

    if (!remote) {
      return null;
    }

    this.win = remote.getCurrentWindow();

    this.video = document.getElementById('cinemagraphVideo');
    this.ticker = document.getElementById('cinemagraphTicker');

    this.video.addEventListener('loadedmetadata', () => {
      console.log('DURATION: ', this.video.duration);
      this.duration = this.video.duration;
    });

    this.video.addEventListener('seeked', this.resetTicker);
    this.video.addEventListener('play', this.resetTicker);
  }

  resetTicker = () => {
    if (!this.state.isSeeking) {
      const timeToAnimate = this.duration - this.video.currentTime;
      const width = this.win.getBounds().width - 2 * this.trimmerHPadding;
      const currentPos = width * (this.video.currentTime / this.duration);

      this.ticker.animate(
        [
          { transform: `translate3d(${currentPos}px, 0px, 0px)` },
          { transform: `translate3d(${width}px, 0px, 0px)` },
        ],
        {
          duration: timeToAnimate * 1000,
          iterations: 1,
        },
      );
    }
  };

  render() {
    const remote = electron.remote || false;

    if (!remote) {
      return null;
    }

    const win = remote.getCurrentWindow();
    const width = win.getBounds().width - 2 * this.trimmerHPadding;
    const dir = 'file://' + remote.app.getPath('temp') + 'thumbnails/';

    const aspectRatio =
      this.props.videoDimensions.width / this.props.videoDimensions.height;
    const thumbnailWidth = aspectRatio * this.trimmerHeight;
    const numImages = Math.ceil(width / thumbnailWidth);
    const everyImage = this.props.numThumbnails / numImages;

    let thumbnailImages = [];

    if (this.props.thumbnailsLoaded) {
      for (let i = 1; i <= numImages; i++) {
        const thumbnail = Math.max(Math.floor(everyImage * i), 1);
        const leadingZero = thumbnail / 10 < 1 ? '0' : '';
        const thumbnailName = `${dir}${leadingZero}${thumbnail}.jpg`;
        thumbnailImages.push(thumbnailName);
      }
    }

    const currentPos = this.video
      ? width * (this.video.currentTime / this.duration)
      : 0;
    const anim = this.video
      ? 'animation: showProgress infinite linear 3s;'
      : '';

    return (
      <div className="trimContainer">
        <div className="thumbnails">
          <div className="ticker" id="cinemagraphTicker" />
          {thumbnailImages.map((imgSrc, index) => {
            return (
              <img
                key={index}
                style={{
                  width: `${thumbnailWidth}px`,
                  height: `${this.trimmerHeight}px`,
                  margin: 0,
                }}
                src={imgSrc}
              />
            );
          })}
        </div>
        <style jsx>
          {`
          	.ticker {
          		width: 2px;
          		background-color: ${globalStyles.action};
          		height: ${this.trimmerHeight}px;
          		position: absolute;
          	}
						.thumbnails {
							overflow: hidden;
							width: ${width}px;
							height: ${this.trimmerHeight}px;
							margin-top: ${this.trimmerVPadding}px;
							white-space: nowrap;
						};

            .trimContainer {
            	position: fixed;
            	height: ${this.wrapperHeight}px;
            	width: 100%;
            	bottom: 0;
            	padding-left: ${this.trimmerHPadding}px;
            	padding-right ${this.trimmerHPadding}px;
            	z-index: 10;
            };
          `}
        </style>
      </div>
    );
  }
}

export default Trimmer;
