import React from 'react';
import * as globalStyles from '../globalStyles';

import Loading from './loading';
import Button from './button';

class ExportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exportStage: 0,
      exportCount: 0,
    };
  }

  renderMain = () => {
    if (this.props.isRendering) {
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
    }

    // get the export link from the first of the exports
    // TODO (zac/alex) instead get the public ID from the response
    // of the postExport
    const shareLink = this.props.exports[0]
      ? `https://splish.io/e/${this.props.exports[0].public_id}`
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
