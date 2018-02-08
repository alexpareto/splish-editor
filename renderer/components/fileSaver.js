import React from 'react';
import fs from 'fs';
import { remote } from 'electron';
import IconButton from './iconButton';
import * as globalStyles from '../globalStyles';

class FileSaver extends React.Component {
  chooseFileDialog = () => {
    const path = remote.dialog.showSaveDialog({
      title: 'Choose a video!',
      filters: [{ name: 'Movies', extensions: ['mp4'] }],
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
