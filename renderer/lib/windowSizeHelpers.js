import electron from 'electron';
import { app, BrowserWindow } from 'electron';

// get client image dimensions that fit the screen nicely
export const getBoundingRect = (
  naturalDimensions,
  hPadding,
  vPadding,
  headerSize,
) => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  const naturalAspectRatio = naturalDimensions.height / naturalDimensions.width;
  const screenAspectRatio = height / width;
  let boundingHeight, boundingWidth;

  if (naturalAspectRatio > screenAspectRatio) {
    boundingHeight = Math.min(naturalDimensions.height, height - vPadding);
    boundingWidth = boundingHeight / naturalAspectRatio;
  } else {
    boundingWidth = Math.min(naturalDimensions.width, width - hPadding);
    boundingHeight = boundingWidth * naturalAspectRatio;
  }

  if (boundingWidth > width - hPadding) {
    let multipler = (width - hPadding) / boundingWidth;
    boundingWidth *= multiplier;
    boundingHeight *= multiplier;
  }

  if (boundingHeight > height - vPadding) {
    let multiplier = (height - vPadding) / boundingHeight;
    boundingHeight *= multiplier;
    boundingWidth *= multiplier;
  }

  return {
    x: hPadding / 2,
    y: (vPadding - headerSize) / 2 + headerSize,
    width: boundingWidth,
    height: boundingHeight,
  };
};

export const setWindowSize = (boundingRect, hPadding, vPadding) => {
  const win = electron.remote.getCurrentWindow();
  const winWidth = Math.floor(boundingRect.width + hPadding);
  const winHeight = Math.floor(boundingRect.height + vPadding);
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  let bounds = win.getBounds();

  let minWidth = Math.floor(width * 3 / 5);
  let minHeight = Math.floor(height * 3 / 4);

  bounds.width = Math.max(winWidth, minWidth);
  bounds.height = Math.max(winHeight, minHeight);
  bounds.x = Math.floor((width - bounds.width) / 2);
  bounds.y = Math.floor((height - bounds.height) / 2);

  win.setBounds(bounds, true);
};
