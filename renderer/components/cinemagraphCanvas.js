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
    };

    this.mask = [];
  }

  componentDidUpdate() {
    if (this.props.isRendering) {
      setTimeout(() => {
        this.props.preview.capture();
      }, 300);
    }
  }

  onBrush = brushPoint => {
    this.props.preview.update(
      brushPoint,
      this.props.brushSize,
      this.props.brushBlur,
      this.props.tool,
    );
  };

  onStrokeStart = () => {
    this.mask = this.props.preview.getMask();
  };

  onStrokeEnd = () => {
    this.props.addCinemagraphBrushStroke(this.mask);
  };

  startPreview = () => {
    if (!this.state.hasLoaded) {
      this.props.startCinemagraphPreview(filePath => {
        fs.readFile(filePath, (err, data) => {
          const file = new File([data], 'output.mp4', {
            type: 'video/mp4',
          });
          this.props.cinemagraphExportComplete(file);
        });
      });
      this.setState({ hasLoaded: true });
    }
  };

  render() {
    return (
      <div className="container">
        <div className="overlay" />
        <BrushCanvas
          boundingRect={this.props.boundingRect}
          onBrush={this.onBrush}
          onStrokeStart={this.onStrokeStart}
          onStrokeEnd={this.onStrokeEnd}
        />
        <video
          style={{
            zIndex: -1,
            position: 'absolute',
          }}
          className="cinemagraphVideo"
          id="cinemagraphVideo"
          src={this.props.videoSrc}
          width={this.props.boundingRect.width}
          height={this.props.boundingRect.height}
          autoPlay={true}
          onPlay={this.startPreview}
          // loop
          // need to include both cuz handled
          // differently on client and server
          muted={true}
          muted
        />
        <canvas
          style={{
            width: `${this.props.boundingRect.width}px`,
            height: `${this.props.boundingRect.height}px`,
            margin: 'auto',
            top: `${this.props.boundingRect.y}px`,
            left: 0,
            right: 0,
            zIndex: 1,
            position: 'absolute',
          }}
          width={this.props.previewDimensions.width}
          height={this.props.previewDimensions.height}
          id="cinemagraphcanvas"
        />
        <canvas
          style={{
            width: `${this.props.boundingRect.width}px`,
            height: `${this.props.boundingRect.height}px`,
            zIndex: -1,
            position: 'absolute',
          }}
          width={this.props.previewDimensions.width}
          height={this.props.previewDimensions.height}
          id="2dcinemagraphvid"
        />
        <canvas
          style={{
            width: `${this.props.boundingRect.width}px`,
            height: `${this.props.boundingRect.height}px`,
            zIndex: -1,
            position: 'absolute',
          }}
          width={this.props.previewDimensions.width}
          height={this.props.previewDimensions.height}
          id="2dcinemagraph"
        />
        <style jsx>{`
          .overlay {
            z-index: 0;
            background-color: ${globalStyles.background};
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
