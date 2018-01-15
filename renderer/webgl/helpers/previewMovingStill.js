import vertexShader from "../shaders/previewVertexShader";
import imageFragShader from "../shaders/imageFragShader";
import TWEEN from "@tweenjs/tween.js";
import fs from "fs";

("use strict");

// Point object - converts incoming values to a -1 to 1 range).
function Point(x, y) {
  if (x < -1) x = -1;
  if (y < -1) y = -1;
  if (x > 1) x = 1;
  if (y > 1) y = 1;

  this.x = x;
  this.y = y;
}

// A new mouse manipulation.
function Move(point) {
  this.point1 = new Point(point.x, point.y);
  this.point2 = new Point(point.x, point.y);

  this.move = function(point) {
    this.point2.x = point.x;
    this.point2.y = point.y;
  };
}

var renderer = new function() {
  var gl; // Handle to the context.
  var lineprogram; // Handle to GLSL program that draws lines.
  var pictureprogram; // Handle to GLSL program that draws a picture.

  this.texCoordLocation; // Location of the texture for the picture fragment shader.
  this.texCoordLocation2; // Location of the texture for the line fragment shader.

  this.texCoordBuffer; // The buffer for the texture for the picture fragment shader.
  this.texCoordBuffer2; // The buffer for the texture for the line fragment shader.
  this.tween = { val: 0.0 };

  var anchors = new Array();
  var moves = new Array();
  var tMove = {};
  var MAXMOVES = 30;
  var currentMove = 0;

  var resolution = 20; // Resolution of the mesh.

  this.init = function() {
    // Get a context from our canvas object with id = "webglcanvas".
    var canvas = document.getElementById("webglcanvas");
    var gl = (this.gl = canvas.getContext("webgl"));

    try {
      var vertexshader = getShader(gl, vertexShader, "vertex");
      var fragmentshader = getShader(gl, imageFragShader, "frag");

      this.pictureprogram = loadProgram(gl, vertexshader, fragmentshader);
      gl.useProgram(this.pictureprogram);

      // Look up where the vertex data needs to go.
      this.texCoordLocation = gl.getAttribLocation(
        this.pictureprogram,
        "a_texCoord"
      );

      // Provide texture coordinates for the rectangle.
      this.texCoordBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);

      // createImageGrid sets up the vector array itself
      gl.bufferData(gl.ARRAY_BUFFER, createImageGrid(), gl.STATIC_DRAW); // Fill buffer data
      gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(this.texCoordLocation);
      // Set up uniforms variables (image).
      this.pictureprogram.u_image = gl.getUniformLocation(
        this.pictureprogram,
        "u_image"
      );

      // Set the texture to use.
      gl.uniform1i(this.pictureprogram.u_image, 0);
    } catch (e) {
      console.log("ERROR MAKING SHADERS: ", e);
      return;
    }
  };

  // Load a default image.
  this.loadImage = function() {
    var image = new Image();
    image.onload = function() {
      renderer.loadImage2(image);
    };
  };
  // load a the user's image.
  this.loadImageX = function(dataURL) {
    var image = new Image();

    image.onload = function() {
      renderer.loadImage2(image);
    };

    image.src = dataURL;
  };

  // This function does the heavy lifting of creating the texture from the image.
  this.loadImage2 = function(image) {
    // Convert the image to a square image via the temporary 2d canvas.
    var canvas = document.getElementById("2dcanvas");
    var ctx = canvas.getContext("2d");
    var canvHeight = document.getElementById("2dcanvas").height;

    var x = 0;
    var y = 0;
    var xx = canvHeight;
    var yy = canvHeight;

    ctx.clearRect(0, 0, canvHeight, canvHeight);
    // If image isn't square, adjust width, height, and origin so it's centered.
    if (image.width < image.height) {
      // Change origin and dimensions if the image isn't square.
      // Change x, xx
      xx = image.width / image.height * canvHeight;
      x = (canvHeight - xx) / 2;
    }
    if (image.width > image.height) {
      // Change y, yy
      yy = image.height / image.width * canvHeight;
      y = (canvHeight - yy) / 2;
    }

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

    // Upload the resized canvas image into the texture.
    //    Note: a canvas is used here but can be replaced by an image object.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
    ctx.clearRect(0, 0, canvHeight, canvHeight);
  };

  this.render = function() {
    var gl = this.gl;

    // Create two arrays to hold start and end point uniforms
    var p1 = new Float32Array(MAXMOVES * 2); //x and y
    var p2 = new Float32Array(MAXMOVES * 2); //x and y

    // Set up the arrays of points
    {
      var index = 0;
      for (var i = 0; i < MAXMOVES; i++) {
        // Working values
        var x1, y1, x2, y2;

        if (moves[i]) {
          x1 = moves[i].point1.x;
          y1 = moves[i].point1.y;
          x2 = moves[i].point2.x;
          y2 = moves[i].point2.y;
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
    }

    var a = new Float32Array(MAXMOVES);
    // Set up the anchor points
    {
      var index = 0;
      for (var i = 0; i < MAXMOVES; i++) {
        // Working values
        var x, y;

        if (anchors[i]) {
          x = anchors[i].x;
          y = anchors[i].y;
        } else {
          x = 1.0;
          y = 1.0;
        }

        a[index] = x;
        a[index + 1] = y;
        index += 2;
      }
    }

    //  Clear color buffer and set it to light gray
    gl.clearColor(1.0, 1.0, 1.0, 0.5);
    gl.clear(this.gl.COLOR_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);

    gl.useProgram(this.pictureprogram);

    gl.uniform2fv(gl.getUniformLocation(this.pictureprogram, "p1"), p1);
    gl.uniform2fv(gl.getUniformLocation(this.pictureprogram, "p2"), p2);
    gl.uniform2fv(
      gl.getUniformLocation(this.pictureprogram, "anchors"),
      a
    );
    gl.uniform1f(
      gl.getUniformLocation(this.pictureprogram, "tween0"),
      this.tween.val
    );
    gl.uniform1f(
      gl.getUniformLocation(this.pictureprogram, "tween1"),
      this.tween.val
    );

    gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(this.texCoordLocation);

    gl.drawArrays(gl.TRIANGLES, 0, resolution * resolution * 2 * 3);
  };

  this.newMove = function(
    point // Where the warp starts (-1 to 1 range)
  ) {
    var move = new Move(point);
    // Adds move to beginning of moves array (pushes onto array)
    moves.unshift(move);

    return move;
  };

  this.newAnchor = function(
    point
  ) {
    point.x = (point.x + 1.0) / 2.0;
    point.y = (point.y + 1.0) / 2.0;

    anchors.unshift(point);
    return point;
  }

  function createImageGrid() {
    var q = 0.000000001;

    var r = (1 - q * 2) / resolution;
    var c = new Float32Array(resolution * resolution * 12); //2 numbers per coord; three coords per triangle; 2 triagles per square; resolution * resolution squares.

    var i = 0;

    for (var xs = 0; xs < resolution; xs++) {
      for (var ys = 0; ys < resolution; ys++) {
        var x = r * xs + q;
        var y = r * ys + q;

        c[i++] = x;
        c[i++] = y;

        c[i++] = x + r;
        c[i++] = y;

        c[i++] = x;
        c[i++] = y + r;

        c[i++] = x + r;
        c[i++] = y;

        c[i++] = x;
        c[i++] = y + r;

        c[i++] = x + r;
        c[i++] = y + r;
      }
    }
    return c;
  }
}();

// Program starts here
function main(imagePath, anchors, vectors, boundingRect) {
  renderer.init(); // Initialize WebGL shapes and image
  setImage(imagePath);
  setTimeout(() => {
    let i, move;
    for (i in vectors) {
      move = renderer.newMove(
        normalizedPoint(
          vectors[i][0].x,
          vectors[i][0].y,
          boundingRect.width,
          boundingRect.height
        )
      );
      move.point2 = normalizedPoint(
        vectors[i][1].x,
        vectors[i][1].y,
        boundingRect.width,
        boundingRect.height
      );
    }

    for (i in anchors) {
      renderer.newAnchor(
        normalizedPoint(
          anchors[i].x,
          anchors[i].y,
          boundingRect.width,
          boundingRect.height,
        )
      );
    }

    startPreview();
  }, 100);
}

const startPreview = () => {
  renderer.tween = { val: 0.0 };
  let tween = new TWEEN.Tween(renderer.tween)
    .to({ val: 1.0 }, 3000)
    .repeat(101)
    .start();
  window.requestAnimationFrame(renderAnimationFrame);
};

const renderAnimationFrame = time => {
  TWEEN.update(time);
  renderer.render();
  window.requestAnimationFrame(renderAnimationFrame);
};

function normalizedPoint(x, y, width, height) {
  x = x / width * 2 - 1;
  y = (1 - y / height) * 2 - 1;

  return new Point(x, y);
}

function setVec2(id, a, b) {
  gl.uniform2f(gl.getUniformLocation(program, id), a, b);
}

// Loads a shader from a script tag
// Parameters:
//   WebGL context
//   id of script element containing the shader to load
function getShader(gl, str, type) {
  var shader;

  // Create shaders based on the type we set
  //   note: these types are commonly used, but not required
  if (type == "frag") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (type == "vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  // Check the compile status, return an error if failed
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log("SHADER FAILED TO COMPILE: ", gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}

function loadProgram(gl, vertexShader, fragmentShader) {
  // create a progam object
  var program = gl.createProgram();

  // attach the two shaders
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  // link everything
  gl.linkProgram(program);

  // Check the link status
  var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linked) {
    // An error occurred while linking
    var lastError = gl.getProgramInfoLog(program);
    console.warn("Error in program linking:" + lastError);

    gl.deleteProgram(program);
    return null;
  }

  // if all is well, return the program object
  return program;
}

function setImage(imagePath) {
  imagePath = imagePath.split("file://")[1];

  var bitmap = fs.readFileSync(imagePath);
  const base64str = `data:image/jpeg;base64,${new Buffer(bitmap).toString(
    "base64"
  )}`;

  renderer.loadImageX(base64str);
}

export default main;
