import * as globalStyles from '../globalStyles';
import Clipboard from 'react-clipboard.js';
import VisibilitySensor from 'react-visibility-sensor';

class ExportItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: false,
      hasLoaded: false,
    };
  }

  playVideo = () => {
    this.video.play();
  };

  pauseVideo = () => {
    this.video.pause();
  };

  componentDidUpdate = () => {
    if (this.state.isVisible && !this.state.hasLoaded) {
      this.video.load();
      this.setState({
        hasLoaded: true,
      });
    }
  };

  onVisibilityChange = isVisible => {
    this.setState({ isVisible });
  };

  render() {
    return (
      <Clipboard component="a" data-clipboard-text={this.props.shareLink}>
        <div
          className="item"
          onMouseEnter={this.playVideo}
          onMouseLeave={this.pauseVideo}
        >
          <VisibilitySensor onChange={this.onVisibilityChange} />
          <video
            loop
            height={this.props.height}
            ref={video => (this.video = video)}
            preload="none"
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
