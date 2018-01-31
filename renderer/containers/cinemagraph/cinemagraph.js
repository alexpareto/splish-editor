import React from 'react';
import NavBar from '../../components/cinemagraphToolBar';
import CinemagraphCanvas from '../../components/cinemagraphCanvas';
import Trimmer from '../../components/trimmer';
import { connect } from 'react-redux';
import * as Actions from './actions';
import * as ExportActions from '../exports/actions';
import CinemagraphShortcuts from './cinemagraphShortcuts';

import Holder from '../../components/holder';

class Cinemagraph extends React.Component {
  constructor(props) {
    super(props);

    this.shortcuts = new CinemagraphShortcuts(
      this.props.undoCinemagraph,
      this.props.redoCinemagraph,
    );
  }

  render() {
    return (
      <Holder>
        <div
          style={{
            height: '100%',
            width: '100%',
            userSelect: 'none',
          }}
          onKeyDown={event => {
            this.shortcuts.keyStroke(event, this.props.cinemagraph);
          }}
          tabIndex="0"
        >
          <NavBar
            selectCinemagraphVideo={this.props.selectCinemagraphVideo}
            startExportingCinemagraph={this.props.startExportingCinemagraph}
            cinemagraphShareComplete={this.props.cinemagraphShareComplete}
            showExportModal={this.props.cinemagraph.showExportModal}
            isRendering={this.props.cinemagraph.isRendering}
            updateCinemagraphBrushBlur={this.props.updateCinemagraphBrushBlur}
            updateCinemagraphBrushSize={this.props.updateCinemagraphBrushSize}
            selectCinemagraphBrushTool={this.props.selectCinemagraphBrushTool}
            selectCinemagraphEraseTool={this.props.selectCinemagraphEraseTool}
            exports={this.props.exports}
            brushSize={this.props.cinemagraph.brushSize}
            brushBlur={this.props.cinemagraph.brushBlur}
            toggleCinemagraphOverlay={this.props.toggleCinemagraphOverlay}
            showOverlay={this.props.cinemagraph.showOverlay}
            tool={this.props.cinemagraph.tool}
          />
          <CinemagraphCanvas
            initializeCinemagraphCanvas={this.props.initializeCinemagraphCanvas}
            videoSrc={this.props.cinemagraph.videoPath}
            boundingRect={this.props.cinemagraph.boundingRect}
            isRendering={this.props.cinemagraph.isRendering}
            videoDimensions={this.props.cinemagraph.videoDimensions}
            cinemagraphExportComplete={this.props.cinemagraphExportComplete}
            uploadExportRequest={this.props.uploadExportRequest}
            brushSize={this.props.cinemagraph.brushSize}
            brushBlur={this.props.cinemagraph.brushBlur}
            addCinemagraphBrushStroke={this.props.addCinemagraphBrushStroke}
            startCinemagraphPreview={this.props.startCinemagraphPreview}
            preview={this.props.cinemagraph.preview}
            showOverlay={this.props.cinemagraph.showOverlay}
            tool={this.props.cinemagraph.tool}
          />
          <Trimmer />
        </div>
      </Holder>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectCinemagraphVideo: files =>
      dispatch(Actions.selectCinemagraphVideo(files)),
    initializeCinemagraphCanvas: callback =>
      dispatch(Actions.initializeCinemagraphCanvas(callback)),
    startExportingCinemagraph: () =>
      dispatch(Actions.startExportingCinemagraph()),
    uploadExportRequest: file =>
      dispatch(ExportActions.uploadExportRequest(file)),
    cinemagraphExportComplete: () =>
      dispatch(Actions.cinemagraphExportComplete()),
    cinemagraphShareComplete: () =>
      dispatch(Actions.cinemagraphShareComplete()),
    updateCinemagraphBrushBlur: brushBlur =>
      dispatch(Actions.updateCinemagraphBrushBlur(brushBlur)),
    updateCinemagraphBrushSize: brushSize =>
      dispatch(Actions.updateCinemagraphBrushSize(brushSize)),
    addCinemagraphBrushStroke: mask =>
      dispatch(Actions.addCinemagraphBrushStroke(false, false, mask)),
    startCinemagraphPreview: callback =>
      dispatch(Actions.startCinemagraphPreview(callback)),
    undoCinemagraph: actionObject =>
      dispatch(Actions.undoCinemagraph(actionObject)),
    redoCinemagraph: actionObject =>
      dispatch(Actions.redoCinemagraph(actionObject)),
    selectCinemagraphBrushTool: () =>
      dispatch(Actions.selectCinemagraphBrushTool()),
    selectCinemagraphEraseTool: () =>
      dispatch(Actions.selectCinemagraphEraseTool()),
    toggleCinemagraphOverlay: () =>
      dispatch(Actions.toggleCinemagraphOverlay()),
  };
};

const mapStateToProps = state => ({
  cinemagraph: state.cinemagraph,
  exports: state.exports.exports,
});

export default connect(mapStateToProps, mapDispatchToProps)(Cinemagraph);
