import React from 'react';
import * as globalStyles from '../globalStyles';
import fs from 'fs';

class MovingStillPreview extends React.Component {
  componentDidMount() {
    this.props.initializeMovingStillCanvas(
      // callback for when the video completes capture
      // Read file and send it to s3, also notify redux
      // to stop capturing the video b/c export is done
      filePath => {
        fs.readFile(filePath, (err, data) => {
          const file = new File([data], 'output.txt', {
            type: 'video/mp4',
          });
          this.props.movingStillExportComplete(file);
        });
      },
    );
  }

  render() {
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
            zIndex: '1',
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
            zIndex: '0',
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
