import React from 'react';
import * as globalStyles from '../globalStyles';
import Preview from '../webgl/helpers/previewMovingStill';
import AnimationDebugger from './animationDebugger';

class MovingStillPreview extends React.Component {
  componentDidMount() {
    this.preview = new Preview(
      this.props.imgSrc,
      this.props.anchors,
      this.props.vectors,
      this.props.boundingRect,
      this.props.animationParams,
    );
  }

  componentWillReceiveProps(props) {
    this.preview.update(this.props.anchors, this.props.vectors);
  }

  render() {
    let height =
      800 * this.props.boundingRect.height / this.props.boundingRect.width;

    return (
      <div>
        <div
          onClick={() => {
            console.log('CAPTURE CLICKED');
            this.preview.capture();
          }}
        >
          CAPTURE
        </div>
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
