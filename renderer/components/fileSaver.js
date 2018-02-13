import React from 'react';
import fs from 'fs';
import { remote } from 'electron';
import IconButton from './iconButton';
import * as globalStyles from '../globalStyles';

class FileSaver extends React.Component {
  chooseFileDialog = () => {
    const path = remote.dialog.showSaveDialog({
      filters: [{ name: 'Movies', extensions: this.props.extensions }],
      buttonLabel: 'Save',
      properties: ['openFile'],
    });

    if (path) {
      this.props.fileHandler(path);
    }
  };

  render() {
    return <div onClick={this.chooseFileDialog}>{this.props.children}</div>;
  }
}

export default FileSaver;
