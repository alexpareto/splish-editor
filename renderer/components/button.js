import * as globalStyles from '../globalStyles';

export default props => {
  return (
    <button {...props}>
      {props.children}
      <style jsx>{`
        button {
          height: 30px;
          background: ${globalStyles.backgroundAccent};
          color: ${globalStyles.textColor};
          border-style: none;
          box-sizing: border-box;
          padding: 7px;
          font-size: 14px;
          font-family: ${globalStyles.fontFamily};
          transition: all 0.2s ease;
          border-radius: 1px;
          transition: all 250ms;
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
