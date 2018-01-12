export default `
precision mediump float;

// uniform to use for texture 
uniform sampler2D u_image;
uniform float tween1;

// Output of the vertex shader 
varying vec2 v_texCoord;
varying vec2 v_texCoord2;

void main() {
  // gl_FragColor always specifies the color to make the current pixel 
  vec4 color0 = texture2D(u_image, v_texCoord);
	vec4 color1 = texture2D(u_image, v_texCoord2);

  // color.a = tween1;
  gl_FragColor = color0 * (1.0 - tween1) + color1 * tween1;
}
`;