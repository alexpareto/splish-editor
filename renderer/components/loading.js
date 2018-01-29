import * as globalStyles from '../globalStyles';
import EyeLogo from './eyelogo';

export default props => {
  return (
    <div className="loading logoAnimation">
      <EyeLogo withText={true} height={40} />
      <style jsx>{`
        .loading {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logoAnimation {
          animation: filter-animation 0.5s infinite;
          animation-direction: alternate-reverse;
          filter: brightness(75%);
        }

        @-webkit-keyframes filter-animation {
          0% {
            filter: brightness(75%);
          }

          50% {
            filter: brightness(85%);
          }

          100% {
            filter: brightness(100%);
          }
        }
      `}</style>
    </div>
  );
};
