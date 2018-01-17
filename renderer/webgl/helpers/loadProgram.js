const loadProgram = (gl, vertexShader, fragmentShader) => {
  // create a progam object
  var program = gl.createProgram();

  // attach the two shaders
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link everything
  gl.linkProgram(program);

  // Check the link status
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // An error occurred while linking
    var lastError = gl.getProgramInfoLog(program);
    console.warn('Error in program linking:' + lastError);

    gl.deleteProgram(program);
    return null;
  }

  // if all is well, return the program object
  return program;
};

export default loadProgram;
