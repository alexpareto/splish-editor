import React from 'react';
import * as globalStyles from '../globalStyles';
import FileSelection from './fileSelection';
import FileSaver from './fileSaver';
import IconButton from './iconButton';
import PreviewToggle from './previewToggle';
import Link from 'next/link';

class NavBar extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="flex">
          <Link href="/mainMenu" prefetch>
            <a>
              <IconButton
                stroke={globalStyles.background}
                name="leftChevron"
                backgroundColor={globalStyles.secondary}
              />
            </a>
          </Link>
          <FileSelection
            type="video"
            filesHandler={this.props.selectCinemagraphVideo}
          />
          <IconButton
            stroke={globalStyles.background}
            name="crosshair"
            backgroundColor={globalStyles.secondary}
          />
          <FileSaver type="video" fileHandler={this.props.renderCinemagraph} />
        </div>
        <style jsx>
          {`
					.flex {
						display:flex;
						align-items: center;
						justify-content: center;
						height: 100%;
					}

					.container { 
						left; 0; 
						top: 0;
						margin-left: -8px;
						margin-top: -8px;
						height: 45px;
						width: 100vw;
						border-bottom: 1px solid ${globalStyles.primary};
						background-color: ${globalStyles.background};
					};`}
        </style>
      </div>
    );
  }
}

export default NavBar;
