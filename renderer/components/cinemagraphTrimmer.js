import React from 'react';
import * as globalStyles from '../globalStyles';
import electron from 'electron';
import Draggable from 'react-draggable';

class Trimmer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSeeking: false,
    };

    this.currentTime;

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
      this.resetTicker();
    });

    this.video.addEventListener('seeked', this.resetTicker);
  }

  resetTicker = () => {
    if (!this.state.isSeeking) {
      const timeToAnimate =
        Math.min(this.duration, this.props.videoEndTime) -
        this.video.currentTime;

      this.ticker.animate(
        [
          { transform: `translate3d(0px, 0px, 0px)` },
          { transform: `translate3d(${this.trimmerWidth}px, 0px, 0px)` },
        ],
        {
          duration: timeToAnimate * 1000,
          iterations: 1,
        },
      );
    }
  };

  dragStart = event => {
    this.setState({
      isSeeking: true,
    });
    this.currentTime = this.video.currentTime;
    this.props.startSeeking();
    event.preventDefault();
    setTimeout(this.requestAnimationFrame, 40);
    this.ticker.style.display = 'none';
  };

  trimmerDragLeft = event => {
    this.trimmerMarginLeft = Math.max(-5, event.clientX - this.trimmerHPadding);
    this.trimmerWidth =
      this.width - this.trimmerMarginLeft - this.trimmerMarginRight - 5;
    this.trimmer.style.width = `${this.trimmerWidth}px`;
    this.trimmer.style.marginLeft = `${this.trimmerMarginLeft}px`;
    this.trimmerRight.style.marginLeft = `${this.trimmerWidth - 2}px`;

    this.currentTime =
      (this.trimmerMarginLeft + 5) / this.width * this.duration;
    event.preventDefault();
  };

  trimmerDragRight = event => {
    const windowWidth = this.win.getBounds().width;
    this.trimmerMarginRight = Math.max(
      0,
      windowWidth - event.clientX - this.trimmerHPadding,
    );
    this.trimmerWidth =
      this.width - this.trimmerMarginLeft - this.trimmerMarginRight - 5;
    this.trimmer.style.width = `${this.trimmerWidth}px`;
    this.trimmerRight.style.marginLeft = `${this.trimmerWidth - 2}px`;

    this.currentTime =
      (this.trimmerMarginLeft + 5 + this.trimmerWidth) /
      this.width *
      this.duration;
    event.preventDefault();
  };

  trimmerEndLeft = event => {
    const trimTime = (this.trimmerMarginLeft + 5) / this.width * this.duration;
    this.props.cinemagraphTrimFront(trimTime);
    this.ticker.style.marginLeft = `${this.trimmerMarginLeft + 5}px`;
    this.setState({ isSeeking: false });
    event.preventDefault();
    this.ticker.style.display = 'block';
  };

  trimmerEndRight = event => {
    const trimTime =
      (this.trimmerMarginLeft + 5 + this.trimmerWidth) /
      this.width *
      this.duration;
    this.props.cinemagraphTrimBack(trimTime);
    this.setState({ isSeeking: false });
    event.preventDefault();
    this.ticker.style.display = 'block';
  };

  dragStillMove = event => {
    const marginLeft = Math.max(0, event.clientX - this.trimmerHPadding);
    this.currentTime = marginLeft / this.width * this.duration;
    event.preventDefault();
  };

  dragStillEnd = event => {
    this.requestAnimationFrame();
    this.setState({ isSeeking: false });
    setTimeout(() => {
      this.props.cinemagraphSetStillFrame(this.currentTime);
      this.ticker.style.display = 'block';
    }, 50);
  };

  requestAnimationFrame = () => {
    if (this.state.isSeeking) {
      // don't allow the video to end
      this.video.currentTime = this.currentTime;
      setTimeout(this.requestAnimationFrame, 150);
    }
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
      <div className="trimContainer">
        <div className="stillWrapper">
          <Draggable
            bounds="parent"
            axis="x"
            onStart={this.dragStart}
            onDrag={this.dragStillMove}
            onStop={this.dragStillEnd}
          >
            <div className="stillChooser" />
          </Draggable>
        </div>
        <div className="trimmer" id="cinemagraphTrimmer">
          <Draggable
            bounds="parent"
            axis="x"
            onStart={this.dragStart}
            onDrag={this.trimmerDragLeft}
            onStop={this.trimmerEndLeft}
          >
            <div className="trimmerLeft" />
          </Draggable>
          <Draggable
            bounds="parent"
            axis="x"
            onStart={this.dragStart}
            onDrag={this.trimmerDragRight}
            onStop={this.trimmerEndRight}
          >
            <div className="trimmerRight" id="cinemagraphTrimmerRight" />
          </Draggable>
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
          		cursor: col-resize;
          		margin-left: -11px;
          		position: absolute;
          		height: ${this.trimmerHeight}px;
          		width: 13px;
          		z-index: 5;
          	}

          	.stillChooser {
          		width: 0px;
          		height: 0px;
          		border-left: 8px solid transparent;
  						border-right: 8px solid transparent;
  						border-top: 10px solid ${globalStyles.action};
  						border-radius: 3px;
          		position: absolute;
          		border-radius: 2px;
          		z-index: 6;
          	}

          	.trimmerRight {
          		cursor: col-resize;
          		margin-left: ${this.trimmerWidth - 6}px;
          		position: absolute;
          		height: ${this.trimmerHeight}px;
          		width: 13px;
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

          	.stillWrapper {
          		width: ${this.width}px;
          		height: ${this.trimmerHeight}px;
          		margin-top: ${this.trimmerVPadding - 10}px;
          		position: absolute;
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
