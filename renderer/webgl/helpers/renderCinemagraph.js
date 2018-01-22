import vertexShader from '../shaders/previewVertexShader';
import imageFragShader from '../shaders/imageFragShader';
import fs from 'fs';
import getShader from './getShader';
import loadProgram from './loadProgram';
import TarToMp4 from './tarToMp4';

class Preview {
  constructor(brushPoints, boundingRect, exportCallback) {
    this.brushPoints = brushPoints;
    this.boundingRect = boundingRect;
    this.exportCallback = exportCallback;

    // this.numBrushPoints = brushPoints.length + 1;

    this.canvas = document.getElementById('cinemagraphcanvas');
    this.gl = this.canvas.getContext('webgl');

    //state
    this.isCapturing = false;
    this.captureProgress = 0;
    this.framerate = 24;

    // video capturing
    let CCapture;
    if (window) {
      CCapture = require('zcapture.js');
    }

    this.capturer = new CCapture({
      format: 'jpg',
      verbose: true,
      display: false,
      quality: 99,
    });

    //set video to 2d canvas
    this.canvas2d = document.getElementById('cinemagraph2d');
    this.ctx = this.canvas2d.getContext('2d');
    this.video = document.getElementById('cinemagraphVideo');

    this.start();
  }

  capture = () => {
    this.captureProgress = 0;
    this.tween = 0;
    this.capturer.start();
    this.isCapturing = true;
  };

  init = () => {};

  update = () => {
    this.init();
  };

  boundedPoint = (x, y) => {
    if (x < -1) x = -1;
    if (y < -1) y = -1;
    if (x > 1) x = 1;
    if (y > 1) y = 1;

    return { x, y };
  };

  render = () => {
    this.ctx.drawImage(this.video, 0, 0);
  };

  start = () => {
    this.isPlaying = true;
    window.requestAnimationFrame(this.renderAnimationFrame);
  };

  renderAnimationFrame = time => {
    this.render();

    this.capturer.capture(this.canvas);

    if (this.isCapturing) {
      this.captureProgress++;
      if (this.captureProgress > this.framerate * this.duration) {
        this.capturer.stop();
        this.capturer.save(blob => {
          let ttMp4 = new TarToMp4(blob);

          // export mp4 to temporary storage (for now)
          ttMp4.export('./renderer/static/temp/', this.exportCallback);
        });
        this.isCapturing = false;
      }
    }

    if (this.isPlaying) {
      window.requestAnimationFrame(this.renderAnimationFrame);
    }
  };

  normalizedPoint = (x, y, width, height) => {
    x = x / width * 2 - 1;
    y = (1 - y / height) * 2 - 1;

    return this.boundedPoint(x, y);
  };
}

export default Preview;
