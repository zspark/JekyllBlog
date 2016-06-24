CASE.CaseBase=function (){
	this.ctx=g_ctx;
	this._started_=false;
	this.gui=new dat.GUI({autoPlace:false});
	this.gui.case=this;
	//this.gui=new dat.GUI();
}

CASE.CaseBase.prototype={

	destroy:function(){
		this.ctx.clear(0x000000);
		this.ctx=null;
	},

	update_internal:function(){},
	update:function (){},

	start:function (){
		if(!this._started_){
			this.update_internal=this.update;
			this._started_=true;
		}
	},

	stop:function (){
		if(this._started_){
			this.update_internal=function(){};
			this._started_=false;
		}
	},

	createGUI:function(){},

	initWebGLStatus:function(){},

	initShaders:(function(){

		function createProgram( vshader, fshader) {
			// Create shader object
			var gl=g_ctx;
			var vertexShader = loadShader( gl.VERTEX_SHADER, vshader);
			var fragmentShader = loadShader( gl.FRAGMENT_SHADER, fshader);
			if (!vertexShader || !fragmentShader) {
				return null;
			}

			// Create a program object
			var program = gl.createProgram();
			if (!program) {
				return null;
			}

			// Attach the shader objects
			gl.attachShader(program, vertexShader);
			gl.attachShader(program, fragmentShader);

			// Link the program object
			gl.linkProgram(program);

			// Check the result of linking
			var linked = gl.getProgramParameter(program, gl.LINK_STATUS);
			if (!linked) {
				var error = gl.getProgramInfoLog(program);
				console.log('Failed to link program: ' + error);
				gl.deleteProgram(program);
				gl.deleteShader(fragmentShader);
				gl.deleteShader(vertexShader);
				return null;
			}
			return program;
		};

		function loadShader(type, source) {
			// Create shader object
			var gl=g_ctx;
			var shader = gl.createShader(type);
			if (shader == null) {
				console.log('unable to create shader');
				return null;
			}

			// Set the shader program
			gl.shaderSource(shader, source);

			// Compile the shader
			gl.compileShader(shader);

			// Check the result of compilation
			var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
			if (!compiled) {
				var error = gl.getShaderInfoLog(shader);
				console.log('Failed to compile shader: ' + error);
				gl.deleteShader(shader);
				return null;
			}

			return shader;
		};
		var fn=function (vshader,fshader){
			var gl=g_ctx;
			var program = createProgram( vshader, fshader);
			if (!program) {
				console.log('Failed to create program');
				return false;
			}

			gl.useProgram(program);
			gl.program = program;

			return true;

		};
		return fn;
	}()),

//	return {
//		constructor:CASE.CaseBase,
//		destroy:destroy,initShaders:initShaders,start:start,stop:stop,update:update
//	};
};

