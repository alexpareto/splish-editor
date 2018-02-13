export default (orientation, dimensions) => {
  if (orientation > 4) {
    const width = dimensions.width;
    const height = dimensions.height;
    dimensions.height = width;
    dimensions.width = height;
  }

  return dimensions;
};
