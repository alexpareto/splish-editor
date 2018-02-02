import * as globalStyles from '../globalStyles';

export default props => {
  return (
    <div className="holder">
      {props.withText ? (
        <img
          className="eyelogo"
          src="/static/icons/splish-eyewords.png"
          height={props.height}
        />
      ) : (
        <img
          className="eyelogo"
          src="/static/icons/splish-eyelogo.png"
          height={props.height}
        />
      )}
      <style jsx>{`
        .holder {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        .eyelogo {
          margin-right: 7px;
        }

        .text {
          font-weight: bold;
        }
      `}</style>
      <style jsx>{`
        .text {
          font-size: ${props.height - 5}px;
        }
        .holder {
          height: ${props.height}px;
        }
        .text {
          height: ${props.height}px;
        }
      `}</style>
    </div>
  );
};
