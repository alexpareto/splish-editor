import cinemagraphVertexShader from '../shaders/cinemagraphVertexShader';
import cinemagraphFragShader from '../shaders/cinemagraphFragShader';
import fs from 'fs';
import getShader from './getShader';
import loadProgram from './loadProgram';
import createImageGrid from './createImageGrid';
import * as globalStyles from '../../globalStyles';
import hexToRGB from '../../lib/hexToRGB';
import VideoUploader from '../../lib/videoUploader';

class Preview {
  constructor(boundingRect, exportCallback, previewDimensions) {
    this.boundingRect = boundingRect;
    this.exportCallback = exportCallback;
    this.overlayColor = hexToRGB(globalStyles.action);

    // normalize color
    this.overlayColor.r = this.overlayColor.r / 255.0;
    this.overlayColor.g = this.overlayColor.g / 255.0;
    this.overlayColor.b = this.overlayColor.b / 255.0;
    this.showOverlay = false;

    this.canvas = document.getElementById('cinemagraphcanvas');

    this.gl = this.canvas.getContext('webgl');

    //state
    this.isCapturing = false;
    this.captureProgress = 0;
    this.framerate = 25;
    this.resolution = 20;
    this.hasRendered = false;

    this.canvas2d = document.getElementById('2dcinemagraph');
    this.ctx = this.canvas2d.getContext('2d');

    this.video = document.getElementById('cinemagraphVideo');
    this.video.onended = this.restartVideo;
    this.duration = this.video.duration;
    this.startTime = 0;
    this.endTime = this.duration;
    this.videoWidth = previewDimensions.width;
    this.videoHeight = previewDimensions.height;
    this.vidTexture = this.gl.createTexture();
    this.imgTexture = this.gl.createTexture();
    this.originalImage = [];
    this.brushedImage = [];
    this.everyOther = true;

    this.isSeeking = false;
    this.isChoosingStill = false;

    // video capturing
    let CCapture;
    if (window) {
      CCapture = require('zcapture.js');
    }

    this.videoUploader = new VideoUploader(this.exportCallback);

    this.capturer = new CCapture({
      format: 'jpg',
      verbose: true,
      display: false,
      framerate: this.framerate,
      quality: 99,
      syncVideo: this.video,
      handleData: this.videoUploader.addFrame,
    });

    this.init();
  }

  capture = () => {
    this.captureProgress = 0;
    this.video.currentTime = this.startTime;
    this.capturer.start();
    this.isCapturing = true;
  };

  init = () => {
    let canvas = this.canvas;
    let gl = this.gl;
    try {
      let vertexshader = getShader(gl, cinemagraphVertexShader, 'vertex');
      let fragmentshader = getShader(
        gl,
        cinemagraphFragShader(
          this.overlayColor.r.toFixed(5).toString(),
          this.overlayColor.g.toFixed(5).toString(),
          this.overlayColor.b.toFixed(5).toString(),
        ),
        'frag',
      );

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

      this.pictureprogram.show_overlay = gl.getUniformLocation(
        this.pictureprogram,
        'show_overlay',
      );

      this.pictureprogram.is_seeking = gl.getUniformLocation(
        this.pictureprogram,
        'is_seeking',
      );

      // Set the texture to use.
      gl.uniform1i(this.pictureprogram.u_image0, 0);
      gl.uniform1i(this.pictureprogram.u_image1, 1);
      gl.uniform1i(this.pictureprogram.show_overlay, 2);
      gl.uniform1i(this.pictureprogram.is_seeking, 3);
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

  setShowOverlay = newOverlay => {
    this.showOverlay = newOverlay;
  };

  setSeeking = isSeeking => {
    this.isSeeking = isSeeking;
    if (isSeeking) {
      this.video.pause();
    } else {
      this.video.play();
    }
  };

  update = (newPoint, brushSize, brushBlur, brushTool) => {
    const normalizedPoint = this.normalizedPoint(
      newPoint[0],
      newPoint[1],
      this.boundingRect.width,
      this.boundingRect.height,
    );

    // normalize brush size based off of actual image width
    let normalizedBrushSize = Math.ceil(
      brushSize * this.videoWidth / this.boundingRect.width,
    );

    const minX = Math.floor(
      Math.max(normalizedPoint.x - normalizedBrushSize, 0),
    );
    const maxX = Math.min(
      normalizedPoint.x + normalizedBrushSize,
      this.videoWidth,
    );
    const minY = Math.floor(
      Math.max(normalizedPoint.y - normalizedBrushSize, 0),
    );
    const maxY = Math.min(
      normalizedPoint.y + normalizedBrushSize,
      this.videoHeight,
    );

    let blur = 21 - 2 * brushBlur;

    // only iterate over the coordinates within
    // the square of brush size
    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        const i = this.videoWidth * y + x;
        // console.log("I: ", i);
        let dist = Math.sqrt(
          Math.pow(normalizedPoint.x - x, 2) +
            Math.pow(normalizedPoint.y - y, 2),
        );
        if (dist < normalizedBrushSize) {
          const normalizedDistance =
            Math.pow(dist / normalizedBrushSize, blur) * 255.0;

          const opacity =
            brushTool == 'eraser'
              ? Math.min(this.brushedImage.data[i * 4 + 3], normalizedDistance)
              : Math.max(
                  this.brushedImage.data[i * 4 + 3],
                  255.0 - normalizedDistance,
                );
          this.brushedImage.data[i * 4 + 3] = opacity;
        }
      }
    }
  };

  restartVideo = () => {
    if (!this.isSeeking) {
      this.video.currentTime = this.startTime;
      this.video.play();
    }
  };

  updateTrim = (startTime, endTime) => {
    console.log('UPDATING TRIM TO ', startTime, endTime);
    this.endTime = endTime;
    this.startTime = startTime;
    this.duration = endTime - startTime;
    this.video.currentTime = this.startTime;
  };

  setMask = mask => {
    this.brushedImage.data.set(mask);
  };

  getMask = () => {
    return new Uint8ClampedArray(this.brushedImage.data);
  };

  render = () => {
    // no canvas set up so stop rendering
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

    gl.uniform1i(
      gl.getUniformLocation(this.pictureprogram, 'show_overlay'),
      this.showOverlay,
    );

    gl.uniform1i(
      gl.getUniformLocation(this.pictureprogram, 'is_seeking'),
      this.isSeeking,
    );

    gl.drawArrays(gl.TRIANGLES, 0, resolution * resolution * 2 * 3);
  };

  start = () => {
    this.isPlaying = true;
    this.renderAnimationFrame();
  };

  stop = () => {
    this.isPlaying = false;
    console.log('PAUSING HERE');
    this.video.pause();
  };

  renderAnimationFrame = time => {
    this.render();

    this.capturer.capture(this.canvas);

    if (this.isCapturing) {
      this.captureProgress++;
      console.log(
        'CAPTURING WITH PROGRESS ',
        this.captureProgress,
        ' OF ',
        this.framerate,
        '*',
        this.duration,
      );
      if (this.captureProgress > this.framerate * this.duration) {
        this.capturer.stop();
        this.isCapturing = false;
        this.videoUploader.upload();
      }
    }

    if (this.video.currentTime >= this.endTime) {
      this.restartVideo();
    }

    // preview at a lower framerate than 60fps
    // frame every 40 ms => 25 fps
    if (this.isPlaying) {
      if (this.isCapturing) {
        window.requestAnimationFrame(this.renderAnimationFrame);
      } else {
        const time = this.isSeeking ? 60 : 40;
        setTimeout(() => {
          this.renderAnimationFrame();
        }, time);
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
