import React from 'react';
import * as globalStyles from '../globalStyles';

class ExportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      exportStage: 0,
      exportCount: 0,
    };
  }

  render() {
    const stage0 =
      this.state.exportStage == 0 ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column',
          }}
        >
          What do you want to call your splish?
          <button
            onClick={() => {
              this.setState({ exportStage: 1 });
            }}
          >
            next
          </button>
        </div>
      ) : null;

    const stage1 =
      this.state.exportStage == 1 ? (
        <div>
          Choose your license from these three options! AKA waste more time
          while your video renders MUAHAHAHA!
          <button
            onClick={() => {
              this.setState({ exportStage: 2 });
            }}
          >
            next
          </button>
        </div>
      ) : null;

    // get the export link from the first of the exports
    // TODO (zac/alex) instead get the public ID from the response
    // of the postExport
    const shareLink = this.props.exports[0]
      ? `https://splish.io/e/${this.props.exports[0].public_id}`
      : null;

    let stage2 =
      this.props.isRendering || !shareLink ? (
        <div>RENDERING YOUR SPLISH...</div>
      ) : (
        <div>
          Use this here link to share your splish on the interwebs!
          <span style={{ userSelect: 'auto' }}> {shareLink} </span>
          <button onClick={this.props.movingStillShareComplete}>done</button>
        </div>
      );

    stage2 = this.state.exportStage == 2 ? stage2 : null;

    return (
      <div className="container">
        {stage0}
        {stage1}
        {stage2}
        <style jsx>{`
          .container {
            background-color: #ffffff;
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 400px;
            height: 400px;
            top: 0px;
            z-index: 300000;
          }
        `}</style>
      </div>
    );
  }
}

export default ExportModal;
