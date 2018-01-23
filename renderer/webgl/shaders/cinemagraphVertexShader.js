export default ` 
// outgoing coordinate
varying vec2 v_texCoord;

// incoming coordinate (point)
attribute vec2 a_texCoord; 

void main() { 
  //output clipspace point
  v_texCoord = a_texCoord;
  vec2 position = a_texCoord * 2.0 - 1.0; 
	gl_Position = vec4(position, 0.0, 1.0);
}
`;
