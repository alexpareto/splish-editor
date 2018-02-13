import React from 'react';
import * as globalStyles from '../globalStyles';
import fs from 'fs';

class MovingStillPreview extends React.Component {
  componentDidUpdate() {
    // give time for image upload to GPU
    // if (this.props.isRendering) {
    //   setTimeout(() => {
    //     this.preview.capture();
    //   }, 300);
    //   return;
    // }
  }

  initializeMovingStillCanvas = () => {
    this.props.initializeMovingStillCanvas();
  };

  render() {
    return (
      <div>
        <img
          onLoad={this.initializeCanvas}
          style={{
            width: `${this.props.boundingRect.width}px`,
            height: `${this.props.boundingRect.height}px`,
            margin: 'auto',
            top: `${this.props.boundingRect.y}px`,
            left: 0,
            right: 0,
            position: 'absolute',
          }}
          src={this.props.imgSrc}
        />
        <canvas
          style={{
            width: `${this.props.boundingRect.width}px`,
            height: `${this.props.boundingRect.height}px`,
            margin: 'auto',
            top: `${this.props.boundingRect.y}px`,
            left: 0,
            right: 0,
            position: 'absolute',
          }}
          width={this.props.previewDimensions.width}
          height={this.props.previewDimensions.height}
          id="webglcanvas"
        />
        <canvas
          style={{
            width: `${this.props.boundingRect.width}px`,
            height: `${this.props.boundingRect.height}px`,
            margin: 'auto',
            top: `${this.props.boundingRect.y}px`,
            left: 0,
            right: 0,
            position: 'absolute',
          }}
          id="2dcanvas"
          width={this.props.previewDimensions.width}
          height={this.props.previewDimensions.height}
        />
      </div>
    );
  }
}

export default MovingStillPreview;
