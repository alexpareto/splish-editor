export default `
// outgoing coordinate
varying vec2 v_texCoord;

// incoming coordinate (point)
attribute vec2 a_texCoord;  

// maximum number of changes to grid
#define MAXPOINTS 30 

uniform vec2 p1[MAXPOINTS];    // Where the drag started
uniform vec2 p2[MAXPOINTS];    // Where the drag ended

void main() { 
  
  v_texCoord = a_texCoord;  
  // Set up position variable with current coordinate normalized from 0 - 1 to -1 to 1 range 
  vec2 position = a_texCoord * 2.0 - 1.0; 

  for (int i = 0; i < MAXPOINTS; i++) // loop through 
  {
    float dragdistance = distance(p1[i], p2[i]); // Calculate the distance between two start and end of mouse drag for each of the drags
    float mydistance = distance(p1[i], position);  // Calculate the distance between the start of the mouse drag and the last position  
    if (mydistance < dragdistance && position.x < 0.99 && position.x > -0.99) 
    {
      vec2 maxdistort = (p2[i] - p1[i]) / 4.0;    // only affect vertices within 4 x the drag distance ( 
      float normalizeddistance = mydistance / dragdistance;                
      float normalizedimpact = (cos(normalizeddistance*3.14159265359)+1.0)/2.0;
      position += (maxdistort * normalizedimpact);  
    }
  }
// gl_Position always specifies where to render this vector 
gl_Position = vec4(position, 0.0, 1.0);     // x,y,z,
}
`;