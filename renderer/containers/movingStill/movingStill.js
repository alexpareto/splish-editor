import React from 'react';
import ToolBar from '../../components/movingStillToolBar';
import VectorCanvas from '../../components/vectorCanvas';
import MovingStillPreview from '../../components/movingStillPreview';
import { connect } from 'react-redux';
import * as Actions from './actions';

class MovingStill extends React.Component {
  render() {
    const showPreview = this.props.movingStill.viewMode == 'preview';

    return (
      <div>
        <ToolBar
          selectMovingStillImage={this.props.selectMovingStillImage}
          viewMode={this.props.movingStill.viewMode}
          initializeMovingStillCanvas={this.props.initializeMovingStillCanvas}
          selectAnchorTool={this.props.selectAnchorTool}
          selectVectorTool={this.props.selectVectorTool}
          isInitialized={this.props.movingStill.isInitialized}
          startMovingStillPreviewMode={this.props.startMovingStillPreviewMode}
          startMovingStillEditMode={this.props.startMovingStillEditMode}
          startExportingMovingStill={this.props.startExportingMovingStill}
        />
        <MovingStillPreview
          display={showPreview}
          isRendering={this.props.movingStill.isRendering}
          imgSrc={this.props.movingStill.imgPath}
          anchors={this.props.movingStill.anchors}
          vectors={this.props.movingStill.vectors}
          imgDimensions={this.props.movingStill.imgDimensions}
          animationParams={this.props.movingStill.animationParams}
          updateAnimationParams={this.props.updateAnimationParams}
          boundingRect={this.props.movingStill.boundingRect}
          isRendering={this.props.movingStill.isRendering}
          movingStillExportComplete={this.props.movingStillExportComplete}
        />
        <VectorCanvas
          display={!showPreview}
          currentTool={this.props.movingStill.currentTool}
          imgSrc={this.props.movingStill.imgPath}
          isInitialized={this.props.movingStill.isInitialized}
          imageHeight={this.props.movingStill.imageHeight}
          addVector={this.props.addVector}
          addAnchor={this.props.addAnchor}
        />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initializeMovingStillCanvas: tool =>
      dispatch(Actions.initializeMovingStillCanvas(tool)),
    selectMovingStillImage: files =>
      dispatch(Actions.selectMovingStillImage(files)),
    startMovingStillPreviewMode: () =>
      dispatch(Actions.startMovingStillPreviewMode()),
    startMovingStillEditMode: () =>
      dispatch(Actions.startMovingStillEditMode()),
    renderMovingStill: path => dispatch(Actions.renderMovingStill(path)),
    selectVectorTool: () => dispatch(Actions.selectVectorTool()),
    selectAnchorTool: () => dispatch(Actions.selectAnchorTool()),
    addVector: vector => dispatch(Actions.addVector(vector)),
    addAnchor: anchor => dispatch(Actions.addAnchor(anchor)),
    updateAnimationParams: params =>
      dispatch(Actions.updateAnimationParams(params)),
    startExportingMovingStill: () =>
      dispatch(Actions.startExportingMovingStill()),
    movingStillExportComplete: () =>
      dispatch(Actions.movingStillExportComplete()),
  };
};

const mapStateToProps = state => ({ movingStill: state.movingStill });

export default connect(mapStateToProps, mapDispatchToProps)(MovingStill);
