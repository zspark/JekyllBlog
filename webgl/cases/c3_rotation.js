CASE.Case3=function (){
	CASE.CaseBase.call(this);

	var gl=this.ctx;

	this.createGUI();
	this.initWebGLStatus();
	this.initShaders( VSHADER_SOURCE, FSHADER_SOURCE);   // Initialize shaders

	this.pc = new Float32Array([ 
			// Vertex coordinates and color
			0.0,  0.5,  -0.1,  1.0,  0.0,  0.0,  
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

CASE.Case3.prototype=Object.create(CASE.CaseBase.prototype);
CASE.Case3.prototype.constructor=CASE.Case3;
CASE.Case3.prototype.destroy=function(){
	setDefaultGLContext();

	CASE.CaseBase.prototype.destroy.call(this);
}

CASE.Case3.prototype.update=function(){
	//计算新的坐标点；
	var angularVelocity=this.ctrlData.angularVelocity;
	var cos=Math.cos(angularVelocity);
	var sin=Math.sin(angularVelocity);
	var tmp=this.pc[0];
	var tmp2=this.pc[1];
	this.pc[0]=tmp*cos+tmp2*sin;
	this.pc[1]=-sin*tmp+tmp2*cos;
	tmp=this.pc[6];
	tmp2=this.pc[7];
	this.pc[6]=tmp*cos+tmp2*sin;
	this.pc[7]=-sin*tmp+tmp2*cos;
	tmp=this.pc[12];
	tmp2=this.pc[13];
	this.pc[12]=tmp*cos+tmp2*sin;
	this.pc[13]=-sin*tmp+tmp2*cos;

	//render
	this.ctx.clear(this.ctx.COLOR_BUFFER_BIT);      // Clear <canvas>
	this.ctx.bufferData(this.ctx.ARRAY_BUFFER,this.pc, this.ctx.STATIC_DRAW);
	this.ctx.drawArrays(this.ctx.TRIANGLES, 0, 3);  // Draw the triangles	

}

CASE.Case3.prototype.createGUI=function(){
	this.ctrlData=new function(){
		this.angularVelocity=.003;
		this.play=true;
	};

	var gui=this.gui;
	gui.add(this.ctrlData,"angularVelocity",0,.01);
	gui.add(this.ctrlData,"play").onChange(
		function(value){
			var self=this.__gui.case;
			if(value)self.start();	
			else self.stop();
		}
	);
}

CASE.Case3.prototype.initWebGLStatus=function(){
	var gl=this.ctx;
	gl.clear(gl.COLOR_BUFFER_BIT);      // Clear <canvas>
}


var VSHADER_SOURCE =
'attribute vec4 a_Position;\n' +
'attribute vec4 a_Color;\n' +
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

