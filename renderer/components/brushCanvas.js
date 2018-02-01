import React from 'react';
import * as globalStyles from '../globalStyles';
import * as d3 from 'd3';

class brushCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      svg: null,
      isDown: false,
    };
  }

  componentDidMount() {
    let svg = d3.select('#cinemagraphSVG');
    const md = this.onMouseDown;
    const mm = this.onMouseMove;
    const mu = this.onMouseUp;

    svg
      .on('mousedown', function() {
        const m = d3.mouse(this);
        md(m);
      })
      .on('mousemove', function() {
        const m2 = d3.mouse(this);
        mm(m2);
      })
      .on('mouseup', function() {
        const m3 = d3.mouse(this);
        mu(m3);
      });

    this.setState({ svg });
  }

  onMouseDown = mouse => {
    this.setState({ isDown: true });
    this.props.onStrokeStart();
    this.brush(mouse);
  };

  onMouseMove = mouse => {
    if (this.state.isDown) {
      this.brush(mouse);
    }
  };

  onMouseUp = mouse => {
    this.setState({ isDown: false });
    this.props.onStrokeEnd();
  };

  brush = mouse => {
    this.props.onBrush(mouse);
  };

  render() {
    return (
      <div className="container">
        <svg className="d3SVG" id="cinemagraphSVG" />
        <style jsx>
          {`
            .d3SVG {
              width: ${this.props.boundingRect.width}px;
              height: ${this.props.boundingRect.height}px;
              margin: auto;
              top: ${this.props.boundingRect.y}px;
              left: 0;
              right: 0;
              z-index: 3;
              position: absolute;
              user-select: none;
              cursor: crosshair;
            }
          `}
        </style>
      </div>
    );
  }
}

export default brushCanvas;
