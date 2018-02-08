import React from 'react';
import fs from 'fs';
import { remote } from 'electron';
import IconButton from './iconButton';
import * as globalStyles from '../globalStyles';

class FileSelection extends React.Component {
  openFileDialog = () => {
    let files;
    switch (this.props.type) {
      case 'burst':
        files = remote.dialog.showOpenDialog();
        break;
      case 'video':
        files = remote.dialog.showOpenDialog({
          title: 'Choose a video!',
          filters: [
            { name: 'Movies', extensions: ['mkv', 'avi', 'mp4', 'mov', 'm4v'] },
          ],
          defaultPath: '~/',
          buttonLabel: 'Choose',
          properties: ['openFile'],
        });
        break;
      case 'img':
        files = remote.dialog.showOpenDialog({
          title: 'Choose a still image!',
          filters: [
            { name: 'Images', extensions: ['jpg', 'png', 'bmp', 'jpeg'] },
          ],
          defaultPath: '~/',
          buttonLabel: 'Choose',
          properties: ['openFile'],
        });
        break;
      default:
        files = remote.dialog.showOpenDialog();
    }

    if (files) {
      this.props.filesHandler(files);
    }
  };

  render() {
    return <div onClick={this.openFileDialog}>{this.props.children}</div>;
  }
}

export default FileSelection;
