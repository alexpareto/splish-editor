import React from 'react';
import IconButton from './iconButton';
import * as globalStyles from '../globalStyles';

class PreviewToggle extends React.Component {
  render() {
    const name = this.props.viewMode == 'edit' ? 'play' : 'composer';
    const onClick =
      this.props.viewMode == 'edit'
        ? this.props.startPreview
        : this.props.startEdit;
    return (
      <IconButton
        onClick={onClick}
        stroke={globalStyles.accent}
        name={name}
        backgroundColor={globalStyles.secondary}
      />
    );
  }
}

export default PreviewToggle;
