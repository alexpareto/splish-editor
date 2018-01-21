import React from 'react';
import * as globalStyles from '../globalStyles';
import Preview from '../webgl/helpers/previewMovingStill';
import AnimationDebugger from './animationDebugger';
import fs from 'fs';

class MovingStillPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasLoaded: false,
    };
  }

  componentDidUpdate() {
    if (this.props.display || this.props.isRendering) {
      if (this.state.hasLoaded) {
        this.preview.update(props.anchors, props.vectors);
      } else {
        this.preview = new Preview(
          this.props.imgSrc,
          this.props.anchors,
          this.props.vectors,
          this.props.boundingRect,
          this.props.animationParams,
          // callback for when the video completes capture
          // Read file and send it to s3, also notify redux
          // to stop capturing the video b/c export is done
          filePath => {
            this.props.uploadExportRequest(fs.createReadStream(filePath));
            this.props.movingStillExportComplete();
          },
        );
      }
    }

    // give time for image upload to GPU
    if (this.props.isRendering) {
      setTimeout(() => {
        this.preview.capture();
      }, 300);
      return;
    }

    if (!this.props.display && this.preview) {
      this.preview.stop();
    }
  }

  render() {
    let height =
      800 * this.props.boundingRect.height / this.props.boundingRect.width;

    return (
      <div>
        <AnimationDebugger
          animationParams={this.props.animationParams}
          updateAnimationParams={this.props.updateAnimationParams}
        />
        <canvas
          style={{
            width: '800px',
            height: `${height}px`,
            position: 'absolute',
          }}
          width={this.props.imgDimensions.width}
          height={this.props.imgDimensions.height}
          id="webglcanvas"
        />
        <canvas
          style={{
            width: '800px',
            height: `${height}px`,
            position: 'absolute',
          }}
          id="2dcanvas"
          width={this.props.imgDimensions.width}
          height={this.props.imgDimensions.height}
        />
      </div>
    );
  }
}

export default MovingStillPreview;
