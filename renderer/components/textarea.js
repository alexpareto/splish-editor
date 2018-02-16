import * as globalStyles from '../globalStyles';

export default props => {
  const { light, ...otherProps } = props;
  if (light) {
    return (
      <span>
        <textarea {...otherProps} />
        <style jsx>{`
          textarea {
            height: 50px;
            width: 100%;
            background-color: transparent;
            color: ${globalStyles.background};
            border-style: none;
            font-size: 14px;
            padding: 7px;
            outline: none;
            box-sizing: border-box;
            transition: all 0.2s ease;
            resize: none;
          }

          textarea:placeholder {
            color: ${globalStyles.background};
          }

          textarea:focus {
          }
        `}</style>
      </span>
    );
  }
  return (
    <span>
      <textarea {...otherProps} />
      <style jsx>{`
        textarea {
          height: 50px;
          width: 300px;
          background-color: ${globalStyles.backgroundLight};
          color: ${globalStyles.textColor};
          border-style: none;
          font-size: 14px;
          padding: 7px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
          resize: none;
        }

        textarea:placeholder {
          color: ${globalStyles.textColor};
        }

        textarea:focus {
        }
      `}</style>
    </span>
  );
};
