import React from 'react';
import * as globalStyles from '../globalStyles';
import IconButton from './iconButton';
import Slider from 'rc-slider';
import Head from 'next/head';

class AnimationDebugger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShown: false,
      dragDistance: props.animationParams.dragDistance,
      anchorImpact: props.animationParams.anchorImpact,
      flowMultiplier: props.animationParams.flowMultiplier,
      flowDivisor: props.animationParams.flowDivisor,
      impactDivisor: props.animationParams.impactDivisor,
    };
  }

  updateParams = () => {
    if (this.state.isShown) {
      let params = {
        dragDistance: this.state.dragDistance,
        anchorImpact: this.state.anchorImpact,
        flowMultiplier: this.state.flowMultiplier,
        flowDivisor: this.state.flowDivisor,
        impactDivisor: this.state.impactDivisor,
      };

      this.props.updateAnimationParams(params);
    }
    this.setState({ isShown: !this.state.isShown });
  };

  updateDragDistance = newVal => {
    this.setState({ dragDistance: newVal });
  };

  updateAnchorImpact = newVal => {
    this.setState({ anchorImpact: newVal });
  };

  updateFlowMultiplier = newVal => {
    this.setState({ flowMultiplier: newVal });
  };

  updateFlowDivisor = newVal => {
    this.setState({ flowDivisor: newVal });
  };

  updateImpactDivisor = newVal => {
    this.setState({ impactDivisor: newVal });
  };

  render() {
    const sliders = this.state.isShown ? (
      <div className="sliders">
        <span>Drag Distance:</span>
        <span>{this.state.dragDistance}</span>
        <Slider
          min={0.0}
          step={0.5}
          max={200.0}
          defaultValue={this.props.animationParams.dragDistance}
          onChange={this.updateDragDistance}
        />
        <span>Anchor Impact:</span>
        {this.state.anchorImpact}
        <Slider
          min={0.0}
          step={0.2}
          max={20.0}
          defaultValue={this.props.animationParams.anchorImpact}
          onChange={this.updateAnchorImpact}
        />
        <span> Flow Multiplier: </span>
        {this.state.flowMultiplier}
        <Slider
          min={0.0}
          step={0.5}
          max={3000.0}
          defaultValue={this.props.animationParams.flowMultiplier}
          onChange={this.updateFlowMultiplier}
        />
        <span>Flow Divisor: </span>
        {this.state.flowDivisor}
        <Slider
          min={0.0}
          step={1.0}
          max={6000.0}
          defaultValue={this.props.animationParams.flowDivisor}
          onChange={this.updateFlowDivisor}
        />
        <span>Impact Divisor:</span>
        {this.state.impactDivisor}

        <Slider
          min={0.0}
          step={0.5}
          max={30.0}
          defaultValue={this.props.animationParams.impactDivisor}
          onChange={this.updateImpactDivisor}
        />
        <style jsx>
          {`
            .sliders {
              padding-top: 10vh;
              height: 100vh;
              display: flex;
              align-items: center;
              width: 70vw;
              flex-direction: column;
            }
          `}
        </style>
      </div>
    ) : null;

    const icon = this.state.isShown ? 'x' : 'zap';

    return (
      <div className="container">
        <Head>
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/css/rcSlider.css"
          />
        </Head>
        <div className="button">
          <IconButton
            stroke={globalStyles.background}
            name={icon}
            backgroundColor={globalStyles.secondary}
            onClick={this.updateParams}
          />
        </div>
        {sliders}
        <style jsx>
          {`
            .button {
              width: 40px;
            }
            .container {
              position: absolute;
              display: flex;
              flex-direction: column;
              justify-content: center;
              margin-left: -8px;
              align-items: center;
              z-index: 3000000;
              top: 15vh;
              background-color: rgba(255, 255, 255, 0.7);
              width: 100vw;
            }
          `}
        </style>
      </div>
    );
  }
}

export default AnimationDebugger;
