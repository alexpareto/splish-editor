
'use strict';

// Point object - converts incoming values to a -1 to 1 range).
function Point(x, y) {
  if (x<-1) x = -1;
  if (y<-1) y = -1;
  if (x>1) x = 1;
  if (y>1) y = 1;
  
  this.x = x;
  this.y = y;
}

// A new mouse manipulation.
function Move(point) { 
  this.point1 = new Point(point.x, point.y);
  this.point2 = new Point(point.x, point.y);
  
  this.move = function (point) {
    this.point2.x = point.x;
    this.point2.y = point.y;
  }
}

var renderer = new function () {

    var gl;                 // Handle to the context.
    var lineprogram;        // Handle to GLSL program that draws lines.
    var pictureprogram;     // Handle to GLSL program that draws a picture.

    this.texCoordLocation;   // Location of the texture for the picture fragment shader.
    this.texCoordLocation2;  // Location of the texture for the line fragment shader.

    this.texCoordBuffer;   // The buffer for the texture for the picture fragment shader.
    this.texCoordBuffer2;   // The buffer for the texture for the line fragment shader.
    
    var moves = new Array;  
    var MAXMOVES = 30;
    var currentMove = 0;

    var resolution = 20;  // Resolution of the mesh.


    // First init called by main().
    // Initialize the gl context variable.

    this.init = function () {
      // Get a context from our canvas object with id = "webglcanvas".
      var canvas = document.getElementById("webglcanvas"); 
        try {
          // Get the context into a local gl and and a public gl.
          // Use preserveDrawingBuffer:true to keep the drawing buffer after presentation
          var gl = this.gl = canvas.getContext("webgl");
        }
          catch (e) {
          // Fail quietly 
        }

        try {
        // Load the GLSL source written in the HTML file.
        // Create a program with the two shaders
        this.lineprogram = loadProgram(gl, getShader(gl, "2d-vertex-shader"), getShader(gl, "red"));

          // Tell webGL to use this program
        gl.useProgram(this.lineprogram);

          // Look up where the vertex data needs to go.
        this.texCoordLocation2 = gl.getAttribLocation(this.lineprogram, "a_texCoord");

          // Provide texture coordinates for the rectangle.
        this.texCoordBuffer2 = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer2);
      
        // Create a buffer and set it use the array set up above.
        // Set it to be modified once, use many.
        // createRedGrid sets up the vector array itself.        
        gl.bufferData(gl.ARRAY_BUFFER, createRedGrid(), gl.STATIC_DRAW); // Fill buffer data

        // Turns on the vertex attributes in the GPU program. 
        gl.enableVertexAttribArray(this.texCoordLocation2);

        // Set up the data format for the vertex array - set to points (x/y). 
        // Use floats.
        gl.vertexAttribPointer(this.texCoordLocation2, 2, gl.FLOAT, false, 0, 0);
        }

        catch (e) {
            // Display the fail on the screen if the shaders/program fail.
            return;
        }

        try {
          var vertexshader = getShader(gl, "2d-vertex-shader");
          var fragmentshader = getShader(gl, "2d-fragment-shader");
        
          this.pictureprogram = loadProgram(gl, vertexshader, fragmentshader);
          gl.useProgram(this.pictureprogram);

          // Look up where the vertex data needs to go.
          this.texCoordLocation = gl.getAttribLocation(this.pictureprogram, "a_texCoord");

          // Provide texture coordinates for the rectangle.
          this.texCoordBuffer = gl.createBuffer();
          gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);

          // createImageGrid sets up the vector array itself
          gl.bufferData(gl.ARRAY_BUFFER, createImageGrid(), gl.STATIC_DRAW);  // Fill buffer data             
          gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);
          gl.enableVertexAttribArray(this.texCoordLocation);
          // Set up uniforms variables (image).
          this.pictureprogram.u_image = gl.getUniformLocation(this.pictureprogram, "u_image");

          // Set the texture to use.
          gl.uniform1i(this.pictureprogram.u_image, 0);
        }
        catch (e) {
            return;
        }
             
        this.loadImage();
    }

    // Load a default image.
    this.loadImage = function () {
    var image = new Image();
        image.onload = function () {
        renderer.loadImage2(image);
      }
    }
