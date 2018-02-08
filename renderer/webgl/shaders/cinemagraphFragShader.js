export default (r, g, b) => {
  return `
precision mediump float;

// uniform to use for texture 
uniform sampler2D u_image0; // corresponds to the video
uniform sampler2D u_image1; // corresponds to the still
uniform bool show_overlay;
uniform bool is_seeking;
varying vec2 v_texCoord;

void main() {
  // gl_FragColor always specifies the color to make the current pixel 
  vec4 color0 = texture2D(u_image0, v_texCoord);
  vec4 color1 = texture2D(u_image1, v_texCoord);
  vec4 colorOverlay = vec4(${r}, ${g}, ${b}, 1.0);
  float a = color1.a;
  color1.a = 1.0;

  // control flow
  if(show_overlay) {
  	color1 = 0.65 * a * color1 + 0.35 * a * colorOverlay;
  }

  if(is_seeking) {
    a = min(0.6, a);
  }

  vec4 color = color1*a + (1.0 - a)*color0;
  gl_FragColor = color;
}
`;
};
