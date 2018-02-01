import electron from 'electron';
import { app, BrowserWindow } from 'electron';

// get client image dimensions that fit the screen nicely
export default naturalDimensions => {
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  const padding = 50;
  const naturalAspectRatio = naturalDimensions.height / naturalDimensions.width;
  const screenAspectRatio = height / width;
  let boundingHeight, boundingWidth;

  if (naturalAspectRatio > screenAspectRatio) {
    boundingHeight = Math.min(naturalDimensions.height, height - padding);
    boundingWidth = boundingHeight / naturalAspectRatio;
  } else {
    boundingWidth = Math.min(naturalDimensions.width, width - padding);
    boundingHeight = boundingWidth * naturalAspectRatio;
  }

  return {
    width: boundingWidth,
    height: boundingHeight,
  };
};
