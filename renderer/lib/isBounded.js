export default (corners, point) => {
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
