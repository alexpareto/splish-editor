import electron from 'electron';
import { app, BrowserWindow } from 'electron';

// get client image dimensions that fit the screen nicely
export default (naturalDimensions, hPadding, vPadding, headerSize) => {
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
