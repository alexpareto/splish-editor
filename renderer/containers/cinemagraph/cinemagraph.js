import React from 'react';
import NavBar from '../../components/cinemagraphToolBar';
import DrawingCanvas from '../../components/drawingCanvas';
import Trimmer from '../../components/trimmer';
import { connect } from 'react-redux';
import * as Actions from './actions';

class Cinemagraph extends React.Component {
  render() {
    return (
      <div>
        <NavBar
          selectCinemagraphVideo={this.props.selectCinemagraphVideo}
          initializeCinemagraphCanvas={this.props.initializeCinemagraphCanvas}
          attemptPreviewCinemagraph={this.props.attemptPreviewCinemagraph}
          startCinemagraphEditMode={this.props.startCinemagraphEditMode}
          renderCinemagraph={this.props.renderCinemagraph}
          viewMode={this.props.cinemagraph.viewMode}
        />
        <DrawingCanvas
          overlaySrc={this.props.cinemagraph.overlayPath}
          viewMode={this.props.cinemagraph.viewMode}
          videoSrc={this.props.cinemagraph.videoPath}
          videoHeight={this.props.cinemagraph.videoHeight}
        />
        <Trimmer />
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    initializeCinemagraphCanvas: () =>
      dispatch(Actions.initializeCinemagraphCanvas()),
    selectCinemagraphVideo: files =>
      dispatch(Actions.selectCinemagraphVideo(files)),
    attemptPreviewCinemagraph: () =>
      dispatch(Actions.attemptPreviewCinemagraph()),
    startCinemagraphEditMode: () =>
      dispatch(Actions.startCinemagraphEditMode()),
    renderCinemagraph: path => dispatch(Actions.renderCinemagraph(path)),
  };
};

const mapStateToProps = state => ({ cinemagraph: state.cinemagraph });

export default connect(mapStateToProps, mapDispatchToProps)(Cinemagraph);
