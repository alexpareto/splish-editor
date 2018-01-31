import * as globalStyles from '../globalStyles';
import Clipboard from 'react-clipboard.js';

class ExportItem extends React.Component {
  playVideo = () => {
    this.video.play();
  };

  pauseVideo = () => {
    this.video.pause();
  };

  render() {
    return (
      <Clipboard component="a" data-clipboard-text={this.props.shareLink}>
        <div
          className="item"
          onMouseEnter={this.playVideo}
          onMouseLeave={this.pauseVideo}
        >
          <video
            loop
            height={this.props.height}
            ref={video => (this.video = video)}
          >
            <source src={this.props.videoUrl} />
          </video>
          <style jsx>{`
            .item {
              background: ${globalStyles.backgroundAccent};
              color: ${globalStyles.textColor};
              border-style: none;
              box-sizing: border-box;
              font-family: ${globalStyles.fontFamily};
              transition: all 0.2s ease;
              box-shadow: ${globalStyles.lighterBoxShadow};
              height: 200px;
              margin: 10px;
              position: relative;
            }

            .item:hover {
              box-shadow: ${globalStyles.heavierBoxShadow};
              transform: translateY(-3px);
              cursor: pointer;
            }
          `}</style>
        </div>
      </Clipboard>
    );
  }
}

export default ExportItem;
