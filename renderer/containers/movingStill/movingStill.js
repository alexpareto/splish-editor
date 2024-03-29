import React from 'react';
import ToolBar from '../../components/movingStillToolBar';
import VectorCanvas from '../../components/vectorCanvas';
import MovingStillPreview from '../../components/movingStillPreview';
import { connect } from 'react-redux';
import * as Actions from './actions';
import * as ExportActions from '../exports/actions';
import MovingStillShortcuts from './movingStillShortcuts';
import Holder from '../../components/holder';

class MovingStill extends React.Component {
  constructor(props) {
    super(props);

    this.shortcuts = new MovingStillShortcuts(
      this.props.undoMovingStill,
      this.props.redoMovingStill,
      this.props.deleteSelection,
    );
  }
  render() {
    const showVectors = this.props.movingStill.viewMode == 'edit';

    return (
      <Holder>
        <div
          style={{
            height: '100%',
            width: '100%',
            userSelect: 'none',
          }}
          onKeyDown={event => {
            this.shortcuts.keyStroke(event, this.props.movingStill);
          }}
          tabIndex="0"
        >
          <ToolBar
            viewMode={this.props.movingStill.viewMode}
            selectAnchorTool={this.props.selectAnchorTool}
            selectVectorTool={this.props.selectVectorTool}
            isInitialized={this.props.movingStill.isInitialized}
            startMovingStillPreviewMode={this.props.startMovingStillPreviewMode}
            startMovingStillEditMode={this.props.startMovingStillEditMode}
            startExportingMovingStill={this.props.startExportingMovingStill}
            showExportModal={this.props.movingStill.showExportModal}
            movingStillShareComplete={this.props.movingStillShareComplete}
            videoDimensions={this.props.movingStill.previewDimensions}
            isRendering={this.props.movingStill.isRendering}
            isUploading={this.props.isUploading}
            lastUploadedExport={this.props.lastUploadedExport}
            videoFile={this.props.movingStill.videoFile}
            previewFile={this.props.movingStill.previewFile}
            uploadExportRequest={this.props.uploadExportRequest}
            updateMovingStillDuration={this.props.updateMovingStillDuration}
            selectSelectionTool={this.props.selectSelectionTool}
            exports={this.props.exports}
            duration={this.props.movingStill.duration}
            resetMovingStillState={this.props.resetMovingStillState}
            currentTool={this.props.movingStill.currentTool}
          />
          <MovingStillPreview
            isRendering={this.props.movingStill.isRendering}
            initializeMovingStillCanvas={this.props.initializeMovingStillCanvas}
            imgSrc={this.props.movingStill.imgPath}
            anchors={this.props.movingStill.anchors}
            vectors={this.props.movingStill.vectors}
            previewDimensions={this.props.movingStill.previewDimensions}
            animationParams={this.props.movingStill.animationParams}
            updateAnimationParams={this.props.updateAnimationParams}
            boundingRect={this.props.movingStill.boundingRect}
            isRendering={this.props.movingStill.isRendering}
            movingStillExportComplete={this.props.movingStillExportComplete}
            duration={this.props.movingStill.duration}
          />
          <VectorCanvas
            display={showVectors}
            currentTool={this.props.movingStill.currentTool}
            imgSrc={this.props.movingStill.imgPath}
            boundingRect={this.props.movingStill.boundingRect}
            addVector={this.props.addVector}
            addAnchor={this.props.addAnchor}
            makeSelection={this.props.makeSelection}
          />
        </div>
      </Holder>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initializeMovingStillCanvas: callback =>
      dispatch(Actions.initializeMovingStillCanvas(callback)),
    startMovingStillPreviewMode: () =>
      dispatch(Actions.startMovingStillPreviewMode()),
    startMovingStillEditMode: () =>
      dispatch(Actions.startMovingStillEditMode()),
    renderMovingStill: path => dispatch(Actions.renderMovingStill(path)),
    selectVectorTool: () => dispatch(Actions.selectVectorTool()),
    selectAnchorTool: () => dispatch(Actions.selectAnchorTool()),
    addVector: vector => dispatch(Actions.addVector(false, false, vector)),
    addAnchor: anchor => dispatch(Actions.addAnchor(false, false, anchor)),
    updateAnimationParams: params =>
      dispatch(Actions.updateAnimationParams(params)),
    startExportingMovingStill: () =>
      dispatch(Actions.startExportingMovingStill()),
    movingStillExportComplete: file =>
      dispatch(Actions.movingStillExportComplete(file)),
    uploadExportRequest: (
      videoFile,
      previewFile,
      dimensions,
      title,
      description,
      license,
      privacy_level,
    ) =>
      dispatch(
        ExportActions.uploadExportRequest(
          videoFile,
          previewFile,
          dimensions,
          title,
          description,
          license,
          privacy_level,
        ),
      ),
    movingStillShareComplete: () =>
      dispatch(Actions.movingStillShareComplete()),
    updateMovingStillDuration: duration =>
      dispatch(Actions.updateMovingStillDuration(duration)),
    undoMovingStill: actionObject =>
      dispatch(Actions.undoMovingStill(actionObject)),
    redoMovingStill: actionObject =>
      dispatch(Actions.redoMovingStill(actionObject)),
    selectSelectionTool: () => dispatch(Actions.selectSelectionTool()),
    makeSelection: corners => dispatch(Actions.makeSelection(corners)),
    deleteSelection: () =>
      dispatch(Actions.deleteSelection(false, false, null)),
    resetMovingStillState: () => dispatch(Actions.resetMovingStillState()),
  };
};

const mapStateToProps = state => ({
  movingStill: state.movingStill,
  exports: state.exports.exports,
  isUploading: state.exports.uploadRequestSent,
  lastUploadedExport: state.exports.lastUploadedExport,
});

export default connect(mapStateToProps, mapDispatchToProps)(MovingStill);
