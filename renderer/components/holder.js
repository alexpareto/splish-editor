export default props => {
  return (
    <div className="holder">
      {props.children}
      <style jsx>
        {`
          .holder {
            position: absolute;
            top: 0;
            bottom: 0;
            right: 0;
            left: 0;
          }
        `}
      </style>
    </div>
  );
};
