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

  render() {
    const exportModal = this.props.showExportModal ? (
      <ExportModal
        isRendering={this.props.isRendering}
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
        </Head>
        <div className="flex">
          {exportModal}
          <Link href="/mainMenu" prefetch>
            <a>
              <IconButton
                stroke={globalStyles.background}
                name="leftChevron"
                backgroundColor={globalStyles.secondary}
              />
            </a>
          </Link>
          <FileSelection
            type="video"
            filesHandler={this.props.selectCinemagraphVideo}
          />
          <IconButton
            stroke={globalStyles.background}
            name={this.props.tool == 'eraser' ? 'plusCircle' : 'minusCircle'}
            backgroundColor={globalStyles.secondary}
            onClick={this.toggleTool}
          />
          <IconButton
            stroke={globalStyles.background}
            name="share"
            backgroundColor={globalStyles.secondary}
            onClick={this.props.startExportingCinemagraph}
          />
          <div className="sliders">
            <div className="slider">
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
              <span className="label">Brush Size: {this.state.brushSize} </span>
            </div>
            <div className="slider">
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
              <span className="label">Brush Blur: {this.state.brushBlur} </span>
            </div>
          </div>
        </div>
        <style jsx>
          {`
          .flex {
            display:flex;
            align-items: center;
            justify-content: center;
            height: 100%;
          }

          .slider {
            margin-left: 10px;
            margin-right: 10px;
          }

          .sliders {
            display:flex;
            align-items: center;
            justify-content: center;
            height: 100%;
          }

          .label {
            display: flex;
            width: 150px;
            justify-content: center;
            align-items: center;
          }

          .container { 
            left; 0; 
            top: 0;
            margin-left: -8px;
            margin-top: -8px;
            height: 45px;
            width: 100vw;
            border-bottom: 1px solid ${globalStyles.primary};
            background-color: ${globalStyles.background};
          };`}
        </style>
      </div>
    );
  }
}

export default NavBar;
