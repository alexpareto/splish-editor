// this helper returns scaled dimensions of images
// with respect to some common film standards
export default (naturalDimensions, quality) => {
  let MAX_PIXELS;
  switch (quality) {
    case '4K':
      MAX_PIXELS = 3840 * 2160;
      break;
    case '2K':
      MAX_PIXELS = 1920 * 1080;
      break;
    case 'HD':
      MAX_PIXELS = 1280 * 720;
      break;
    default:
      MAX_PIXELS = 1920 * 1080;
  }

  const naturalPixels = naturalDimensions.width * naturalDimensions.height;

  if (naturalPixels <= MAX_PIXELS) {
    let evenWidth =
      naturalDimensions.width % 2 == 0
        ? naturalDimensions.width
        : naturalDimensions.width + 1;

    let evenHeight =
      naturalDimensions.height % 2 == 0
        ? naturalDimensions.height
        : naturalDimensions.height + 1;

    naturalDimensions.width = evenWidth;
    naturalDimensions.height = evenHeight;

    return naturalDimensions;
  }

  const aspectRatio = naturalDimensions.width / naturalDimensions.height;
  let throttleHeight = Math.sqrt(MAX_PIXELS / aspectRatio);
  let throttleWidth = throttleHeight * aspectRatio;

  let evenWidth = Math.floor(throttleWidth);
  let evenHeight = Math.floor(throttleHeight);

  evenWidth = evenWidth % 2 == 0 ? evenWidth : evenWidth - 1;
  evenHeight = evenHeight % 2 == 0 ? evenHeight : evenHeight - 1;

  return {
    width: evenWidth,
    height: evenHeight,
  };
};
