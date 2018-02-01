import React from 'react';
import { initGA, logPageView } from '../lib/analytics';

export default class Holder extends React.Component {
  componentDidMount() {
    if (!window.GA_INITIALIZED) {
      initGA();
      window.GA_INITIALIZED = true;
    }
    logPageView();
  }

  render() {
    return (
      <div className="holder">
        {this.props.children}
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
  }
}
