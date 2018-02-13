import React from 'react';
import * as globalStyles from '../globalStyles';
import Head from 'next/head';
import { remote } from 'electron';
import * as d3 from 'd3';

class VectorCanvas extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      svg: null,
      isDown: false,
      hasMoved: false,
      currentAnchor: null,
      data: [],
      path: null,
    };
  }

  componentDidMount() {
    let svg = d3.select('#movingStillSVG');
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

  lineFunction = d3
    .line()
    .x(function(data) {
      return data.x;
    })
    .y(function(data) {
      return data.y;
    });

  onMouseDown = mouse => {
    let data;
    switch (this.props.currentTool) {
      case 'vector':
        data = [{ x: mouse[0], y: mouse[1] }, {}];
        this.setState({ data, isDown: true });
        break;
      case 'anchor':
        this.props.addAnchor({ x: mouse[0], y: mouse[1] });
        break;
      case 'selector':
        data = [{ x: mouse[0], y: mouse[1] }, {}, {}, {}, {}];
        this.setState({ data, isDown: true });
        break;
    }
  };

  onMouseMove = mouse => {
    if (this.state.isDown) {
      let path = this.state.path;
      let data = this.state.data;
      switch (this.props.currentTool) {
        case 'vector':
          if (!path) {
            path = this.state.svg.append('path');
            path
              .attr('stroke', globalStyles.vectorPathColor)
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', '3, 5')
              .attr('stroke-linecap', 'round');
            this.setState({ path });
          }
          data[1] = { x: mouse[0], y: mouse[1] };
          path.attr('d', this.lineFunction(data));
          break;
        case 'selector':
          if (!path) {
            path = this.state.svg.append('path');
            path
              .attr('stroke', globalStyles.selectorOutlineColor)
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', '3, 5')
              .attr('stroke-linecap', 'round')
              .attr('fill', 'none');
            this.setState({ path });
          }
          data[1] = { x: data[0].x, y: mouse[1] };
          data[2] = { x: mouse[0], y: mouse[1] };
          data[3] = { x: mouse[0], y: data[0].y };
          data[4] = { x: data[0].x, y: data[0].y };
          path.attr('d', this.lineFunction(data));
          break;
      }
      this.setState({ hasMoved: true });
    }
  };

  onMouseUp = mouse => {
    if (this.state.hasMoved) {
      // on drag end stuff goes in here
      switch (this.props.currentTool) {
        case 'vector':
          this.props.addVector([
            {
              x: this.state.data[0].x,
              y: this.state.data[0].y,
              path: this.state.path,
            },
            { x: mouse[0], y: mouse[1] },
          ]);
          break;
        case 'selector':
          this.state.path.remove();
          let corners = [this.state.data[0], this.state.data[2]];
          this.props.makeSelection(corners);
          break;
      }
    } else {
      // on click stuff goes here
      switch (this.props.currentTool) {
        case 'selector':
          this.props.makeSelection(null);
          break;
      }
    }

    this.setState({ data: [], isDown: false, path: null, hasMoved: false });
  };

  render() {
    const display = this.props.display ? 'block' : 'none';

    return (
      <div className="container" id="movingStillContainer">
        <svg
          className="d3SVG"
          id="movingStillSVG"
          style={{
            margin: 'auto',
            top: `${this.props.boundingRect.y}px`,
            left: 0,
            right: 0,
          }}
        />
        <style jsx>
          {`
            .container {
              stroke: 2;
              width: 800px;
              display: ${display};
            }
            .d3SVG {
              width: ${this.props.boundingRect.width}px;
              height: ${this.props.boundingRect.height}px;
              z-index: 30000;
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

export default VectorCanvas;
