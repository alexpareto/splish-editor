import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';

import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import * as globalStyles from '../../globalStyles';
import getFfmpeg from '../../lib/getFfmpeg';
import * as api from '../../lib/api';

import Logo from '../../components/logo.js';
import Button from '../../components/button.js';
import EyeLogo from '../../components/eyelogo.js';
import Loading from '../../components/loading';
import Holder from '../../components/holder';
import * as CinemagraphActions from '../cinemagraph/actions';
import * as MovingStillActions from '../movingStill/actions';
import FileSelection from '../../components/fileSelection';
import { getBoundingRect, setWindowSize } from '../../lib/windowSizeHelpers';
import sizeOf from 'image-size';
import electron from 'electron';
import fs from 'fs';
import A from '../../components/a';

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

  showCinemagraphLengthDialog = () => {
    // first show confirm quit
    const remote = electron.remote || false;

    if (!remote) {
      return null;
    }
    const { dialog } = remote;

    if (dialog) {
      const dialogOpts = {
        type: 'info',
        buttons: ['Okay'],
        message: 'Video Too Long!',
        detail: `Splish only supports cinemagraphs that are less than six seconds. Please trim your video or try starting with one that is a little shorter!`,
      };

      dialog.showMessageBox(dialogOpts);
    }
  };

  // get all the dimensions
  initializeAndOpenCinemagraph = files => {
    // hit endpoint to track start project
    api.call('exports/start', 'POST').then(res => {
      if (res.ok) {
        console.log('all good fam');
      }
    });

    const videoPath = 'file://' + files[0];

    const ffmpeg = getFfmpeg();
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error(err);
      }

      console.log('METADATA: ', metadata);

      let naturalDimensions, duration;
      for (let i = 0; i < 4; i++) {
        naturalDimensions = {
          width: metadata.streams[i].coded_width,
          height: metadata.streams[i].coded_height,
        };

        duration = metadata.streams[i].duration;

        if (naturalDimensions.width && naturalDimensions.height) {
          break;
        }
      }

      if (duration > 6) {
        this.showCinemagraphLengthDialog();
        return;
      }

      const remote = electron.remote || false;

      if (!remote) {
        return;
      }

      const dir = remote.app.getPath('temp') + 'thumbnails/';

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }

      fs.readdir(dir, (err, files) => {
        if (files) {
          for (const file of files) {
            fs.unlinkSync(dir + file);
          }
        }
        let command = ffmpeg();

        // load 3 thumbnails per second of video
        command
          .input(videoPath)
          .withInputFps(25)
          .fps(3)
          .output(dir + '%02d.jpg')
          .on('end', () => {
            this.props.loadThumbnails();
          })
          .run();
      });

      const numThumbnails = Math.floor(duration) * 3;
      const hPadding = 120;
      const vPadding = 220;
      const headerSize = 100; // height of toolbar at top
      const footerSize = 60;
      const boundingRect = getBoundingRect(
        naturalDimensions,
        hPadding,
        vPadding,
        headerSize,
        footerSize,
      );

      this.props.selectCinemagraphVideo(
        videoPath,
        naturalDimensions,
        boundingRect,
        numThumbnails,
        duration,
      );

      Router.push('/cinemagraph');

      setWindowSize(boundingRect, hPadding, vPadding);
    });
  };

  initializeAndOpenMovingStill = files => {
    // hit endpoint to track start project
    api.call('exports/start', 'POST').then(res => {
      if (res.ok) {
        console.log('all good fam');
      }
    });

    const imgPath = 'file://' + files[0];
    sizeOf(files[0], (err, dimensions) => {
      const naturalDimensions = {
        width: dimensions.width,
        height: dimensions.height,
      };

      const hPadding = 120;
      const vPadding = 180;
      const headerSize = 100; // height of toolbar at top
      const footerSize = 0;
      const boundingRect = getBoundingRect(
        naturalDimensions,
        hPadding,
        vPadding,
        headerSize,
        footerSize,
      );

      this.props.selectMovingStillImage(
        imgPath,
        naturalDimensions,
        boundingRect,
      );

      Router.push('/movingStill');

      setWindowSize(boundingRect, hPadding, vPadding);
    });
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
            type="img"
            filesHandler={this.initializeAndOpenMovingStill}
          >
            <div className="action-button">
              <img className="icon" src="/static/icons/splish-liquidlogo.png" />
              <span>animagrapher</span>
            </div>
          </FileSelection>
          <FileSelection
            type="video"
            filesHandler={this.initializeAndOpenCinemagraph}
          >
            <div className="action-button">
              <img className="icon" src="/static/icons/splish-solidlogo.png" />
              <span>cinemagrapher</span>
            </div>
          </FileSelection>
          <Link href="/tutorials" prefetch>
            <div className="tutorials-link">
              <A>getting started tutorials</A>
            </div>
          </Link>
        </div>
        <style jsx>
          {`
            .tutorials-link {
              height: 70px;
            }

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
    selectCinemagraphVideo: (
      videoPath,
      naturalDimensions,
      boundingRect,
      numThumbnails,
      duration,
    ) =>
      dispatch(
        CinemagraphActions.selectCinemagraphVideo(
          videoPath,
          naturalDimensions,
          boundingRect,
          numThumbnails,
          duration,
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
    loadThumbnails: () => dispatch(CinemagraphActions.loadThumbnails()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
