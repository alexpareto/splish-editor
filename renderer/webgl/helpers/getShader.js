// Loads a shader from a script tag
// Parameters:
//   WebGL context
//   id of script element containing the shader to load
const getShader = (gl, str, type) => {
  var shader;

  // Create shaders based on the type we set
  //   note: these types are commonly used, but not required
  if (type == 'frag') {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (type == 'vertex') {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  // Check the compile status, return an error if failed
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log('SHADER FAILED TO COMPILE: ', gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
};

export default getShader;