// load a the user's image.
    this.loadImageX = function (dataURL) {
        var image = new Image();
        
        image.onload = function () {
            renderer.loadImage2(image);
        }

        image.src = dataURL;
    }

    // This function does the heavy lifting of creating the texture from the image.
    this.loadImage2 = function (image) {
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

    this.reset();

    }
  // This code checks the Show uniform points checkbox and changes the mode and initializes the canvas.
    this.modeOff = 0;
    this.modeHint = 1;
    this.modeHint2 = 2;
    this.modeUniform = 3;

  //  Modes tell the app to show uniforms or not
    this.canvasMode = this.modeHint;

    this.changeMode = function () {
        if (document.getElementById("showUniforms").checked) {
            this.canvasMode = this.modeUniform;
        }
        else {
            this.canvasMode = this.modeOff;
            var canvas = document.getElementById("2dcanvas");
            var ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }

    }

    this.render = function () {
   
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
            }
            else {
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
        
    //  Clear color buffer and set it to light gray
        gl.clearColor(1.0, 1.0, 1.0, 0.5);
        gl.clear(this.gl.COLOR_BUFFER_BIT);
                
    // This draws either the grid or the photo for stretching
        if (document.getElementById("renderLines").checked)
        {
          gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer2);

          gl.useProgram(this.lineprogram);

          gl.uniform2fv(gl.getUniformLocation(this.lineprogram, "p1"), p1);
          gl.uniform2fv(gl.getUniformLocation(this.lineprogram, "p2"), p2);

          gl.vertexAttribPointer(this.texCoordLocation2, 2, gl.FLOAT, false, 0, 0);

          gl.enableVertexAttribArray(this.texCoordLocation2);

          gl.drawArrays(gl.LINES, 0, resolution * resolution * 10);
        }
        else
        { 
          gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
          
          gl.useProgram(this.pictureprogram);


          gl.uniform2fv(gl.getUniformLocation(this.pictureprogram, "p1"), p1);
          gl.uniform2fv(gl.getUniformLocation(this.pictureprogram, "p2"), p2);

          gl.vertexAttribPointer(this.texCoordLocation, 2, gl.FLOAT, false, 0, 0);

          gl.enableVertexAttribArray(this.texCoordLocation);


          gl.drawArrays(gl.TRIANGLES, 0, resolution * resolution * 2 * 3);
        }
    // Draw uniform points 
        if (this.canvasMode == this.modeUniform) {
        var canvas = document.getElementById("2dcanvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);

          for (var i = 0; i < MAXMOVES; i++) {
            if (moves[i]) {
              var x1 = (moves[i].point1.x + 1) * canvas.width / 2;
              var y1 = (-moves[i].point1.y + 1) * canvas.height / 2;
              var x2 = (moves[i].point2.x + 1) * canvas.width / 2;
              var y2 = (-moves[i].point2.y + 1) * canvas.height / 2;

          // The raio is used here to show where the pixel started and ended
              var ratio = 0.3;
              x2 = x1 + (x2 - x1) * ratio;
              y2 = y1 + (y2 - y1) * ratio;

              var radius = 6;            
              ctx.beginPath();  // Start a fresh path 

          // Create a 2D gradient 
              var grd = ctx.createLinearGradient(x1, y1, x2, y2);
              grd.addColorStop(0, 'pink'); // Set one side to pink
              grd.addColorStop(1, 'red');  // The other side to red

              ctx.setLineDash([5, 5]);  // Use a dotted line
              ctx.lineWidth = radius / 2; 
              ctx.moveTo(x1, y1); // Create a line from start to end poing
              ctx.lineTo(x2, y2);
              ctx.strokeStyle = grd;
              ctx.stroke();

              ctx.beginPath(); // Start a new path for pink dot
              ctx.arc(x1, y1, radius, 0, 2 * Math.PI, false); // full circle (2*pi)
              ctx.fillStyle = 'pink';
              ctx.fill();

              ctx.beginPath(); // Start a new path for red dot
              ctx.arc(x2, y2, radius, 0, 2 * Math.PI, false);
              ctx.fillStyle = 'red';
              ctx.fill();
            }
          }
        }
    }
    // (point) is where the mouse was clicked
    this.newMove = function(point) // Where the warp starts (-1 to 1 range)
    {
      var move = new Move(point);
      // Adds move to beginning of moves array (pushes onto array)
      moves.unshift(move);

      return move;
    }
    this.reset = function () {
      moves = [];
      this.render();
    }

    this.undo = function () {
      // Removes the first element in moves array (pops off array)
      moves.shift();
      this.render();
    }
    this.save = function () {
    // First create a dataURL string from the canvas in jpeg format.
      var dataURL = document.getElementById("webglcanvas").toDataURL("image/png");

      // Split the dataURL and decode it from ASCII to base-64 binary.
      var binArray = atob(dataURL.split(',')[1]);

      // Create an 8-bit unsigned array
      var array = [];
    // Add the unicode numeric value of each element to the new array.
      for (var i = 0; i < binArray.length; i++) {
        array.push(binArray.charCodeAt(i));
      }

      var blobObject = new Blob([new Uint8Array(array)], { type: 'image/png' }); 

      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blobObject, 'warpedphoto.png');
      }else if (window.navigator.saveBlob) {
        window.navigator.saveBlob(blobObject, 'warpedphoto.png');
      }
      else {
        dataURL = dataURL.replace("image/png", "image/octet-stream");
        window.location.href = dataURL;
        // alert("Sorry, your browser does not support navigator.saveBlob");
      }
  }


    // Grid making section 
    function createRedGrid() {
    // Make a 0,0 to 1,1 triangle mesh, using n = resolution steps.
    var q = 0.001; // A fudge factor to ensure that the wireframe lines are rendered inside the canvas boundary.
    var r = (1 - q * 2) / resolution;
    //2 numbers per coord; three coords per triangle; 2 triagles per square; resolution * resolution squares.
    var c = new Float32Array(resolution * resolution * 20);
    // Array index.
    var i = 0;
    
    // Build the mesh top to bottom, left to right.             
    for (var xs = 0; xs < resolution; xs++) {
      for (var ys = 0; ys < resolution; ys++) {
        var x = r * xs + q;
        var y = r * ys + q;
        // Top of square - first triangle.
        c[i++] = x;
        c[i++] = y;
        c[i++] = x + r;
        c[i++] = y;

        // Center line - hypotonose of triangles.
        c[i++] = x;
        c[i++] = y + r;
        c[i++] = x + r;
        c[i++] = y;

        // Bottom line of 2nd triangle.
        c[i++] = x;
        c[i++] = y + r;
        c[i++] = x + r;
        c[i++] = y + r;

        // First triangle, left side.
        c[i++] = x;
        c[i++] = y;
        c[i++] = x;
        c[i++] = y + r;

        // Right side of 2nd triangle. 
        c[i++] = x + r;
        c[i++] = y;
        c[i++] = x + r;
        c[i++] = y + r;
      }
    }
    return c;
    }
    function createImageGrid() {
      var q = 0.001;

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
}

