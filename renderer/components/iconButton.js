import React from 'react';
import * as globalStyles from '../globalStyles';
import Icon from './icon';

class NavBar extends React.Component {
  render() {
    return (
      <div className="container" onClick={this.props.onClick}>
        <Icon name={this.props.name} stroke={this.props.stroke} />
        <style jsx>
          {`
					.container {
						display: flex;
						border-radius: 5px;
						cursor: pointer;
						background-color: ${this.props.backgroundColor};
						stroke: ${this.props.stroke}
						justify-content: center;
						align-items: center;
					};
				`}
        </style>
      </div>
    );
  }
}

export default NavBar;
