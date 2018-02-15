import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';
import Head from 'next/head';

import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';
import * as Actions from './actions.js';

import Logo from '../../components/logo.js';
import ExportItem from '../../components/exportItem';
import StackGrid from 'react-stack-grid';

class Exports extends React.Component {
  async getInitialProps(ctx) {
    ctx.store.dispatch(Actions.getExportsRequest());
  }

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
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
        <Head>
          <link rel="stylesheet" type="text/css" href="/static/css/tippy.css" />
        </Head>

        <StackGrid
          columnWidth={'50%'}
          gridRef={grid => (this.grid = grid)}
          gutterWidth={24}
          gutterHeight={20}
        >
          {this.props.exports.map(exportObject => {
            return (
              <ExportItem
                key={exportObject.id}
                videoUrl={exportObject.video_url}
                shareLink={'https://splish.io/e/' + exportObject.public_id}
                exportObject={exportObject}
                saveExport={this.props.saveExport}
              />
            );
          })}
        </StackGrid>
        <style jsx>{`
          .holder {
            width: 100%;
            height: 100%;
          }
        `}</style>
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
    saveExport: (public_id, description, privacy_level) =>
      dispatch(
        Actions.saveExportRequest(public_id, description, privacy_level),
      ),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Exports);