// Program starts here
function main(imagePath, anchors, vectors, boundingBox) {
  renderer.init();  // Initialize WebGL shapes and image      
}

// Resets the current distortion to 0
function reset(point) {
  point1[currentPoint].x = 1;
  point1[currentPoint].y = 1;
  point2[currentPoint].x = 1.00001;
  point2[currentPoint].y = 1.00001;
  
  setVec2PointArray("p1", point1);
  setVec2PointArray("p2", point2);
}

function undo() {
  renderer.undo();
}

function reset() {
  renderer.reset();
}


function save() {
  renderer.save();
}

function normalizedPoint(x, y) 
{
  // converts screen coordinates to -1 to 1
  var canvas = document.getElementById("2dcanvas");
  x = (x / canvas.width) * 2 - 1;
  y = (1 - (y / canvas.height)) * 2 - 1;
  
  return new Point(x, y);
}


function setVec2(id, a, b) {
  gl.uniform2f(gl.getUniformLocation(program, id), a, b);
}

// Loads a shader from a script tag
// Parameters:
//   WebGL context
//   id of script element containing the shader to load
function getShader(gl, id) {
  var shaderScript = document.getElementById(id);

  // error - element with supplied id couldn't be retrieved
  if (!shaderScript) {
    return null;
  }

  // If successful, build a string representing the shader source
  var str = "";
  var k = shaderScript.firstChild;
  while (k) {
    if (k.nodeType == 3) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }

  var shader;

  // Create shaders based on the type we set
  //   note: these types are commonly used, but not required
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
    return null;
  }

  gl.shaderSource(shader, str);
  gl.compileShader(shader);

  // Check the compile status, return an error if failed
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(shader));
    return null;
  }

  return shader;
}


function loadProgram(gl, vertexShader, fragmentShader)
{
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
};

function handleFileSelect(evt) {
  
  var files = evt.target.files; // FileList object
  
  // files is a FileList of File objects. List some properties.
  var file = files[0];
  
  var reader = new FileReader();
  
  // Closure to capture the file information.
  reader.onload = function (e) {
      renderer.loadImageX(this.result);
  };
  
  // Read in the image file as a data URL.
  
  reader.readAsDataURL(file);
}

export default main;

