import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';

import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import * as globalStyles from '../../globalStyles';

import Logo from '../../components/logo.js';
import Button from '../../components/button.js';
import EyeLogo from '../../components/eyelogo.js';
import Loading from '../../components/loading';
import Holder from '../../components/holder';
import * as CinemagraphActions from '../cinemagraph/actions';
import * as MovingStillActions from '../movingStill/actions';
import FileSelection from '../../components/fileSelection';
import ffmpeg from 'fluent-ffmpeg';
import getBoundingRect from '../../lib/getBoundingRect';
import electron from 'electron';

class MainMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }
  async componentDidMount() {
    const data = await checkLoggedIn();
    if (!data) {
      Router.push('/login');
    } else {
      this.setState({ loading: false });
    }
  }

  // get all the dimensions
  initializeAndOpenCinemagraph = files => {
    const videoPath = 'file://' + files[0];
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      const naturalDimensions = {
        width: metadata.streams[0].coded_width,
        height: metadata.streams[0].coded_height,
      };

      console.log('Natural: ', naturalDimensions);
      const hPadding = 120;
      const vPadding = 180;
      const headerSize = 100; // height of toolbar at top
      const boundingRect = getBoundingRect(
        naturalDimensions,
        hPadding,
        vPadding,
        headerSize,
      );

      this.props.selectCinemagraphVideo(
        videoPath,
        naturalDimensions,
        boundingRect,
      );

      Router.push('/cinemagraph');

      const win = electron.remote.getCurrentWindow();
      const winWidth = Math.floor(boundingRect.width + hPadding);
      const winHeight = Math.floor(boundingRect.height + vPadding);
      const {
        width,
        height,
      } = electron.screen.getPrimaryDisplay().workAreaSize;

      let bounds = win.getBounds();
      bounds.x = Math.floor((width - winWidth) / 2);
      bounds.y = Math.floor((height - winHeight) / 2);
      bounds.width = winWidth;
      bounds.height = winHeight;

      win.setBounds(bounds, true);
    });
  };

  initializeAndOpenMovingStill = files => {
    // this.props.selectMovingStillImage(files, dimensions);
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Holder>
        <div className="eye-logo">
          <EyeLogo height={30} withText={true} />
        </div>
        <div className="button-holder">
          <Link href="/profile" prefetch>
            <div className="action-button">
              <img className="icon" src="/static/icons/splish-proficon.png" />
              <span>profile</span>
            </div>
          </Link>
          <FileSelection
            type="video"
            filesHandler={this.initializeAndOpenCinemagraph}
          >
            <div className="action-button">
              <img className="icon" src="/static/icons/splish-solidlogo.png" />
              <span>cinemagrapher</span>
            </div>
          </FileSelection>
          <FileSelection
            type="img"
            filesHandler={this.props.initializeAndOpenMovingStill}
          >
            <div className="action-button">
              <img className="icon" src="/static/icons/splish-liquidlogo.png" />
              <span>animagrapher</span>
            </div>
          </FileSelection>
        </div>
        <style jsx>
          {`
            .eye-logo {
              position: absolute;
              top: 5px;
              left: 0;
              right: 0;
              display: flex;
              flex-direction: row;
              align-items: center;
              justify-content: center;
            }

            .button-holder {
              width: 30%;
              display: inline-flex;
              box-sizing: border-box;
              flex-direction: column;
              justify-content: center;
              height: 100%;
              padding-left: 50px;
            }

            .action-button {
              height: 100px;
              font-size: 24px;
              font-weight: normal;
              cursor: pointer;
              line-height: 100px;
              display: flex;
              flex-direction: row;
              align-items: center;
            }

            .icon {
              display: inline-block;
              height: 50px;
              margin-right: 20px;
              filter: drop-shadow(3px 5px 3px rgba(0, 0, 0, 0.6));
              transition: all 0.3s ease;
            }

            .action-button:hover .icon {
              filter: drop-shadow(4px 7px 4px rgba(0, 0, 0, 0.9));
              transform: translateY(-3px);
            }
          `}
        </style>
      </Holder>
    );
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logoutUser()),
    selectCinemagraphVideo: (videoPath, naturalDimensions, boundingRect) =>
      dispatch(
        CinemagraphActions.selectCinemagraphVideo(
          videoPath,
          naturalDimensions,
          boundingRect,
        ),
      ),
    selectMovingStillImage: (imgPath, naturalDimensions, boundingRect) =>
      dispatch(
        MovingStillActions.selectMovingStillImage(
          imgPath,
          naturalDimensions,
          boundingRect,
        ),
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
