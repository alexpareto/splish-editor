import React from 'react';
import * as globalStyles from '../globalStyles';
import electron from 'electron';

class Trimmer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSeeking: false,
      isDownLeft: false,
      isDownRight: false,
      isDownSeek: false,
      isDownStill: false,
    };

    this.wrapperHeight = 70;
    this.trimmerHeight = 40;
    this.trimmerHPadding = 200;
    this.trimmerVPadding = (this.wrapperHeight - this.trimmerHeight) / 2;

    const remote = electron.remote || false;

    if (!remote) {
      return null;
    }

    this.win = remote.getCurrentWindow();
    this.width = this.win.getBounds().width - 2 * this.trimmerHPadding;
    this.trimmerWidth = this.width;
    this.trimmerMarginLeft = -5;
    this.trimmerMarginRight = 0;
    this.dir = 'file://' + remote.app.getPath('temp') + 'thumbnails/';
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
    this.trimmer = document.getElementById('cinemagraphTrimmer');
    this.trimmerRight = document.getElementById('cinemagraphTrimmerRight');

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

  mouseDownLeft = event => {
    this.setState({ isDownLeft: true });
    event.preventDefault();
  };

  mouseDownRight = event => {
    this.setState({ isDownRight: true });
    event.preventDefault();
  };

  mouseMoveTrimmer = event => {
    if (this.state.isDownLeft) {
      this.trimmerMarginLeft = Math.max(
        -5,
        event.clientX - this.trimmerHPadding,
      );
      this.trimmerWidth =
        this.width - this.trimmerMarginLeft - this.trimmerMarginRight - 5;
      this.trimmer.style.width = `${this.trimmerWidth}px`;
      this.trimmer.style.marginLeft = `${this.trimmerMarginLeft}px`;
      this.trimmerRight.style.marginLeft = `${this.trimmerWidth - 2}px`;
    } else if (this.state.isDownRight) {
      const windowWidth = this.win.getBounds().width;
      this.trimmerMarginRight = Math.max(
        0,
        windowWidth - event.clientX - this.trimmerHPadding,
      );
      this.trimmerWidth =
        this.width - this.trimmerMarginLeft - this.trimmerMarginRight - 5;
      this.trimmer.style.width = `${this.trimmerWidth}px`;
      this.trimmerRight.style.marginLeft = `${this.trimmerWidth - 2}px`;
    }

    // this.setState({isSeeking: !this.state.isSeeking});
    event.preventDefault();
  };

  mouseDownTrimmer = event => {
    event.preventDefault();
  };

  mouseUpTrimmer = event => {
    this.setState({
      isSeeking: false,
      isDownRight: false,
      isDownLeft: false,
      isDownStill: false,
    });
    event.preventDefault();
  };

  render() {
    const aspectRatio =
      this.props.videoDimensions.width / this.props.videoDimensions.height;
    const thumbnailWidth = aspectRatio * this.trimmerHeight;
    const numImages = Math.ceil(this.width / thumbnailWidth);
    const everyImage = this.props.numThumbnails / numImages;

    let thumbnailImages = [];

    if (this.props.thumbnailsLoaded) {
      for (let i = 1; i <= numImages; i++) {
        const thumbnail = Math.max(Math.floor(everyImage * i), 1);
        const leadingZero = thumbnail / 10 < 1 ? '0' : '';
        const thumbnailName = `${this.dir}${leadingZero}${thumbnail}.jpg`;
        thumbnailImages.push(thumbnailName);
      }
    }

    return (
      <div
        className="trimContainer"
        onMouseDown={this.mouseDownTrimmer}
        onMouseMove={this.mouseMoveTrimmer}
        onMouseUp={this.mouseUpTrimmer}
      >
        <div className="trimmer" id="cinemagraphTrimmer">
          <div className="trimmerLeft" onMouseDown={this.mouseDownLeft} />
          <div
            className="trimmerRight"
            id="cinemagraphTrimmerRight"
            onMouseDown={this.mouseDownRight}
          />
        </div>
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

          	.trimmerLeft {
          		margin-left: -7px;
          		position: absolute;
          		cursor: col-resize;
          		height: ${this.trimmerHeight}px;
          		width: 9px;
          		z-index: 5;
          	}

          	.trimmerRight {
          		margin-left: ${this.trimmerWidth - 2}px;
          		cursor: col-resize;
          		position: absolute;
          		height: ${this.trimmerHeight}px;
          		width: 9px;
          		z-index: 5;
          	}

          	.trimmer {
          		width: ${this.width}px;
          		border: 5px solid ${globalStyles.accent};
          		margin-left: -5px;
          		height: ${this.trimmerHeight}px;
          		margin-top: ${this.trimmerVPadding - 5}px;
          		position: absolute;
          		border-radius: 7px;
          		z-index: 3;
          	}

          	.ticker {
          		width: 2px;
          		background-color: ${globalStyles.action};
          		height: ${this.trimmerHeight}px;
          		position: absolute;
          		z-index: 1;
          	}

						.thumbnails {
							overflow: hidden;
							border-radius: 5px;
							width: ${this.width}px;
							height: ${this.trimmerHeight}px;
							margin-top: ${this.trimmerVPadding}px;
							white-space: nowrap;
							position: absolute;
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
