import React from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import Router from 'next/router';
import Logo from '../../components/logo.js';
import checkLoggedIn from '../../lib/checkLoggedIn.js';
import redirect from '../../lib/redirect.js';

import * as Actions from './actions.js';

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
        <div>
          <Link href="/mainMenu" prefetch>
            <a>Back to main menu</a>
          </Link>
        </div>
        <div>Upload some cool stuff</div>
        <input
          type="file"
          onChange={e => this.handleInputChange(e.target.files)}
        />
        {this.props.exports.map(exportObject => {
          return (
            <div key={exportObject.id}>
              <video autoPlay="true" loop="true" height="200px">
                <source src={exportObject.video_url} />
              </video>
            </div>
          );
        })}
        <style jsx>
          {`
            .holder {
              display: flex;
              flex-direction: column;
              overflow: scroll;
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
