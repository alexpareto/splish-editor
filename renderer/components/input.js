import * as globalStyles from '../globalStyles';

export default props => {
  return (
    <span>
      <input {...props} />
      <style jsx>{`
        input {
          height: 30px;
          width: 180px;
          background-color: ${globalStyles.backgroundLight};
          color: ${globalStyles.textColor};
          border-style: none;
          font-size: 14px;
          padding: 7px;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s ease;
        }

        input:placeholder {
          color: ${globalStyles.textColor};
        }

        input:focus {
        }
      `}</style>
    </span>
  );
};
