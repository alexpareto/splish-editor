import * as d3 from 'd3';

export const isBounded = (corners, point) => {
  const lowerX = corners[0].x < corners[1].x ? corners[0].x : corners[1].x;
  const upperX = corners[0].x >= corners[1].x ? corners[0].x : corners[1].x;
  const lowerY = corners[0].y < corners[1].y ? corners[0].y : corners[1].y;
  const upperY = corners[0].y >= corners[1].y ? corners[0].y : corners[1].y;

  return (
    point.x <= upperX &&
    point.x >= lowerX &&
    point.y <= upperY &&
    point.y >= lowerY
  );
};

export const drawVectorPath = (vectorCanvas, vector) => {
  let path = vectorCanvas.append('path');
  path
    .attr('stroke', '#000')
    .attr('stroke-width', 1)
    .attr('stroke-dasharray', '3, 5')
    .attr('stroke-linecap', 'round');
  let data = [
    { x: vector[0].x, y: vector[0].y },
    { x: vector[1].x, y: vector[1].y },
  ];
  path.attr('d', lineFunction(data));
  vector[0].path = path;

  return vector;
};

export const drawVectorHead = (vectorCanvas, vector) => {
  console.log('VECTOR: ', vector);
  //draw arrow head
  let path = vectorCanvas.append('path');
  let dx = vector[1].x - vector[0].x;
  let dy = vector[1].y - vector[0].y;
  let d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  let headLength = 5;
  let headWidth = 3;
  let p = [
    vector[1].x - dx * headLength / d,
    vector[1].y - dy * headLength / d,
  ];
  let p1 = [p[0] - dy * headWidth / d, p[1] + dx * headWidth / d];
  let p2 = [p[0] + dy * headWidth / d, p[1] - dx * headWidth / d];
  let dataPath = [
    { x: p1[0], y: p1[1] },
    { x: vector[1].x, y: vector[1].y },
    { x: p2[0], y: p2[1] },
  ];

  path
    .attr('d', lineFunction(dataPath))
    .attr('stroke', 'red')
    .attr('fill', 'none');

  vector[1].path = path;

  return vector;
};

export const lineFunction = d3
  .line()
  .x(function(data) {
    return data.x;
  })
  .y(function(data) {
    return data.y;
  });

export const removeVector = (vectorList, vector) => {
  let removeIndex = vectorList.length - 1;
  for (let i = vectorList.length - 1; i >= 0; i--) {
    if (
      vector[0].x == vectorList[i][0].x &&
      vector[1].x == vectorList[i][1].x &&
      vector[0].y == vectorList[i][0].y &&
      vector[1].y == vectorList[i][1].y
    ) {
      removeIndex = i;
      break;
    }
  }

  vectorList.splice(removeIndex, 1);
  vector[0].path.remove();
  vector[1].path.remove();

  return vectorList;
};

export const removeAnchor = (anchorList, anchor) => {
  let removeIndex = anchorList.length - 1;
  for (let i = anchorList.length - 1; i >= 0; i--) {
    if (anchorList[i].x == anchor.x && anchorList[i].y == anchor.y) {
      removeIndex = i;
      break;
    }
  }

  anchorList.splice(removeIndex, 1);
  anchor.component.remove();
  return anchorList;
};
