import React from 'react';
import * as globalStyles from '../globalStyles';

import Loading from './loading';
import Button from './button';
import Input from './input';
import TextArea from './textarea';
import FileSaver from './fileSaver';
import exportWithWaterMark from '../lib/exportWithWaterMark';
import electron from 'electron';

import { Tooltip } from 'react-tippy';
import { Circle, CheckCircle } from 'react-feather';

class ExportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exportStage: 1,
      exportCount: 0,
      title: '',
      description: '',
      privacy_level: 'PU',
      hasUploaded: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // if done rendering and filling out title/description start upload
    if (
      !nextProps.isRendering &&
      this.state.exportStage == 3 &&
      !this.state.hasUploaded &&
      !this.props.isUploading
    ) {
      this.setState(
        {
          hasUploaded: true,
        },
        () => {
          this.props.uploadExportRequest(
            this.props.exportFile,
            this.state.title,
            this.state.description,
            '',
            this.state.privacy_level,
          );
        },
      );
    }
  }

  showExportSuccessDialog = () => {
    // first show confirm quit
    const remote = electron.remote || false;

    if (!remote) {
      return null;
    }
    const { dialog } = remote;

    if (dialog) {
      const dialogOpts = {
        type: 'info',
        buttons: ['okay'],
        message: 'Your splish was successfully exported with a watermark!',
      };

      dialog.showMessageBox(dialogOpts);
    }
  };

  export = path => {
    exportWithWaterMark(
      path,
      this.props.videoDimensions,
      this.showExportSuccessDialog,
    );
  };

  handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  onTextAreaKeyDown = event => {
    if (event.keyCode == 13) {
      event.preventDefault();
      return false;
    } else if (event.keyCode == 8) {
      event.stopPropagation();
    }
  };

  onTitleKeyDown = event => {
    if (event.keyCode == 8) {
      event.stopPropagation();
    }
  };

  renderMain = () => {
    if (this.state.exportStage == 1) {
      return (
        <div>
          <span className="render-text">
            What do you want to caption your Splish?
          </span>
          <TextArea
            name="description"
            placeholder="caption"
            value={this.state.description}
            onChange={this.handleInputChange}
            onKeyDown={this.onTextAreaKeyDown}
            maxLength="500"
          />
          <span>
            <Button
              onClick={() => {
                this.setState({ exportStage: 2 });
              }}
            >
              continue
            </Button>
          </span>
          <style jsx>{`
            div {
              position: relative;
              height: 100%;
              width: 100%;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }

            span {
              display: inline-block;
              margin: 30px;
            }
          `}</style>
        </div>
      );
    } else if (this.state.exportStage == 2) {
      return (
        <div className="holder">
          <span className="render-text">
            Would you like to share your Splish?
          </span>
          <Tooltip
            title="post to the community, get featured on discover, and have this splish appear on your public profile"
            theme="light"
            position="right"
          >
            <div
              onClick={() => this.setState({ privacy_level: 'PU' })}
              className="privacy-option"
            >
              {this.state.privacy_level == 'PU' ? <CheckCircle /> : <Circle />}
              Public
            </div>
          </Tooltip>
          <Tooltip
            title="only people with the link can see"
            theme="light"
            position="right"
          >
            <div
              onClick={() => this.setState({ privacy_level: 'UL' })}
              className="privacy-option"
            >
              {this.state.privacy_level == 'UL' ? <CheckCircle /> : <Circle />}
              Unlisted
            </div>
          </Tooltip>
          <Tooltip
            title="only you can see this splish in your personal profile"
            theme="light"
            position="right"
          >
            <div
              onClick={() => this.setState({ privacy_level: 'PR' })}
              className="privacy-option"
            >
              {this.state.privacy_level == 'PR' ? <CheckCircle /> : <Circle />}
              Private
            </div>
          </Tooltip>
          <span>
            <Button
              onClick={() => {
                this.setState({ exportStage: 3 });
                // if already done rendering then start upload now
                if (!this.props.isRendering) {
                  this.setState(
                    {
                      hasUploaded: true,
                    },
                    () => {
                      this.props.uploadExportRequest(
                        this.props.exportFile,
                        this.state.title,
                        this.state.description,
                        '',
                        this.state.privacy_level,
                      );
                    },
                  );
                }
              }}
            >
              continue
            </Button>
          </span>
          <style jsx>{`
            .holder {
              position: relative;
              height: 100%;
              width: 100%;
              text-align: center;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              padding: 20px;
            }

            .privacy-option {
              width: 200px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 5px;
            }

            .radio {
              padding: 20px;
            }

            span {
              display: inline-block;
              margin: 30px;
            }
          `}</style>
        </div>
      );
    } else if (this.props.isRendering) {
      return (
        <div>
          <span className="render-text">
            one second while we render your splish...
          </span>
          <Loading />
          <style jsx>{`
            div {
              position: relative;
              height: 100%;
              width: 100%;
              text-align: center;
            }

            span {
              display: inline-block;
              margin: 30px;
            }
          `}</style>
        </div>
      );
    } else if (this.props.isUploading) {
      return (
        <div>
          <span className="render-text">uploading to splish.io now... </span>
          <Loading />
          <style jsx>{`
            div {
              position: relative;
              height: 100%;
              width: 100%;
              text-align: center;
            }

            span {
              display: inline-block;
              margin: 30px;
            }
          `}</style>
        </div>
      );
    }

    // get the export link from the first of the exports
    // TODO (zac/alex) instead get the public ID from the response
    // of the postExport
    const shareLink = this.props.lastUploadedExport
      ? `https://splish.io/e/${this.props.lastUploadedExport.public_id}`
      : null;

    const shareText =
      this.state.privacy_level == 'PR' ? (
        <span>
          All rendered! See your private splish in your profile or export below.
        </span>
      ) : (
        <React.Fragment>
          <span>All rendered! Share your splish with this link:</span>
          <span style={{ userSelect: 'auto' }}> {shareLink} </span>
          <span> or </span>
        </React.Fragment>
      );
    return (
      <div className="holder">
        {shareText}
        <div className="download-button">
          <FileSaver fileHandler={this.export}>
            <Button>download with watermark</Button>
          </FileSaver>
        </div>
        <div className="closeButton">
          <Button onClick={this.props.onComplete}>close</Button>
        </div>
        <style jsx>{`
          .holder {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 5px;
            text-align: center;
          }

          .download-button {
            margin-top: 10px;
          }

          .closeButton {
            margin-top: 10px;
          }
        `}</style>
      </div>
    );
  };

  render() {
    return (
      <div className="container">
        <div className="dialog">{this.renderMain()}</div>
        <style jsx>{`
          .dialog {
            width: 400px;
            height: 300px;
            background-color: ${globalStyles.background};
            box-shadow: ${globalStyles.heavierBoxShadow};
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .container {
            background-color: rgba(0, 0, 0, 0.2);
            position: absolute;
            display: flex;
            justify-content: center;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 100;
          }
        `}</style>
      </div>
    );
  }
}

export default ExportModal;
