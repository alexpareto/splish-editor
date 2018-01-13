export default `
// outgoing coordinate
varying vec2 v_texCoord;
varying vec2 v_texCoord2;

// incoming coordinate (point)
attribute vec2 a_texCoord;  

// maximum number of changes to grid
#define MAXPOINTS 30 

uniform vec2 p1[MAXPOINTS];    // Where the drag started
uniform vec2 p2[MAXPOINTS];    // Where the drag ended
uniform vec2 anchors[MAXPOINTS];
uniform float tween0;

void main() { 
  
  v_texCoord = a_texCoord;
  v_texCoord2 = a_texCoord;

  // Set up position variable with current coordinate normalized from 0 - 1 to -1 to 1 range 
  vec2 position = a_texCoord * 2.0 - 1.0; 
  vec2 pt2;
  float dx, dy;
  float tween = tween0;

  for (int i = 0; i < MAXPOINTS; i++) // loop through 
  {
    dx = p1[i].x - p2[i].x;
    dy = p1[i].y - p2[i].y;
    pt2.x = p1[i].x + dx * tween * 400.0;
    pt2.y = p1[i].y + dy * tween * 400.0;

    float dragdistance = distance(p1[i], p2[i]);
    float mydistance = distance(p1[i], position);

    if (mydistance < dragdistance * 4.0) 
    {
      vec2 maxdistort = (p2[i] - pt2) / 800.0;
      float normalizeddistance = mydistance / (dragdistance * 4.0);                
      float normalizedimpact = (cos(normalizeddistance*3.14159265359)+1.0)/2.0;
      v_texCoord -= (maxdistort * normalizedimpact);  

      // draw a line between the anchor and the texture point
      // if there the output texture point is on the opposite side of the line
      // it should be masked
      // for(int j = 0; j < MAXPOINTS; j++)
      // {
      //   float dy = anchors[j].y - a_texCoord.y;
      //   float dx = anchors[j].x - a_texCoord.x;
      //   float slope = 1.0/(dy/dx);
      //   float yIntercept = anchors[j].y - slope * anchors[j].x;

      //   bool isCurrentAboveLine = a_texCoord.y > (a_texCoord.x * slope + yIntercept);
      //   bool isNextAboveLine = v_texCoord.y > (v_texCoord.x * slope + yIntercept);

      //   if(
      //     (isCurrentAboveLine && !isNextAboveLine) || 
      //     (!isCurrentAboveLine && isNextAboveLine) 
      //     ) {

      //     v_texCoord += (maxdistort * normalizedimpact);
      //   }
      // } 
    }
  }

  tween = 1.0 - tween0;

  for (int i = 0; i < MAXPOINTS; i++) // loop through 
  {
    dx = p1[i].x - p2[i].x;
    dy = p1[i].y - p2[i].y;
    pt2.x = p1[i].x + dx * tween * 400.0;
    pt2.y = p1[i].y + dy * tween * 400.0;

    float dragdistance = distance(p1[i], p2[i]); // Calculate the distance between two start and end of mouse drag for each of the drags
    float mydistance = distance(p1[i], position);  // Calculate the distance between the start of the mouse drag and the last position  
    if (mydistance < dragdistance * 4.0) 
    {
      vec2 maxdistort = (p2[i] - pt2) / 800.0;    // only affect vertices within 4 x the drag distance ( 
      float normalizeddistance = mydistance / (dragdistance * 4.0);                
      float normalizedimpact = (cos(normalizeddistance*3.14159265359)+1.0)/2.0;
      v_texCoord2 += (maxdistort * normalizedimpact);

      // draw a line between the anchor and the texture point
      // if there the output texture point is on the opposite side of the line
      // it should be masked
      // for(int j = 0; j < MAXPOINTS; j++)
      // {
      //   float dy = anchors[j].y - a_texCoord.y;
      //   float dx = anchors[j].x - a_texCoord.x;
      //   float slope = 1.0/(dy/dx);
      //   float yIntercept = anchors[j].y - slope * anchors[j].x;

      //   bool isCurrentAboveLine = a_texCoord.y > (a_texCoord.x * slope + yIntercept);
      //   bool isNextAboveLine = v_texCoord2.y > (v_texCoord2.x * slope + yIntercept);

      //   if(
      //     (isCurrentAboveLine && !isNextAboveLine) || 
      //     (!isCurrentAboveLine && isNextAboveLine) 
      //     ) {

      //     v_texCoord2 -= (maxdistort * normalizedimpact);
      //   }
      // } 
    }
  }

// gl_Position always specifies where to render this vector 
gl_Position = vec4(position, 0.0, 1.0);     // x,y,z,
}
`;