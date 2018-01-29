import * as globalStyles from '../globalStyles';

export default props => {
  return (
    <div>
      <video autoPlay="true" loop="true" height={props.height}>
        <source src={props.videoUrl} />
      </video>
      <style jsx>{`
        div {
          background: ${globalStyles.backgroundAccent};
          color: ${globalStyles.textColor};
          border-style: none;
          box-sizing: border-box;
          font-family: ${globalStyles.fontFamily};
          transition: all 0.2s ease;
          box-shadow: ${globalStyles.lighterBoxShadow};
          height: 200px;
          margin: 10px;
        }

        div:hover {
          box-shadow: ${globalStyles.heavierBoxShadow};
          transform: translateY(-3px);
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};