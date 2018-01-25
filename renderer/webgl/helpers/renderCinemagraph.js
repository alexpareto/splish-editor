import cinemagraphVertexShader from '../shaders/cinemagraphVertexShader';
import cinemagraphFragShader from '../shaders/cinemagraphFragShader';
import fs from 'fs';
import getShader from './getShader';
import loadProgram from './loadProgram';
import createImageGrid from './createImageGrid';
import TarToMp4 from './tarToMp4';

class Preview {
  constructor(boundingRect, exportCallback) {
    this.boundingRect = boundingRect;
    this.exportCallback = exportCallback;

    this.canvas = document.getElementById('cinemagraphcanvas');
    this.gl = this.canvas.getContext('webgl');

    //state
    this.isCapturing = false;
    this.captureProgress = 0;
    this.framerate = 30;
    this.resolution = 20;
    this.hasRendered = false;

    this.canvas2d = document.getElementById('2dcinemagraph');
    this.ctx = this.canvas2d.getContext('2d');

    this.video = document.getElementById('cinemagraphVideo');
    this.duration = this.video.duration;
    console.log('DURATION: ', this.duration);
    this.videoWidth = this.video.videoWidth;
    this.videoHeight = this.video.videoHeight;
    this.vidTexture = this.gl.createTexture();
    this.imgTexture = this.gl.createTexture();
    this.originalImage = [];
    this.brushedImage = [];

    // video capturing
    let CCapture;
    if (window) {
      CCapture = require('zcapture.js');
    }

    this.capturer = new CCapture({
      format: 'jpg',
      verbose: true,
      display: false,
      framerate: 30,
      quality: 99,
      syncVideo: this.video,
    });

    this.init();
  }

  capture = () => {
    this.captureProgress = 0;
    this.video.currentTime = 0;
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
      this.pictureprogram.u_image0 = gl.getUniformLocation(
        this.pictureprogram,
        'u_image0',
      );

      this.pictureprogram.u_image1 = gl.getUniformLocation(
        this.pictureprogram,
        'u_image1',
      );

      // Set the texture to use.
      gl.uniform1i(this.pictureprogram.u_image0, 0);
      gl.uniform1i(this.pictureprogram.u_image1, 1);
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

    // do the same for the image texture
    gl.bindTexture(gl.TEXTURE_2D, this.imgTexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Set each texture unit to use a particular texture.
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.vidTexture);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.imgTexture);

    this.start();
  };

  update = newPoint => {
    const normalizedPoint = this.normalizedPoint(
      newPoint[0],
      newPoint[1],
      this.boundingRect.width,
      this.boundingRect.height,
    );

    let l = this.brushedImage.data.length / 4;
    for (let i = 0; i < l; i++) {
      const x = i % this.videoWidth;
      const y = Math.min(i / this.videoWidth);
      let dist = Math.sqrt(
        Math.pow(normalizedPoint.x - x, 2) + Math.pow(normalizedPoint.y - y, 2),
      );
      if (dist < 80) {
        const blur = 6.0;
        const normalizedDistance = Math.pow(dist / 80.0, blur) * 255.0;

        this.brushedImage.data[i * 4 + 3] = Math.min(
          this.brushedImage.data[i * 4 + 3],
          normalizedDistance,
        );
      }
    }
  };

  render = () => {
    const resolution = this.resolution;
    let gl = this.gl;

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.vidTexture);

    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.video,
    );

    // for now just take a snapshot of the first frame played
    // as the still image
    // TODO: seek to a specified still image in the video and
    // set that!
    if (!this.hasRendered) {
      this.ctx.drawImage(this.video, 0, 0, this.videoWidth, this.videoHeight);

      this.originalImage = this.ctx.getImageData(
        0,
        0,
        this.videoWidth,
        this.videoHeight,
      );
      this.brushedImage = this.ctx.getImageData(
        0,
        0,
        this.videoWidth,
        this.videoHeight,
      );

      this.hasRendered = true;
    } else {
      this.ctx.putImageData(this.brushedImage, 0, 0);
    }

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.imgTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.canvas2d,
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
      if (this.isCapturing) {
        window.requestAnimationFrame(this.renderAnimationFrame);
      } else {
        setTimeout(() => {
          this.renderAnimationFrame();
        }, 40);
      }
    }
  };

  // normalized relative to videoHeight/width
  normalizedPoint = (x, y, width, height) => {
    x = Math.max(x / width * this.videoWidth);
    y = Math.max(y / height * this.videoHeight);

    return { x, y };
  };
}

export default Preview;
