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
    if (this.preview) {
      this.preview.stop();
    }

    setTimeout(() => {
      if (this.props.display || this.props.isRendering) {
        if (this.state.hasLoaded) {
          this.preview.update(
            this.props.anchors,
            this.props.vectors,
            this.props.duration,
          );
        } else {
          console.log('creating a new preview');
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
                const file = new File([data], 'output.mp4', {
                  type: 'video/mp4',
                });
                this.props.movingStillExportComplete(file);
              });
            },
          );
          this.setState({ hasLoaded: true });
        }
      }
    }, 40);

    // give time for image upload to GPU
    if (this.props.isRendering) {
      setTimeout(() => {
        this.preview.capture();
      }, 300);
      return;
    }
  }

  render() {
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
          width={this.props.previewDimensions.width}
          height={this.props.previewDimensions.height}
          id="webglcanvas"
        />
        <canvas
          style={{
            width: '800px',
            height: `${height}px`,
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
