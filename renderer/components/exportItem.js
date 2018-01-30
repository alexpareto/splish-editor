import * as globalStyles from '../globalStyles';
import Clipboard from 'react-clipboard.js';

export default props => {
  return (
    <Clipboard component="a" data-clipboard-text={props.shareLink}>
      <div className="item">
        <video autoPlay="true" loop="true" height={props.height}>
          <source src={props.videoUrl} />
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
};
