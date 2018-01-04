export default `
precision mediump float;

varying vec2 v_texCoord;

// Set a solid color for the grid 
void main() {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
} 
`;