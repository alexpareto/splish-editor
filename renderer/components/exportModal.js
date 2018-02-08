import React from 'react';
import * as globalStyles from '../globalStyles';

import Loading from './loading';
import Button from './button';
import Input from './input';
import TextArea from './textarea';

class ExportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exportStage: 0,
      exportCount: 0,
      title: '',
      description: '',
      hasUploaded: false,
    };
  }

  componentWillReceiveProps(nextProps) {
    // if done rendering and filling out title/description start upload
    if (
      !nextProps.isRendering &&
      this.state.exportStage == 2 &&
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
          );
        },
      );
    }
  }

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
    if (this.state.exportStage == 0) {
      return (
        <div>
          <span className="render-text">
            Awesome. What would you like to call your splish?
          </span>
          <Input
            name="title"
            placeholder="title"
            value={this.state.title}
            onChange={this.handleInputChange}
            onKeyDown={this.onTitleKeyDown}
            maxLength="255"
          />
          <span>
            <Button onClick={() => this.setState({ exportStage: 1 })}>
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
    } else if (this.state.exportStage == 1) {
      return (
        <div>
          <span className="render-text">
            Great name! How about a description?
          </span>
          <TextArea
            name="description"
            placeholder="description"
            value={this.state.description}
            onChange={this.handleInputChange}
            onKeyDown={this.onTextAreaKeyDown}
            maxLength="500"
          />
          <span>
            <Button
              onClick={() => {
                this.setState({ exportStage: 2 });
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

    return (
      <div>
        <span>All rendered! Share your splish with this link:</span>
        <span style={{ userSelect: 'auto' }}> {shareLink} </span>
        <Button onClick={this.props.onComplete}>done</Button>
        <style jsx>{`
          div {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
          }

          span {
            margin: 5px 0;
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
            height: 200px;
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
            z-index: 300000;
          }
        `}</style>
      </div>
    );
  }
}

export default ExportModal;
