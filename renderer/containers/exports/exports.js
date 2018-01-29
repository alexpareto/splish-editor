import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';

import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import * as Actions from './actions.js';

import Logo from '../../components/logo.js';
import ExportItem from '../../components/exportItem';

class Exports extends React.Component {
  async getInitialProps(ctx) {
    ctx.store.dispatch(Actions.getExportsRequest());
  }

  constructor(props) {
    super(props);

    this.state = {};
  }

  async componentDidMount() {
    const data = await checkLoggedIn();
    if (!data) {
      Router.push('/login');
    }
    this.props.getExports();

    //this.getExportInterval = setInterval(this.props.getExports, 3000);
  }

  componentWillUnmount() {
    //clearInterval(this.getExportInterval);
  }

  handleInputChange = files => {
    console.log(files);
    this.props.uploadExport(files[0]);
  };

  render() {
    return (
      <div className="holder">
        {this.props.exports.map(exportObject => {
          return (
            <ExportItem
              key={exportObject.id}
              videoUrl={exportObject.video_url}
              height="200px"
            />
          );
        })}
        <style jsx>
          {`
            .holder {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              align-items: center;
              justify-content: space-around;
            }
          `}
        </style>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    exports: state.exports.exports,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uploadExport: file => dispatch(Actions.uploadExportRequest(file)),
    getExports: () => dispatch(Actions.getExportsRequest()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Exports);
