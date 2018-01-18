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
    const height =
      800 * this.props.boundingRect.height / this.props.boundingRect.width;
    return (
      <div>
        <AnimationDebugger
          animationParams={this.props.animationParams}
          updateAnimationParams={this.props.updateAnimationParams}
        />
        <canvas
          style={{ position: 'absolute' }}
          id="webglcanvas"
          width="800"
          height={height}
        />
        <canvas
          style={{ position: 'absolute' }}
          id="2dcanvas"
          width="800"
          height={height}
        />
      </div>
    );
  }
}

export default MovingStillPreview;
