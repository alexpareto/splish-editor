import React from 'react';
import * as globalStyles from '../globalStyles';
import FileSelection from './fileSelection';
import FileSaver from './fileSaver';
import IconButton from './iconButton';
import PreviewToggle from './previewToggle';
import ExportModal from './exportModal';
import Slider from 'rc-slider';
import Link from 'next/link';
import Head from 'next/head';
import Router from 'next/router';
import { Tooltip } from 'react-tippy';

import EyeLogo from './eyelogo';

const electron = require('electron');

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      brushBlur: this.props.brushBlur,
      brushSize: this.props.brushSize / 5,
    };
  }

  toggleTool = () => {
    if (this.props.tool == 'eraser') {
      this.props.selectCinemagraphBrushTool();
    } else {
      this.props.selectCinemagraphEraseTool();
    }
  };

  showQuitDialog = () => {
    // first show confirm quit
    const remote = electron.remote || false;

    if (!remote) {
      return null;
    }
    const { dialog } = remote;

    if (dialog) {
      const dialogOpts = {
        type: 'info',
        buttons: ['Continue', 'Cancel'],
        title: 'Back to Main',
        message: 'Are you sure you want to go back to the main menu?',
        detail:
          'You will lose your current progress on this Splish. All exports will remain.',
      };

      dialog.showMessageBox(dialogOpts, response => {
        if (response === 0) {
          Router.push('/mainMenu');
          this.props.resetCinemagraphState();
        }
      });
    }
  };

  render() {
    const exportModal = this.props.showExportModal ? (
      <ExportModal
        isRendering={this.props.isRendering}
        exportFile={this.props.exportFile}
        isUploading={this.props.isUploading}
        lastUploadedExport={this.props.lastUploadedExport}
        uploadExportRequest={this.props.uploadExportRequest}
        exports={this.props.exports}
        onComplete={this.props.cinemagraphShareComplete}
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
          <link rel="stylesheet" type="text/css" href="/static/css/tippy.css" />
        </Head>
        {exportModal}
        <div className="flex">
          <img className="icon" src="/static/icons/splish-solidlogo.png" />
          <div className="share-button">
            <Tooltip title="export your cinemagraph to share" theme="light">
              <IconButton
                stroke={globalStyles.accent}
                name="share"
                backgroundColor={globalStyles.secondary}
                onClick={this.props.startExportingCinemagraph}
              />
            </Tooltip>
          </div>
          <div className="sliders">
            <div className="tool-button">
              <Tooltip
                title={
                  this.props.tool == 'eraser'
                    ? 'turn off eraser'
                    : 'turn on eraser'
                }
                theme="light"
              >
                <IconButton
                  stroke={globalStyles.accent}
                  name={
                    this.props.tool == 'eraser' ? 'plusCircle' : 'minusCircle'
                  }
                  backgroundColor={globalStyles.secondary}
                  onClick={this.toggleTool}
                />
              </Tooltip>
            </div>
            <div className="tool-button">
              <Tooltip
                title={
                  this.props.showOverlay
                    ? 'turn off overlay'
                    : 'turn on overlay'
                }
                theme="light"
              >
                <IconButton
                  stroke={globalStyles.accent}
                  name={this.props.showOverlay ? 'x' : 'droplet'}
                  backgroundColor={globalStyles.secondary}
                  onClick={this.props.toggleCinemagraphOverlay}
                />
              </Tooltip>
            </div>
            <div className="slider">
              <span className="slider-label">size</span>

              <Slider
                min={1}
                step={1}
                max={20}
                defaultValue={this.props.brushSize / 5}
                onChange={brushSize => {
                  this.setState({ brushSize });
                }}
                onAfterChange={brushSize => {
                  this.props.updateCinemagraphBrushSize(brushSize * 5);
                }}
              />
              <span className="level-label">{this.state.brushSize}px</span>
            </div>
            <div className="slider">
              <span className="slider-label">blur</span>
              <Slider
                min={1}
                step={1}
                max={10}
                defaultValue={this.props.brushBlur}
                onChange={brushBlur => {
                  this.setState({ brushBlur });
                }}
                onAfterChange={brushBlur => {
                  this.props.updateCinemagraphBrushBlur(brushBlur);
                }}
              />
              <span className="level-label">{this.state.brushBlur}0%</span>
            </div>
          </div>
          <div>
            <div className="eye-back" onClick={this.showQuitDialog}>
              <EyeLogo height={30} withText={false} />
              <span>home</span>
            </div>
          </div>
        </div>
        <style jsx>
          {`
            .tool-button {
              margin: 0 10px;
            }
            .icon {
              height: 30px;
              margin: 10px;
            }

            .share-button {
              position: absolute;
              top: 110px;
              z-index: 10;
              right: 10px;
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

            .flex {
              display: flex;
              align-items: center;
              justify-content: space-between;
              height: 100%;
            }

            .slider {
              margin-left: 10px;
              margin-right: 10px;
              width: 150px;
              position: relative;
            }

            .sliders {
              display: flex;
              align-items: center;
              justify-content: space-around;
              height: 100%;
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

            .container {
              height: 100px;
              width: 100%;
              background-color: ${globalStyles.background};
              box-shadow: ${globalStyles.lighterBoxShadow};
              z-index: 1;
            }
          `}
        </style>
      </div>
    );
  }
}

export default NavBar;
