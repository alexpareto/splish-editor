import electron from 'electron';
import getFfmpeg from './getFfmpeg';

export default (ctx, canvas, orientation) => {
  switch (orientation) {
    case 2:
      // horizontal flip
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      break;
    case 3:
      // 180° rotate left
      ctx.translate(canvas.width, canvas.height);
      ctx.rotate(Math.PI);
      break;
    case 4:
      // vertical flip
      ctx.translate(0, canvas.height);
      ctx.scale(1, -1);
      break;
    case 5:
      // vertical flip + 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.scale(1, -1);
      ctx.scale(canvas.height / canvas.width, canvas.width / canvas.height);
      break;
    case 6:
      // 90° rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(0, -canvas.height);
      ctx.scale(canvas.height / canvas.width, canvas.width / canvas.height);
      ctx.translate(
        0,
        (canvas.height - canvas.width) * canvas.height / canvas.width,
      );
      break;
    case 7:
      // horizontal flip + 90 rotate right
      ctx.rotate(0.5 * Math.PI);
      ctx.translate(canvas.width, -canvas.height);
      ctx.scale(-1, 1);
      ctx.scale(canvas.height / canvas.width, canvas.width / canvas.height);
      ctx.translate(
        (canvas.width - canvas.height) * canvas.width / canvas.height,
        (canvas.height - canvas.width) * canvas.height / canvas.width,
      );
      break;
    case 8:
      // 90° rotate left
      ctx.rotate(-0.5 * Math.PI);
      ctx.translate(-canvas.width, 0);
      ctx.scale(1, 1);
      ctx.scale(canvas.height / canvas.width, canvas.width / canvas.height);
      ctx.translate(
        (canvas.width - canvas.height) * canvas.width / canvas.height,
        0,
      );
      break;
  }

  return ctx;
};
