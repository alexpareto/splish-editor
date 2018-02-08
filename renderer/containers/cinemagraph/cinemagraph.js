import React from 'react';
import NavBar from '../../components/cinemagraphToolBar';
import CinemagraphCanvas from '../../components/cinemagraphCanvas';
import CinemagraphTrimmer from '../../components/cinemagraphTrimmer';
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
            exportFile={this.props.cinemagraph.file}
            isRendering={this.props.cinemagraph.isRendering}
            isUploading={this.props.isUploading}
            lastUploadedExport={this.props.lastUploadedExport}
            videoDimensions={this.props.cinemagraph.previewDimensions}
            uploadExportRequest={this.props.uploadExportRequest}
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
            resetCinemagraphState={this.props.resetCinemagraphState}
          />
          <CinemagraphCanvas
            initializeCinemagraphCanvas={this.props.initializeCinemagraphCanvas}
            videoSrc={this.props.cinemagraph.videoPath}
            boundingRect={this.props.cinemagraph.boundingRect}
            isRendering={this.props.cinemagraph.isRendering}
            previewDimensions={this.props.cinemagraph.previewDimensions}
            cinemagraphExportComplete={this.props.cinemagraphExportComplete}
            brushSize={this.props.cinemagraph.brushSize}
            brushBlur={this.props.cinemagraph.brushBlur}
            addCinemagraphBrushStroke={this.props.addCinemagraphBrushStroke}
            startCinemagraphPreview={this.props.startCinemagraphPreview}
            preview={this.props.cinemagraph.preview}
            showOverlay={this.props.cinemagraph.showOverlay}
            videoStartTime={this.props.cinemagraph.videoStartTime}
            tool={this.props.cinemagraph.tool}
          />
          <CinemagraphTrimmer
            videoStartTime={this.props.cinemagraph.videoStartTime}
            videoEndTime={this.props.cinemagraph.videoEndTime}
            thumbnailsLoaded={this.props.cinemagraph.thumbnailsLoaded}
            numThumbnails={this.props.cinemagraph.numThumbnails}
            videoDimensions={this.props.cinemagraph.previewDimensions}
            cinemagraphTrimBack={this.props.cinemagraphTrimBack}
            cinemagraphTrimFront={this.props.cinemagraphTrimFront}
            startSeeking={this.props.cinemagraphStartSeeking}
            cinemagraphSetStillFrame={this.props.cinemagraphSetStillFrame}
          />
        </div>
      </Holder>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    startExportingCinemagraph: () =>
      dispatch(Actions.startExportingCinemagraph()),
    uploadExportRequest: (file, title, description, license) =>
      dispatch(
        ExportActions.uploadExportRequest(file, title, description, license),
      ),
    cinemagraphExportComplete: file =>
      dispatch(Actions.cinemagraphExportComplete(file)),
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
    resetCinemagraphState: () => dispatch(Actions.resetCinemagraphState()),
    cinemagraphTrimFront: time => dispatch(Actions.cinemagraphTrimFront(time)),
    cinemagraphTrimBack: time => dispatch(Actions.cinemagraphTrimBack(time)),
    cinemagraphStartSeeking: () => dispatch(Actions.cinemagraphStartSeeking()),
    cinemagraphSetStillFrame: time =>
      dispatch(Actions.cinemagraphSetStillFrame(time)),
  };
};

const mapStateToProps = state => ({
  cinemagraph: state.cinemagraph,
  exports: state.exports.exports,
  isUploading: state.exports.uploadRequestSent,
  lastUploadedExport: state.exports.lastUploadedExport,
});

export default connect(mapStateToProps, mapDispatchToProps)(Cinemagraph);
