var gl;

var InitDemo = function () {
	loadTextResource('/InNatureOpenGL/shader.vs.glsl', function (vsErr, vsText) {
		if (vsErr) {
			alert('Fatal error getting vertex shader (see console)');
			console.error(vsErr);
			console.log("hi");
		} else {
			loadTextResource('/shader.fs.glsl', function (fsErr, fsText) {
				if (fsErr) {
					alert('Fatal error getting fragment shader (see console)');
					console.error(fsErr);
				} else {
					loadJSONResource('/amos.json', function (modelErr, modelObj) {
						if (modelErr) {
							alert('Fatal error getting Amos model (see console)');
							console.error(fsErr);
						} else {
							loadImage('/grey.png', function (imgErr, img) {
								if (imgErr) {
									alert('Fatal error getting amos texture (see console)');
									console.error(imgErr);
								} else {
									RunDemo(vsText, fsText, img, modelObj);
								}
							});
						}
					});
				}
			});
		}
	});
};

var RunDemo = function (vertexShaderText, fragmentShaderText, AmosImage, AmosModel) {
  console.log('This is working');

  var canvas = document.getElementById('myCanvas');
  var gl = canvas.getContext('webgl');
  if (!gl){
    console.log('WebGl not supported without experimental');
    gl = canvas.getContext('experimental-webgl');
  }
  if (!gl){
    alert('Your browser does not support WebGL');
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.frontFace(gl.CCW);
  gl.cullFace(gl.BACK);

  //CREATE SHADERS
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
    console.error('ERROR COMPILING VERTEX SHADER',gl.getShaderInfoLog(vertexShader));
    return;
  }
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    console.error('ERROR COMPILING FRAGMENT SHADER',gl.getShaderInfoLog(fragmentShader));
    return;
  }

  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error('ERROR LINKING PROGRAM', gl.getProgramInfoLog(program));
    return;
  }

  //ONLY FOR TESTING
  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
    console.error('ERROR VALIDATING PROGRAM',gl.getProgramInfoLog(program));
    return;
  }

  //CREATE BUFFER
	var amosVertices = AmosModel.meshes[0].vertices;
	var amosIndices = [].concat.apply([], AmosModel.meshes[0].faces);
	var amosTexCoords = AmosModel.meshes[0].texturecoords[0];

	var amosPosVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, amosPosVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(amosVertices), gl.STATIC_DRAW);

	var amosTexCoordVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, amosTexCoordVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(amosTexCoords), gl.STATIC_DRAW);

	var amosIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, amosIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(amosIndices), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, amosPosVertexBufferObject);
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	gl.vertexAttribPointer(
		positionAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.enableVertexAttribArray(positionAttribLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, amosTexCoordVertexBufferObject);
	var texCoordAttribLocation = gl.getAttribLocation(program, 'vertTexCoord');
	gl.vertexAttribPointer(
		texCoordAttribLocation, // Attribute location
		2, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		2 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		0
	);
	gl.enableVertexAttribArray(texCoordAttribLocation);

  var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  //Create texture
  var boxTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, boxTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texImage2D(
		gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
		gl.UNSIGNED_BYTE,
		AmosImage
	);
	gl.bindTexture(gl.TEXTURE_2D, null);

  //tell openGL state machine which prog should be active
  gl.useProgram(program);


  //set vals of ^
  var worldMatrix = new Float32Array(16);
  var viewMatrix = new Float32Array(16);
  var projMatrix = new Float32Array(16);
  glMatrix.mat4.identity(worldMatrix);
  glMatrix.mat4.lookAt(viewMatrix, [0,0,-300], [0,0,0],[0,1,0]);
  glMatrix.mat4.perspective(projMatrix, glMatrix.glMatrix.toRadian(45), canvas.width/canvas.height, 0.1, 1000.0);

  //send to shader
  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  var xRotationMatrix = new Float32Array(16);
  var yRotationMatrix = new Float32Array(16);


	//MOUSE EVENTS
	 var AMORTIZATION = 0.95;
	 var drag = false;
	 var old_x, old_y;
	 var dX = 0, dY = 0;

	 var mouseDown = function(e) {
		 drag = true;
	    old_x = e.pageX, old_y = e.pageY;
	    e.preventDefault();
	    return false;
	 };

	 var mouseUp = function(e){
	    drag = false;
	 };

	 var mouseMove = function(e) {
	    if (!drag) return false;
	    dX = (e.pageX-old_x)*2*Math.PI/canvas.width,
	    dY = (e.pageY-old_y)*2*Math.PI/canvas.height;
	    THETA+= dX;
	    PHI+=dY;
	    old_x = e.pageX, old_y = e.pageY;
	    e.preventDefault();
	 };

	 canvas.addEventListener("mousedown", mouseDown, false);
	 canvas.addEventListener("mouseup", mouseUp, false);
	 canvas.addEventListener("mouseout", mouseUp, false);
	 canvas.addEventListener("mousemove", mouseMove, false);


  //MAIN RENDER LOOP
	var THETA = Math.PI, PHI = -1*Math.PI/2;
  var time_old = 0;

  var identityMatrix = new Float32Array(16);
  glMatrix.mat4.identity(identityMatrix);
  var angle = 0;
  var loop = function () {
    angle = performance.now() /1000/6*2*Math.PI;

		if (!drag) {
    	dX *= AMORTIZATION, dY*=AMORTIZATION;
      THETA+=dX, PHI+=dY;
    }


    glMatrix.mat4.rotate(yRotationMatrix, identityMatrix, THETA, [0,1,0]);
    glMatrix.mat4.rotate(xRotationMatrix, identityMatrix, -1*PHI, [1,0,0]); //angle/4 for slower
    glMatrix.mat4.mul(worldMatrix, xRotationMatrix, yRotationMatrix);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.180, 0.214, 0.180, 0.3);
    gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);

    gl.bindTexture(gl.TEXTURE_2D, boxTexture);
		gl.activeTexture(gl.TEXTURE0);

    gl.drawElements(gl.TRIANGLES, amosIndices.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);



};
