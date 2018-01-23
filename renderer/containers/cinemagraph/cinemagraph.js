import React from 'react';
import NavBar from '../../components/cinemagraphToolBar';
import CinemagraphCanvas from '../../components/cinemagraphCanvas';
import Trimmer from '../../components/trimmer';
import { connect } from 'react-redux';
import * as Actions from './actions';

class Cinemagraph extends React.Component {
  render() {
    console.log();
    return (
      <div>
        <NavBar
          selectCinemagraphVideo={this.props.selectCinemagraphVideo}
          renderCinemagraph={this.props.renderCinemagraph}
        />
        <CinemagraphCanvas
          initializeCinemagraphCanvas={this.props.initializeCinemagraphCanvas}
          videoSrc={this.props.cinemagraph.videoPath}
          boundingRect={this.props.cinemagraph.boundingRect}
          videoDimensions={this.props.cinemagraph.videoDimensions}
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
  };
};

const mapStateToProps = state => ({ cinemagraph: state.cinemagraph });

export default connect(mapStateToProps, mapDispatchToProps)(Cinemagraph);
