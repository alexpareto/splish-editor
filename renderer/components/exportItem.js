import * as globalStyles from '../globalStyles';
import Clipboard from 'react-clipboard.js';
import VisibilitySensor from 'react-visibility-sensor';
import { Edit2, Share, Save } from 'react-feather';
import { shell } from 'electron';
import { Tooltip } from 'react-tippy';

import TextArea from './textarea';

const privacy_levels = {
  PR: 'private',
  PU: 'public',
  UL: 'unlisted',
};

class ExportItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      edit: false,
      caption: props.exportObject.description,
      privacy: props.exportObject.privacy_level,
    };
  }

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  playVideo = () => {
    this.video.play();
  };

  pauseVideo = () => {
    this.video.pause();
  };

  deleteExport = () => {};

  saveEdit = () => {
    // send the save request
    this.props.saveExport(
      this.props.exportObject.public_id,
      this.state.caption,
      this.state.privacy,
    );
    this.setState({
      edit: false,
    });
  };

  editExport = () => {
    this.setState({
      edit: true,
    });
  };

  renderShare = () => {
    if (this.props.exportObject.privacy_level === 'PR') {
      return (
        <Tooltip
          title="this splish is private. make it public or unlisted to share!"
          theme="light"
        >
          <span className="share">
            <Share color={globalStyles.background} size={20} />
          </span>
          <style jsx>{`
            .share {
              padding-right: 7px;
            }

            .share:hover {
              cursor: pointer;
            }
          `}</style>
        </Tooltip>
      );
    }
    return (
      <React.Fragment>
        <span
          className="share"
          onClick={() =>
            shell.openExternal(
              `https://splish.io/e/${this.props.exportObject.public_id}`,
            )
          }
        >
          <Share color={globalStyles.background} size={20} />
        </span>
        <style jsx>{`
          .share {
            padding-right: 7px;
          }

          .share:hover {
            cursor: pointer;
          }
        `}</style>
      </React.Fragment>
    );
  };

  onTextAreaKeyDown = event => {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    }
  };

  renderOverlay = () => {
    if (this.state.edit) {
      return (
        <React.Fragment>
          <span className="button-edit" onClick={this.saveEdit}>
            <Save color={globalStyles.background} size={20} />
          </span>
          <div className="overlay-panel">
            <TextArea
              value={this.state.caption}
              name="caption"
              className="caption-input"
              placeholder="add a caption..."
              onChange={this.handleInputChange}
              onKeyDown={this.onTextAreaKeyDown}
              light={true}
            />
            <div className="privacy-options">
              <span
                className={
                  this.state.privacy == 'PU'
                    ? 'privacy-active'
                    : 'privacy-level'
                }
                onClick={() => this.setState({ privacy: 'PU' })}
              >
                public
              </span>
              <span
                className={
                  this.state.privacy == 'UL'
                    ? 'privacy-active'
                    : 'privacy-level'
                }
                onClick={() => this.setState({ privacy: 'UL' })}
              >
                unlisted
              </span>
              <span
                className={
                  this.state.privacy == 'PR'
                    ? 'privacy-active'
                    : 'privacy-level'
                }
                onClick={() => this.setState({ privacy: 'PR' })}
              >
                private
              </span>
            </div>
          </div>
          <style jsx>{`
            .privacy-level {
              box-sizing: border-box;
              padding: 0 5px;
              border-radius: 5px;
              font-size: 12px;
              line-height: 18px;
              height: 18px;
              color: ${globalStyles.background};
              background-color: #aaa;
            }

            .privacy-level:hover {
              cursor: pointer;
            }

            .privacy-active {
              box-sizing: border-box;
              padding: 0 5px;
              border-radius: 5px;
              font-size: 12px;
              line-height: 18px;
              height: 18px;
              color: ${globalStyles.background};
              background-color: #fff;
            }

            .privacy-active:hover {
              cursor: pointer;
            }

            .button-edit {
              box-sizing: border-box;
              padding: 0 5px;
              border-radius: 5px;
              font-size: 12px;
              line-height: 24px;
              height: 24px;
              background-color: ${globalStyles.textColor};
              position: absolute;
              right: 7px;
              top: 5px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .button-edit:hover {
              cursor: pointer;
            }

            .overlay-panel {
              height: 80px;
              position: absolute;
              background-color: #eee;
              left: 0;
              right: 0;
              bottom: -30px;
              opacity: 0.8;
              display: flex;
              flex-direction: column;
              align-items: stretch;
              justify-content: space-between;
            }

            .description {
              width: calc(100% - 40px);
              text-overflow: ellipsis;
              padding-left: 7px;
              color: ${globalStyles.backgroundLight};
            }

            .privacy-options {
              display: flex;
              flex-direction: row;
              justify-content: space-around;
              align-items: center;
              width: 100%;
              height: 30px;
            }
          `}</style>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        <span className="privacy-level">
          {privacy_levels[this.props.exportObject.privacy_level]}
        </span>
        <span className="button-edit" onClick={this.editExport}>
          <Edit2 color={globalStyles.background} size={20} />
        </span>
        <div className="overlay-panel">
          <span className="description" onClick={this.editExport}>
            {this.props.exportObject.description || 'add a caption...'}
          </span>
          {this.renderShare()}
        </div>
        <style jsx>{`
          .privacy-level {
            position: absolute;
            top: 5px;
            left: 7px;
            box-sizing: border-box;
            padding: 0 5px;
            border-radius: 5px;
            font-size: 12px;
            line-height: 18px;
            height: 18px;
            color: ${globalStyles.background};
            background-color: ${globalStyles.textColor};
          }

          .button-delete {
            box-sizing: border-box;
            padding: 0 5px;
            border-radius: 5px;
            font-size: 12px;
            line-height: 24px;
            height: 24px;
            background-color: ${globalStyles.textColor};
            position: absolute;
            right: 40px;
            top: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .button-delete:hover {
            cursor: pointer;
          }

          .button-edit {
            box-sizing: border-box;
            padding: 0 5px;
            border-radius: 5px;
            font-size: 12px;
            line-height: 24px;
            height: 24px;
            background-color: ${globalStyles.textColor};
            position: absolute;
            right: 7px;
            top: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .button-edit:hover {
            cursor: pointer;
          }

          .overlay-panel {
            height: 30px;
            position: absolute;
            background-color: ${globalStyles.textColor};
            left: 0;
            right: 0;
            bottom: -30px;
            opacity: 0.8;
            display: flex;
            align-items: center;
            justify-content: space-between;
          }

          .description {
            width: calc(100% - 40px);
            text-overflow: ellipsis;
            padding-left: 7px;
            color: ${globalStyles.backgroundLight};
          }
        `}</style>
      </React.Fragment>
    );
  };

  render() {
    return (
      <div
        className="item"
        onMouseEnter={this.playVideo}
        onMouseLeave={this.pauseVideo}
      >
        <VisibilitySensor onChange={this.onVisibilityChange} />
        <video
          loop
          height="100%"
          ref={video => (this.video = video)}
          preload="none"
          poster={this.props.exportObject.poster_image_url}
        >
          <source src={this.props.videoUrl} />
        </video>
        <div className="overlay">{this.renderOverlay()}</div>
        <style jsx>{`
          .item {
            width: 100%;
            position: relative;
            padding-bottom: ${this.props.exportObject.height /
              this.props.exportObject.width *
              100}%;
            position: relative;
          }

          video {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
          }

          .overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            opacity: 0;
            transition: opacity 0.2s ease;
          }

          .item:hover .overlay {
            opacity: 1;
          }
        `}</style>
      </div>
    );
  }
}

export default ExportItem;
