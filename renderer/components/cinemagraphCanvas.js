import React from 'react';
import * as globalStyles from '../globalStyles';
import Preview from '../webgl/helpers/renderCinemagraph';
import AnimationDebugger from './animationDebugger';
import fs from 'fs';

class MovingStillPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasPlayed: false,
      hasSelectedVideo: false,
    };
  }

  componentDidUpdate() {
    if (this.state.hasSelectedVideo) {
      if (this.state.hasLoaded) {
        this.preview.update(this.props.anchors, this.props.vectors);
      } else {
        this.preview = new Preview(
          this.props.videoSrc,
          this.props.brushPoints,
          this.props.boundingRect,
          // callback for when the video completes capture
          // Read file and send it to s3, also notify redux
          // to stop capturing the video b/c export is done
          filePath => {
            fs.readFile(filePath, (err, data) => {
              const file = new File([data], 'output.mp4', {
                type: 'video/mp4',
              });

              this.props.uploadExportRequest(file);
            });
          },
        );
        this.setState({ hasLoaded: true });
      }
    }

    // give time for image upload to GPU
    if (this.props.isRendering) {
      setTimeout(() => {
        this.preview.capture();
      }, 300);
      return;
    }
  }

  render() {
    const video = this.props.videoSrc ? (
      <video
        style={{
          zIndex: -1,
          position: 'absolute',
        }}
        className="cinemagraphVideo"
        id="cinemagraphVideo"
        src={this.props.videoSrc}
        width="800px"
        autoPlay={true}
        onPlay={() => {
          this.props.initializeCinemagraphCanvas();
          this.setState({ hasSelectedVideo: true });
        }}
        loop
        muted={true}
      />
    ) : null;

    return (
      <div>
        <div className="overlay" />
        {video}
        <canvas
          style={{
            width: '800px',
            height: `${this.props.videoClientHeight}px`,
            zIndex: 1,
            position: 'absolute',
          }}
          width={this.props.videoDimensions.width}
          height={this.props.videoDimensions.height}
          id="cinemagraphcanvas"
        />
        <style jsx>{`
          .overlay {
            z-index: 0;
            background-color: #ffffff;
            width: 100%;
            height: 100vh;
            position: absolute;
          }
        `}</style>
      </div>
    );
  }
}

export default MovingStillPreview;
