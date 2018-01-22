import cinemagraphVertexShader from '../shaders/cinemagraphVertexShader';
import cinemagraphFragShader from '../shaders/cinemagraphFragShader';
import fs from 'fs';
import getShader from './getShader';
import loadProgram from './loadProgram';
import createImageGrid from './createImageGrid';
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
    this.resolution = 20;

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

    this.video = document.getElementById('cinemagraphVideo');
    this.vidTexture = this.gl.createTexture();
    this.init();
  }

  capture = () => {
    this.captureProgress = 0;
    this.tween = 0;
    this.capturer.start();
    this.isCapturing = true;
  };

  init = () => {
    let canvas = this.canvas;
    let gl = this.gl;
    try {
      let vertexshader = getShader(gl, cinemagraphVertexShader, 'vertex');
      let fragmentshader = getShader(gl, cinemagraphFragShader, 'frag');

      this.pictureprogram = loadProgram(gl, vertexshader, fragmentshader);
      gl.useProgram(this.pictureprogram);

      // Look up where the vertex data needs to go.
      this.texCoordLocation = gl.getAttribLocation(
        this.pictureprogram,
        'a_texCoord',
      );

      // Provide texture coordinates for the rectangle.
      this.texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);

      // createImageGrid sets up the vector array itself
      gl.bufferData(
        gl.ARRAY_BUFFER,
        createImageGrid(this.resolution),
        gl.STATIC_DRAW,
      ); // Fill buffer data
      gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(this.texCoordLocation);
      // Set up uniforms variables (image).
      this.pictureprogram.u_image = gl.getUniformLocation(
        this.pictureprogram,
        'u_image',
      );

      // Set the texture to use.
      gl.uniform1i(this.pictureprogram.u_image, 0);
    } catch (e) {
      console.log('ERROR MAKING SHADERS: ', e);
      return;
    }

    // Bind the texture the target (TEXTURE_2D) of the active texture unit.
    gl.bindTexture(gl.TEXTURE_2D, this.vidTexture);

    // Flip the image's Y axis to match the WebGL texture coordinate space.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this.start();
  };

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
    const resolution = this.resolution;
    let gl = this.gl;

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.video,
    );

    //  Clear color buffer and set it to light gray
    gl.clearColor(1.0, 1.0, 1.0, 0.5);
    gl.clear(this.gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);

    gl.useProgram(this.pictureprogram);

    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(this.texCoordLocation);

    gl.drawArrays(gl.TRIANGLES, 0, resolution * resolution * 2 * 3);
  };

  start = () => {
    this.isPlaying = true;
    this.renderAnimationFrame();
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

    // preview at a lower framerate than 60fps
    // frame every 40 ms => 25 fps
    if (this.isPlaying) {
      setTimeout(() => {
        this.renderAnimationFrame();
      }, 40);
    }
  };

  normalizedPoint = (x, y, width, height) => {
    x = x / width * 2 - 1;
    y = (1 - y / height) * 2 - 1;

    return this.boundedPoint(x, y);
  };
}

export default Preview;
