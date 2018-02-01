// this helper returns scaled dimensions of images
// with respect to some common film standards
export default (naturalDimensions, quality) => {
  let MAX_PIXELS;
  switch (quality) {
    case '4K':
      MAX_PIXELS = 3840 * 2160;
      break;
    case '2K':
      MAX_PIXELS = 2048 * 1080;
      break;
    default:
      MAX_PIXELS = 2048 * 1080;
  }

  const naturalPixels = naturalDimensions.width * naturalDimensions.height;

  if (naturalPixels <= MAX_PIXELS) {
    return naturalDimensions;
  }

  const aspectRatio = naturalDimensions.width / naturalDimensions.height;
  let throttleHeight = Math.sqrt(MAX_PIXELS / aspectRatio);
  let throttleWidth = throttleHeight * aspectRatio;

  return {
    width: Math.floor(throttleWidth),
    height: Math.floor(throttleHeight),
  };
};
