import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';
import Head from 'next/head';
import { Tooltip } from 'react-tippy';

import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import * as globalStyles from '../../globalStyles';
import getFfmpeg from '../../lib/getFfmpeg';
import * as api from '../../lib/api';
import getOrientedDimensions from '../../lib/getOrientedDimensions';

import Logo from '../../components/logo.js';
import Button from '../../components/button.js';
import EyeLogo from '../../components/eyelogo.js';
import Loading from '../../components/loading';
import Holder from '../../components/holder';
import * as CinemagraphActions from '../cinemagraph/actions';
import * as MovingStillActions from '../movingStill/actions';
import FileSelection from '../../components/fileSelection';
import { getBoundingRect, setWindowSize } from '../../lib/windowSizeHelpers';
import electron from 'electron';
import fs from 'fs';
import A from '../../components/a';
import sizeOf from 'image-size';

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
    // hit endpoint to track start project
    let body = new FormData();
    body.append('project_type', 'CG');
    api.call('exports/start', 'POST', body).then(res => {
      if (res.ok) {
        console.log('all good fam');
      }
    });

    const videoPath = 'file://' + files[0];

    let video = document.createElement('video');
    video.style.opacity = 0;
    video.src = videoPath;
    document.body.append(video);

    video.onloadedmetadata = e => {
      const naturalDimensions = {
        width: e.target.clientWidth,
        height: e.target.clientHeight,
      };
      const duration = e.target.duration;
      video.parentNode.removeChild(video);

      const ffmpeg = getFfmpeg();

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

        const framerate = 15 / duration;

        // load 3 thumbnails per second of video
        command
          .input(videoPath)
          .withInputFps(25)
          .fps(framerate)
          .output(dir + '%02d.jpg')
          .on('end', () => {
            this.props.loadThumbnails(dir + '01.jpg');
          })
          .run();
      });

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
        duration,
      );

      Router.push('/cinemagraph');

      setWindowSize(boundingRect, hPadding, vPadding);
    };
  };

  initializeAndOpenMovingStill = files => {
    // hit endpoint to track start project
    let body = new FormData();
    body.append('project_type', 'MS');
    api.call('exports/start', 'POST', body).then(res => {
      if (res.ok) {
        console.log('all good fam');
      }
    });

    const imgPath = 'file://' + files[0];

    const ffmpeg = getFfmpeg();
    var ExifImage = require('exif').ExifImage;

    new ExifImage({ image: imgPath.split('file://')[1] }, (error, exifData) => {
      let orientation;

      if (error) {
        orientation = 1;
      } else {
        orientation = exifData.image.Orientation;
      }

      sizeOf(imgPath.split('file://')[1], (err, dimensions) => {
        let naturalDimensions = {
          width: dimensions.width,
          height: dimensions.height,
        };

        naturalDimensions = getOrientedDimensions(
          orientation,
          naturalDimensions,
        );

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
          orientation,
        );

        Router.push('/movingStill');

        setWindowSize(boundingRect, hPadding, vPadding);
      });
    });
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    }
    return (
      <Holder>
        <Head>
          <link rel="stylesheet" type="text/css" href="/static/css/tippy.css" />
        </Head>

        <div className="eye-logo">
          <EyeLogo height={30} withText={true} />
        </div>
        <div className="button-holder">
          <Tooltip
            title="see your projects and setup your account"
            theme="light"
            position="right"
          >
            <Link href="/profile" prefetch>
              <div className="action-button">
                <img className="icon" src="/static/icons/splish-proficon.png" />
                <span>profile</span>
              </div>
            </Link>
          </Tooltip>
          <FileSelection
            type="img"
            filesHandler={this.initializeAndOpenMovingStill}
          >
            <Tooltip
              title="use vectors to add motion to a photo"
              theme="light"
              position="right"
            >
              <div className="action-button">
                <img
                  className="icon"
                  src="/static/icons/splish-liquidlogo.png"
                />
                <span>animagrapher</span>
              </div>
            </Tooltip>
          </FileSelection>
          <FileSelection
            type="video"
            filesHandler={this.initializeAndOpenCinemagraph}
          >
            <Tooltip
              title="freeze areas of a video"
              theme="light"
              position="right"
            >
              <div className="action-button">
                <img
                  className="icon"
                  src="/static/icons/splish-solidlogo.png"
                />
                <span>cinemagrapher</span>
              </div>
            </Tooltip>
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
              width: 40%;
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
      duration,
    ) =>
      dispatch(
        CinemagraphActions.selectCinemagraphVideo(
          videoPath,
          naturalDimensions,
          boundingRect,
          duration,
        ),
      ),
    selectMovingStillImage: (
      imgPath,
      naturalDimensions,
      boundingRect,
      orientation,
    ) =>
      dispatch(
        MovingStillActions.selectMovingStillImage(
          imgPath,
          naturalDimensions,
          boundingRect,
          orientation,
        ),
      ),
    loadThumbnails: firstImage =>
      dispatch(CinemagraphActions.loadThumbnails(firstImage)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu);
