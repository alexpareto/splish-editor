import * as globalStyles from '../globalStyles';

export default props => {
  let { isActive, ...otherProps } = props;

  return (
    <button {...otherProps}>
      {props.children}
      <style jsx>{`
        button {
          height: ${props.height ? props.height : 30}px;
          background: ${globalStyles.backgroundAccent};
          color: ${globalStyles.textColor};
          border-style: ${isActive ? 'solid' : 'none'};
          border-color: ${globalStyles.textColor};
          border-width: 1px;
          box-sizing: border-box;
          padding: 7px;
          display: flex;
          justify-content: center;
          align-items: center;
          stroke: ${props.stroke}
          font-size: 14px;
          font-family: ${globalStyles.fontFamily};
          transition: all 0.2s ease;
          border-radius: 1px;
          box-shadow: ${globalStyles.lighterBoxShadow};
        }

        button:hover {
          box-shadow: ${globalStyles.heavierBoxShadow};
          transform: translateY(-3px);
          cursor: pointer;
        }

        button:focus {
          outline: none;
        }
      `}</style>
    </button>
  );
};
