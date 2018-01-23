export default `
precision mediump float;

// uniform to use for texture 
uniform sampler2D u_image0; // corresponds to the video
uniform sampler2D u_image1; // corresponds to the still
varying vec2 v_texCoord;

void main() {
  // gl_FragColor always specifies the color to make the current pixel 
  vec4 color0 = texture2D(u_image0, v_texCoord);
  vec4 color1 = texture2D(u_image1, v_texCoord);
  float a = color1.a;
  color1.a = 1.0;
  vec4 color = color1*a + (1.0 - a)*color0;
  gl_FragColor = color;
}
`;
