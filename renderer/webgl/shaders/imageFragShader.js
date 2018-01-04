export default `
precision mediump float;

// uniform to use for texture 
uniform sampler2D u_image;

// Output of the vertex shader 
varying vec2 v_texCoord;

void main() {
  // gl_FragColor always specifies the color to make the current pixel 
  gl_FragColor = texture2D(u_image, v_texCoord);  
}
`;