import vertexShader from '../shaders/previewVertexShader';
import imageFragShader from '../shaders/imageFragShader';
import fs from 'fs';
import getShader from './getShader';
import loadProgram from './loadProgram';
import createImageGrid from './createImageGrid';
import TarToMp4 from './tarToMp4';

class Preview {
  constructor(
    imagePath,
    anchors,
    vectors,
    boundingRect,
    animationParams,
    duration,
    exportCallback,
  ) {
    this.imagePath = imagePath;
    this.anchors = anchors;
    this.vectors = vectors;
    this.boundingRect = boundingRect;
    this.animationParams = animationParams;
    this.duration = duration;
    this.exportCallback = exportCallback;

    this.gl;
    this.texCoordLocation; // Location of the texture for the picture fragment shader.
    this.texCoordLocation2; // Location of the texture for the line fragment shader.

    this.texCoordBuffer; // The buffer for the texture for the picture fragment shader.
    this.texCoordBuffer2; // The buffer for the texture for the line fragment shader.

    this.tween = 0.0;
    this.numVectors = vectors.length + 1;
    this.numAnchors = anchors.length + 1;
    this.resolution = 50; // Resolution of the mesh.

    this.canvas = document.getElementById('webglcanvas');
    this.gl = this.canvas.getContext('webgl');
    this.stopped = false;

    //state
    this.isCapturing = false;
    this.captureProgress = 0;
    this.framerate = 25;
    this.previewRate = 60;
    this.isPlaying = false;

    // video capturing
    let CCapture;
    if (window) {
      CCapture = require('zcapture.js');
    }

    this.capturer = new CCapture({
      format: 'jpg',
      verbose: true,
      framerate: 25,
      display: false,
      quality: 99,
    });

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
      let vertexshader = getShader(
        gl,
        vertexShader(
          this.animationParams.dragDistance.toFixed(5).toString(),
          this.animationParams.anchorImpact.toFixed(5).toString(),
          this.animationParams.impactDivisor.toFixed(5).toString(),
          this.numVectors.toString(),
          this.numAnchors.toString(),
        ),
        'vertex',
      );
      let fragmentshader = getShader(gl, imageFragShader, 'frag');

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

    // normalize vectors and anchors
    let i,
      anchor = {},
      normalizedVectors = [],
      normalizedAnchors = [];

    for (i in this.vectors) {
      let vector = {};
      vector.point1 = this.normalizedPoint(
        this.vectors[i][0].x,
        this.vectors[i][0].y,
        this.boundingRect.width,
        this.boundingRect.height,
      );

      vector.point2 = this.normalizedPoint(
        this.vectors[i][1].x,
        this.vectors[i][1].y,
        this.boundingRect.width,
        this.boundingRect.height,
      );

      normalizedVectors.unshift(vector);
    }

    for (i in this.anchors) {
      anchor = this.normalizedPoint(
        this.anchors[i].x,
        this.anchors[i].y,
        this.boundingRect.width,
        this.boundingRect.height,
      );

      // texture space goes from 0 - 1 not -1 - 1
      anchor.x = (anchor.x + 1.0) / 2.0;
      anchor.y = (anchor.y + 1.0) / 2.0;

      normalizedAnchors.unshift(anchor);
    }

    this.vectors = normalizedVectors;
    this.anchors = normalizedAnchors;

    this.setImage(this.imagePath, () => {
      this.start();
    });
  };

