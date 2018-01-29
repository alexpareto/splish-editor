import * as globalStyles from '../globalStyles';

export default props => {
  return (
    <a {...props}>
      {props.children}
      <style jsx>{`
        a {
          color: ${globalStyles.textColor};
          font-family: ${globalStyles.fontFamily};
          text-decoration: none;
          border-top: none;
          border-left: none;
          border-right: none;
          padding-bottom: 2px;
          border-bottom: 1px solid ${globalStyles.textColor};
        }

        a:hover {
          cursor: pointer;
        }
      `}</style>
    </a>
  );
};
