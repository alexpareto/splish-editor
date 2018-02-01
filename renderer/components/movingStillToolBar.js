import React from 'react';
import * as globalStyles from '../globalStyles';
import FileSelection from './fileSelection';
import FileSaver from './fileSaver';
import IconButton from './iconButton';
import PreviewToggle from './previewToggle';
import Link from 'next/link';
import ExportModal from './exportModal';
import Slider from 'rc-slider';
import Head from 'next/head';

import EyeLogo from './eyelogo';

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      duration: this.props.duration,
    };
  }

  anchorClicked = () => {
    if (this.props.isInitialized) {
      this.props.selectAnchorTool();
    } else {
      this.props.initializeMovingStillCanvas('anchor');
    }
  };

  vectorClicked = () => {
    if (this.props.isInitialized) {
      this.props.selectVectorTool();
    } else {
      this.props.initializeMovingStillCanvas('vector');
    }
  };

  render() {
    const exportModal = this.props.showExportModal ? (
      <ExportModal
        isRendering={this.props.isRendering}
        exports={this.props.exports}
        onComplete={this.props.movingStillShareComplete}
      />
    ) : null;

    return (
      <div className="container">
        <Head>
          <link
            rel="stylesheet"
            type="text/css"
            href="/static/css/rcSlider.css"
          />
        </Head>
        <div className="flex">
          {exportModal}
          <img className="icon" src="/static/icons/splish-liquidlogo.png" />
          <div className="controls">
            <IconButton
              onClick={this.vectorClicked}
              stroke={globalStyles.accent}
              name="arrowDownLeft"
              backgroundColor={globalStyles.secondary}
            />
            <IconButton
              onClick={this.anchorClicked}
              stroke={globalStyles.accent}
              name="anchor"
              backgroundColor={globalStyles.secondary}
            />
            <PreviewToggle
              viewMode={this.props.viewMode}
              startPreview={this.props.startMovingStillPreviewMode}
              startEdit={this.props.startMovingStillEditMode}
            />
            <div className="share-button">
              <IconButton
                onClick={this.props.startExportingMovingStill}
                stroke={globalStyles.accent}
                name="share"
                backgroundColor={globalStyles.secondary}
              />
            </div>
            <div className="slider">
              <span className="slider-label">seconds</span>
              <Slider
                min={1.0}
                step={0.5}
                max={5.0}
                defaultValue={this.props.duration}
                onChange={duration => {
                  this.setState({ duration });
                }}
                onAfterChange={duration => {
                  this.props.updateMovingStillDuration(duration);
                }}
              />
              <span className="level-label">{this.state.duration}s</span>
            </div>
          </div>
          <div>
            <Link href="/mainMenu" prefetch>
              <div className="eye-back">
                <EyeLogo height={30} withText={false} />
                <span>home</span>
              </div>
            </Link>
          </div>
        </div>
        <style jsx>
          {`
            .controls {
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: space-around;
              width: 300px;
            }

            .icon {
              height: 40px;
              margin: 10px;
            }

            .share-button {
              position: absolute;
              top: 150px;
              z-index: 1;
              right: 20px;
            }

            .eye-back {
              position: absolute;
              top: 0;
              right: 0;
              display: inline-flex;
              box-sizing: border-box;
              padding: 10px 15px;
              flex-direction: row;
              align-items: center;
              justify-content: center;
            }

            .eye-back:hover {
              cursor: pointer;
            }

            .slider {
              width: 100px;
              position: relative;
            }

            .slider-label {
              position: absolute;
              top: -17px;
            }

            .level-label {
              position: absolute;
              right: 0;
              margin: 5px 0;
            }

            .flex {
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 100%;
            }

            .container {
              height: 100px;
              width: 100%;
              position: relative;
              background-color: ${globalStyles.background};
              box-shadow: ${globalStyles.lighterBoxShadow};
            }
          `}
        </style>
      </div>
    );
  }
}

export default NavBar;
