CASE.Case1=function (){
	CASE.CaseBase.call(this);

	//this.initShaders( VSHADER_SOURCE, FSHADER_SOURCE);   // Initialize shaders
}

CASE.Case1.prototype=Object.create(CASE.CaseBase.prototype);
CASE.Case1.prototype.constructor=CASE.Case1;
CASE.Case1.prototype.destroy=function(){
	CASE.CaseBase.prototype.destroy.call(this);
	//TODO:other destroy logic;
};

