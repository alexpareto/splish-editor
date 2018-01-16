import React from 'react';
import * as globalStyles from '../globalStyles';
import FileSelection from './fileSelection';
import FileSaver from './fileSaver';
import IconButton from './iconButton';
import PreviewToggle from './previewToggle';
import Link from 'next/link';

class NavBar extends React.Component {
  anchorClicked = () => {
    if (this.props.isInitialized) {
      this.props.selectAnchorTool();
    } else {
      this.props.initializeMovingStillCanvas('anchor');
    }
  };

  vectorClicked = () => {
    if (this.props.isInitialized) {
      this.props.selectVectorTool();
    } else {
      this.props.initializeMovingStillCanvas('vector');
    }
  };

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
            type="img"
            filesHandler={this.props.selectMovingStillImage}
          />
          <IconButton
            onClick={this.vectorClicked}
            stroke={globalStyles.background}
            name="arrowDownLeft"
            backgroundColor={globalStyles.secondary}
          />
          <IconButton
            onClick={this.anchorClicked}
            stroke={globalStyles.background}
            name="anchor"
            backgroundColor={globalStyles.secondary}
          />
          <PreviewToggle
            viewMode={this.props.viewMode}
            startPreview={this.props.startMovingStillPreviewMode}
            startEdit={this.props.startMovingStillEditMode}
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
