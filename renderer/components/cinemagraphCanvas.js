import React from 'react';
import * as globalStyles from '../globalStyles';
import AnimationDebugger from './animationDebugger';
import BrushCanvas from './brushCanvas';
import fs from 'fs';

class CinemagraphPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
      hasSelectedVideo: false,
    };
  }

  componentDidUpdate() {
    if (this.state.hasSelectedVideo && !this.state.hasLoaded) {
      this.props.startCinemagraphPreview(filePath => {
        fs.readFile(filePath, (err, data) => {
          const file = new File([data], 'output.mp4', {
            type: 'video/mp4',
          });

          this.props.uploadExportRequest(file);
        });
        this.props.cinemagraphExportComplete();
      });
      this.setState({ hasLoaded: true });
    }

    if (this.props.isRendering) {
      setTimeout(() => {
        this.props.preview.capture();
      }, 300);
      return;
    }
  }

  onBrush = brushPoint => {
    this.props.preview.update(
      brushPoint,
      this.props.brushSize,
      this.props.brushBlur,
    );
  };

  onStrokeEnd = brushPoints => {
    let stroke = {
      points: brushPoints,
      size: this.props.brushSize,
      blur: this.props.brushBlur,
      tool: this.props.tool,
    };

    this.props.addCinemagraphBrushStroke(stroke);
  };

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
          if (!this.state.hasLoaded) {
            this.props.initializeCinemagraphCanvas();
            this.setState({ hasSelectedVideo: true });
          }
        }}
        muted={true}
        loop
      />
    ) : null;

    return (
      <div>
        <div className="overlay" />
        <BrushCanvas
          height={this.props.boundingRect.height}
          onBrush={this.onBrush}
          onStrokeEnd={this.onStrokeEnd}
        />
        {video}
        <canvas
          style={{
            width: '800px',
            height: `${this.props.boundingRect.height}px`,
            zIndex: 1,
            position: 'absolute',
          }}
          width={this.props.videoDimensions.width}
          height={this.props.videoDimensions.height}
          id="cinemagraphcanvas"
        />
        <canvas
          style={{
            width: '800px',
            height: `${this.props.boundingRect.height}px`,
            zIndex: -1,
            position: 'absolute',
          }}
          width={this.props.videoDimensions.width}
          height={this.props.videoDimensions.height}
          id="2dcinemagraph"
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

export default CinemagraphPreview;