  update = (anchors, vectors, duration) => {
    this.anchors = anchors;
    this.vectors = vectors;
    this.duration = duration;
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
    // do nothing if there are no vectors
    if (!this.vectors[0].point1) {
      return;
    }

    var gl = this.gl;
    const resolution = this.resolution;

    // Create two arrays to hold start and end point uniforms
    var p1 = new Float32Array(this.numVectors * 2); //x and y
    var p2 = new Float32Array(this.numVectors * 2); //x and y

    var index = 0;

    for (var i = 0; i < this.numVectors; i++) {
      // Working values
      var x1, y1, x2, y2;
      if (this.vectors[i]) {
        x1 = this.vectors[i].point1.x;
        y1 = this.vectors[i].point1.y;
        x2 = this.vectors[i].point2.x;
        y2 = this.vectors[i].point2.y;
      } else {
        x1 = 1;
        y1 = 1;
        x2 = 0.9999999;
        y2 = 0.9999999;
      }

      p1[index] = x1;
      p1[index + 1] = y1;
      p2[index] = x2;
      p2[index + 1] = y2;
      index += 2;
    }

    var a = new Float32Array(this.numAnchors * 2);

    var index = 0;
    for (var i = 0; i < this.numAnchors; i++) {
      // Working values
      var x, y;

      if (this.anchors[i]) {
        x = this.anchors[i].x;
        y = this.anchors[i].y;
      } else {
        x = 1.0;
        y = 1.0;
      }

      a[index] = x;
      a[index + 1] = y;
      index += 2;
    }

    //  Clear color buffer and set it to light gray
    gl.clearColor(1.0, 1.0, 1.0, 0.5);
    gl.clear(this.gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);

    gl.useProgram(this.pictureprogram);

    gl.uniform2fv(gl.getUniformLocation(this.pictureprogram, 'p1'), p1);
    gl.uniform2fv(gl.getUniformLocation(this.pictureprogram, 'p2'), p2);
    gl.uniform2fv(gl.getUniformLocation(this.pictureprogram, 'anchors'), a);
    gl.uniform1f(
      gl.getUniformLocation(this.pictureprogram, 'tween0'),
      this.tween,
    );
    gl.uniform1f(
      gl.getUniformLocation(this.pictureprogram, 'tween1'),
      this.tween,
    );

    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(this.texCoordLocation);

    gl.drawArrays(gl.TRIANGLES, 0, resolution * resolution * 2 * 3);
  };

  start = () => {
    this.isPlaying = true;
    window.requestAnimationFrame(this.renderAnimationFrame);
  };

  stop = () => {
    this.isPlaying = false;
  };

  renderAnimationFrame = time => {
    const framerate = this.isCapturing ? this.framerate : this.previewRate;

    this.tween += 1.0 / (framerate * this.duration);

    if (this.tween > 1.0) {
      this.tween = 0.0;
    }

    this.render();

    if (!this.stopped) {
      this.capturer.capture(this.canvas);
    }

    if (this.isCapturing) {
      this.captureProgress++;
      if (this.captureProgress > framerate * this.duration) {
        this.isCapturing = false;
        this.stopped = true;
        this.capturer.stop();
        this.capturer.save(blob => {
          let ttMp4 = new TarToMp4(blob);

          // export mp4 to temporary storage (for now)
          ttMp4.export('./renderer/static/temp/', this.exportCallback);
          this.stopped = false;
        });
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

  setImage = (imagePath, callback) => {
    imagePath = imagePath.split('file://')[1];

    var bitmap = fs.readFileSync(imagePath);
    const base64str = `data:image/jpeg;base64,${new Buffer(bitmap).toString(
      'base64',
    )}`;

    var image = new Image();

    image.onload = () => {
      this.loadImage(image);
      callback();
    };

    image.src = base64str;
  };

  // This function does the heavy lifting of creating the texture from the image.
  loadImage = image => {
    var canvas = document.getElementById('2dcanvas');
    var ctx = canvas.getContext('2d');
    var canvHeight = document.getElementById('2dcanvas').height;
    var canvWidth = document.getElementById('2dcanvas').width;

    var x = 0;
    var y = 0;
    var xx = canvWidth;
    var yy = canvHeight;

    ctx.clearRect(0, 0, canvWidth, canvHeight);

    // Put the image on the canvas, scaled using xx & yy.
    ctx.drawImage(image, 0, 0, image.width, image.height, x, y, xx, yy);
    var gl = this.gl;

    // Create a texture object that will contain the image.
    var texture = gl.createTexture();

    // Bind the texture the target (TEXTURE_2D) of the active texture unit.
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Flip the image's Y axis to match the WebGL texture coordinate space.
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    //    Note: a canvas is used here but can be replaced by an image object.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    ctx.clearRect(0, 0, canvWidth, canvHeight);
  };
}

export default Preview;
