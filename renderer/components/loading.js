import * as globalStyles from '../globalStyles';
import EyeLogo from './eyelogo';

export default props => {
  return (
    <div className="loading">
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
      `}</style>
    </div>
  );
};
