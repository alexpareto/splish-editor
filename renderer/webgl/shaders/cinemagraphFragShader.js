export default `
precision mediump float;

// uniform to use for texture 
uniform sampler2D u_image;
varying vec2 v_texCoord;

void main() {
  // gl_FragColor always specifies the color to make the current pixel 
  vec4 color0 = texture2D(u_image, v_texCoord);

  gl_FragColor = color0;
}
`;
