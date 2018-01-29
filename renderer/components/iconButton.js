import React from 'react';
import * as globalStyles from '../globalStyles';
import Icon from './icon';
import Button from './button';

export default props => {
  return (
    <Button onClick={props.onClick} height={40}>
      <Icon name={props.name} stroke={props.stroke} />
    </Button>
  );
};
