import * as globalStyles from '../globalStyles';

export default props => {
  return (
    <div className="holder">
      <img className="eyelogo" src="/static/icons/splish-eyelogo.png" />
      {props.withText ? <span className="text">splish</span> : null}
      <style jsx>{`
        .holder {
          display: flex;
          height: ${props.height}px;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        .eyelogo {
          height: ${props.height}px;
          margin-right: 7px;
        }

        .text {
          font-size: ${props.height - 5}px;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};
