import React from 'react';
import * as globalStyles from '../globalStyles';
import Preview from '../webgl/helpers/previewMovingStill';
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
        this.preview.update(
          this.props.anchors,
          this.props.vectors,
          this.props.duration,
        );
      } else {
        this.preview = new Preview(
          this.props.imgSrc,
          this.props.anchors,
          this.props.vectors,
          this.props.boundingRect,
          this.props.animationParams,
          this.props.duration,
          // callback for when the video completes capture
          // Read file and send it to s3, also notify redux
          // to stop capturing the video b/c export is done
          filePath => {
            fs.readFile(filePath, (err, data) => {
              const file = new File([data], 'output.txt', {
                type: 'video/mp4',
              });

              this.props.uploadExportRequest(file);
            });
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
    console.log('BOUNDING RECT in PREVIEW: ', this.props.boundingRect);
    let height =
      800 * this.props.boundingRect.height / this.props.boundingRect.width;

    return (
      <div>
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
