const STAGE_COLOR={r:.5,g:.5,b:.5,a:1.0};
var g_ctx;
var CASE={};
CASE.currentCase=null;
function init() {

	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//Creatation of main GUI .
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var mainMenu=new function (){
		this.frame=function(){openCase(CASE.Case1); };
		this.triangle=function(){openCase(CASE.Case2); };
		this.rotation=function(){openCase(CASE.Case3); };
	};

	var mainGUI=new dat.GUI({autoPlace:false});
	// mainGUI.add(mainMenu,"frame");
	mainGUI.add(mainMenu,"triangle");
	mainGUI.add(mainMenu,"rotation");

	document.getElementById('mainMenuDiv').appendChild(mainGUI.domElement);

	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//Get WebGL context;
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	var cvs=document.getElementById("cvs");
	cvs.width=window.innerWidth;
	cvs.height=window.innerHeight;
	g_ctx=create3DContext(cvs);
	setDefaultGLContext();
	//
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	//resize;
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	window.onresize=function (evt){
		var cvs=document.getElementById("cvs");
		cvs.width=window.innerWidth;
		cvs.height=window.innerHeight;
		// log:console.log("(w:h)"+window.innerWidth+','+window.innerHeight);
	}
	//
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	// Provides requestAnimationFrame in a cross browser
	//
	// ERRATA: 'cancelRequestAnimationFrame' renamed to 'cancelAnimationFrame' to reflect an update to the W3C Animation-Timing Spec.
	// Cancels an animation frame request.
	// Checks for cross-browser support, falls back to clearTimeout.
	// @param {number}  Animation frame request. */
	//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
	if (!window.requestAnimationFrame) {
		window.requestAnimationFrame = (function() {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				window.oRequestAnimationFrame ||
				window.msRequestAnimationFrame ||
				function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
					window.setTimeout(callback, 1000/60);
				};
		})();
	}
	if (!window.cancelAnimationFrame) {
		window.cancelAnimationFrame = (window.cancelRequestAnimationFrame ||
		window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame ||
		window.mozCancelAnimationFrame || window.mozCancelRequestAnimationFrame ||
		window.msCancelAnimationFrame || window.msCancelRequestAnimationFrame ||
		window.oCancelAnimationFrame || window.oCancelRequestAnimationFrame ||
		window.clearTimeout);
	}
}//end of init

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Global fns;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function create3DContext (canvas, opt_attribs) {
	const names = ["webgl", "experimental-webgl", "webkit-3d", "moz-webgl"];
	var context = null;
	for (var ii = 0; ii < names.length; ++ii) {
		try {
			context = canvas.getContext(names[ii], opt_attribs);
		} catch(e) {}
		if (context) {
			break;
		}
	}
	return context;
}

function setDefaultGLContext(){
	if(g_ctx!=null){
		g_ctx.clearColor(STAGE_COLOR.r,STAGE_COLOR.g,STAGE_COLOR.b,STAGE_COLOR.a);
		g_ctx.clear(g_ctx.COLOR_BUFFER_BIT);
	}else
		throw "WebGL context was not created yet!";
}


function openCase(fn){
	if(fn==null){
		alert("No such case exist, Case open failure! index="+index);
		return ;
	}
	if(CASE.currentCase!=null){
		document.getElementById("caseMenuDiv").removeChild(CASE.currentCase.gui.domElement);
		window.cancelAnimationFrame(CASE.currentCase.update);
		CASE.currentCase.destroy();
	}
	CASE.currentCase=new fn();
	document.getElementById("caseMenuDiv").appendChild(CASE.currentCase.gui.domElement);
	caseUpdate();
};

function caseUpdate(){
	window.requestAnimationFrame(caseUpdate);
	CASE.currentCase.update_internal();
};

