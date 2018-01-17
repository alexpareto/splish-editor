export default (
  dragDistance,
  anchorImpact,
  impactDivisor,
  numVectors,
  numAnchors,
) => {
  return `
// outgoing coordinate
varying vec2 v_texCoord;
varying vec2 v_texCoord2;

// incoming coordinate (point)
attribute vec2 a_texCoord;  

// maximum number of changes to grid
#define NUM_VECTORS ${numVectors}
#define NUM_ANCHORS ${numAnchors}  

uniform vec2 p1[NUM_VECTORS];    // Where the drag started
uniform vec2 p2[NUM_VECTORS];    // Where the drag ended
uniform vec2 anchors[NUM_ANCHORS];
uniform float tween0;

void main() { 
  
  v_texCoord = a_texCoord;
  v_texCoord2 = a_texCoord;

  // Set up position variable with current coordinate normalized from 0 - 1 to -1 to 1 range 
  vec2 position = a_texCoord * 2.0 - 1.0; 
  vec2 ptAhead;
  vec2 ptBehind;
  float dx, dy;
  float tweenAhead = tween0;
  float tweenBehind = 1.0 - tween0;

  for (int i = 0; i < NUM_VECTORS - 1; i++) // loop through 
  {
    dx = p1[i].x - p2[i].x;
    dy = p1[i].y - p2[i].y;
    ptAhead.x = p1[i].x + dx * tweenAhead;
    ptAhead.y = p1[i].y + dy * tweenAhead;
    ptBehind.x = p1[i].x + dx * tweenBehind;
    ptBehind.y = p1[i].y + dy * tweenBehind;


    float dragdistance = distance(p1[i], p2[i]);
    float mydistancePoint = distance(p1[i], position);

    float vectorSlope = (p2[i].y - p1[i].y) / (p2[i].x - p1[i].x);
    float vectorIntercept = (p1[i].y - vectorSlope*p1[i].x);
    float normalIntercept = (position.y - (1.0/vectorSlope)*position.x);
    vec2 interceptPoint;
    interceptPoint.x = (vectorIntercept - normalIntercept) / (1.0/vectorSlope - vectorSlope);
    interceptPoint.y = interceptPoint.x * vectorSlope + vectorIntercept;

    float mydistanceline = distance(interceptPoint, position);

    float mydistance = (mydistancePoint*2.0 + mydistanceline) / 3.0;

    if (mydistance < dragdistance * ${dragDistance}) 
    {
      vec2 maxdistortAhead = (p1[i] - ptAhead);
      vec2 maxdistortBehind = (p1[i] - ptBehind);
      float normalizeddistance = mydistance / (dragdistance * ${dragDistance});

      float normalizedimpact = (cos(normalizeddistance*3.14159265359)+1.0)/${impactDivisor};

      // draw a line through each anchor perpendicular to the vector point
      // normalize impact based off of distance to that line
      vec2 pt1 = (p1[i] + 1.0) / 2.0;
      vec2 intersect;
      float min = 1.0 / ${anchorImpact};
      bool isDifSide;

      for(int j = 0; j < NUM_ANCHORS - 1; j++)
      {
        float dist = distance(anchors[j], a_texCoord);
        float dy = anchors[j].y - pt1.y;
        float dx = anchors[j].x - pt1.x;

        // prevent divide by zero errors
        // dx += 0.000001;
        // dy += 0.000001;

        float slope = 1.0 / (-dy/dx);
        float yIntercept = anchors[j].y - (slope * anchors[j].x);
        float yInterceptTex = a_texCoord.y - (1.0 / slope) * a_texCoord.x;
        intersect.x = (yIntercept - yInterceptTex) / ((1.0/slope) - slope);
        intersect.y = slope * intersect.x + yIntercept;
        float intersectDistance = distance(intersect, a_texCoord);

        if(intersectDistance < min)
        {
          min = intersectDistance;
        }

        isDifSide = 
          (a_texCoord.y > (a_texCoord.x * slope + yIntercept)) !=
          (pt1.y > (pt1.x * slope + yIntercept));

        if(isDifSide) {
          break;
        }
      }

      if(isDifSide) {
        v_texCoord = a_texCoord;
        v_texCoord2 = a_texCoord;
      } else {
        v_texCoord -= (maxdistortAhead * normalizedimpact * min * ${anchorImpact});
        v_texCoord2 += (maxdistortBehind * normalizedimpact * min * ${anchorImpact});
      }

    }
  }

// gl_Position always specifies where to render this vector 
gl_Position = vec4(position, 0.0, 1.0);     // x,y,z,
}
`;
};
