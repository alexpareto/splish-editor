import React from 'react';
import NavBar from '../../components/cinemagraphToolBar';
import CinemagraphCanvas from '../../components/cinemagraphCanvas';
import Trimmer from '../../components/trimmer';
import { connect } from 'react-redux';
import * as Actions from './actions';
import * as ExportActions from '../exports/actions';

class Cinemagraph extends React.Component {
  render() {
    console.log();
    return (
      <div>
        <NavBar
          selectCinemagraphVideo={this.props.selectCinemagraphVideo}
          startExportingCinemagraph={this.props.startExportingCinemagraph}
          cinemagraphShareComplete={this.props.cinemagraphShareComplete}
          showExportModal={this.props.cinemagraph.showExportModal}
          isRendering={this.props.cinemagraph.isRendering}
          updateCinemagraphBrushBlur={this.props.updateCinemagraphBrushBlur}
          updateCinemagraphBrushSize={this.props.updateCinemagraphBrushSize}
          exports={this.props.exports}
          brushSize={this.props.cinemagraph.brushSize}
          brushBlur={this.props.cinemagraph.brushBlur}
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
        />
        <Trimmer />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    selectCinemagraphVideo: files =>
      dispatch(Actions.selectCinemagraphVideo(files)),
    renderCinemagraph: path => dispatch(Actions.renderCinemagraph(path)),
    initializeCinemagraphCanvas: () =>
      dispatch(Actions.initializeCinemagraphCanvas()),
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
  };
};

const mapStateToProps = state => ({
  cinemagraph: state.cinemagraph,
  exports: state.exports.exports,
});

export default connect(mapStateToProps, mapDispatchToProps)(Cinemagraph);
