const createImageGrid = resolution => {
  var q = 0.000000001;

  var r = (1 - q * 2) / resolution;
  //2 numbers per coord; three coords per triangle; 2 triagles per square; resolution * resolution squares.
  var c = new Float32Array(resolution * resolution * 12);

  var i = 0;

  for (var xs = 0; xs < resolution; xs++) {
    for (var ys = 0; ys < resolution; ys++) {
      var x = r * xs + q;
      var y = r * ys + q;

      c[i++] = x;
      c[i++] = y;

      c[i++] = x + r;
      c[i++] = y;

      c[i++] = x;
      c[i++] = y + r;

      c[i++] = x + r;
      c[i++] = y;

      c[i++] = x;
      c[i++] = y + r;

      c[i++] = x + r;
      c[i++] = y + r;
    }
  }
  return c;
};

export default createImageGrid;
