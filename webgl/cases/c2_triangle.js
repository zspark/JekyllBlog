CASE.Case2=function (){
	CASE.CaseBase.call(this);

	var gl=this.ctx;

	this.createGUI();
	this.initWebGLStatus();
	this.initShaders( VSHADER_SOURCE, FSHADER_SOURCE);   // Initialize shaders

	this.pc = new Float32Array([ 
			// Vertex coordinates and color
			0.0,  0.5,  -0.1,  0.0,  0.0,  1.0,  
			-0.5, -0.5,  -0.1,  0.0,  1.0,  0.0,
			0.5, -0.5,  -0.1,  0.0,  0.0,  1.0, 
			]);

	this.pcbuffer = gl.createBuffer();  
	gl.bindBuffer(gl.ARRAY_BUFFER, this.pcbuffer);

	var numVertex = 3; var numColor = 3; 
	var FSIZE = this.pc.BYTES_PER_ELEMENT;   // The number of byte
	var STRIDE = numVertex + numColor;// Stride
	this.a_Position = gl.getAttribLocation(gl.program, 'a_Position');
	gl.vertexAttribPointer(this.a_Position, numVertex, gl.FLOAT, false, FSIZE * STRIDE, 0);
	gl.enableVertexAttribArray(this.a_Position);

	// Assign the vertex colors to attribute variable and enable the assignment
	this.a_Color = gl.getAttribLocation(gl.program, 'a_Color');
	gl.vertexAttribPointer(this.a_Color, numColor, gl.FLOAT, false, FSIZE * STRIDE, FSIZE * numVertex);
	gl.enableVertexAttribArray(this.a_Color);


	this.start();
}

CASE.Case2.prototype=Object.create(CASE.CaseBase.prototype);
CASE.Case2.prototype.constructor=CASE.Case2;
CASE.Case2.prototype.destroy=function(){
	setDefaultGLContext();
	CASE.CaseBase.prototype.destroy.call(this);
}

CASE.Case2.prototype.update=function(){
	this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);      // Clear <canvas>
	this.pc[3]=this.ctrlData.topColor[0]/255;
	this.pc[4]=this.ctrlData.topColor[1]/255;
	this.pc[5]=this.ctrlData.topColor[2]/255;
	this.pc[9]=this.ctrlData.leftColor[0]/255;
	this.pc[10]=this.ctrlData.leftColor[1]/255;
	this.pc[11]=this.ctrlData.leftColor[2]/255;
	this.pc[15]=this.ctrlData.rightColor[0]/255;
	this.pc[16]=this.ctrlData.rightColor[1]/255;
	this.pc[17]=this.ctrlData.rightColor[2]/255;
	this.ctx.bufferData(this.ctx.ARRAY_BUFFER, this.pc, this.ctx.STATIC_DRAW);
	this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 3);  // Draw the triangles	
}

CASE.Case2.prototype.createGUI=function(){
	this.ctrlData=new function(){
		this.topColor=[255,0,0];
		this.leftColor=[0,255,0];
		this.rightColor=[0,0,255];
	};

	var gui=this.gui;
	gui.addColor(this.ctrlData,"topColor");
	gui.addColor(this.ctrlData,"leftColor");
	gui.addColor(this.ctrlData,"rightColor");

}



CASE.Case2.prototype.initWebGLStatus=function(){
	var gl=this.ctx;
	// gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Specify the color for clearing <canvas>
	gl.clear(gl.COLOR_BUFFER_BIT);      // Clear <canvas>
	console.log("color setted");
}


var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
' attribute vec4 a_Color;\n' +
'varying vec4 v_Color;\n' +
'void main() {\n' +
	'  gl_Position = a_Position;\n' +
		'  v_Color = a_Color;\n' +
		'}\n';

		// Fragment shader program
		var FSHADER_SOURCE =
		'#ifdef GL_ES\n' +
		'precision mediump float;\n' +
		'#endif\n' +
		'varying vec4 v_Color;\n' +
		'void main() {\n' +
			'  gl_FragColor = v_Color;\n' +
				'}\n';

