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

    this.state = {
      height: '200px',
    };
  }

  async componentDidMount() {
    this.props.getExports();

    this.setState({
      height: window.innerHeight / 3 + 'px',
    });
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
              shareLink={'https://splish.io/e/' + exportObject.public_id}
              height={this.state.height}
            />
          );
        })}
        <style jsx>
          {`
            .holder {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
              justify-content: space-around;
              align-items: center;
              align-content: flex-start;
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
