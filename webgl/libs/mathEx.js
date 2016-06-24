function Matrix4x4(){
	this.elements=new Float32Array([
			1,0,0,0,
			0,1,0,0,
			0,0,1,0,
			0,0,0,1,
			]);
};

Matrix4x4.prototype={
	setTo:function (ele){
		var e=this.elements;
		e[0]=ele[0];
		e[4]=ele[1];
		e[8]=ele[2];
		e[12]=ele[3];

		e[1]=ele[4];
		e[5]=ele[5];
		e[9]=ele[6];
		e[13]=ele[7];

		e[2]=ele[8];
		e[6]=ele[9];
		e[10]=ele[10];
		e[14]=ele[11];
		
		e[3]=ele[12];
		e[7]=ele[13];
		e[11]=ele[14];
		e[15]=ele[15];
		return this;
	},

	setIdentity:function (angular){
		var e = this.elements;
		e[0] = 1;   e[4] = 0;   e[8]  = 0;   e[12] = 0;
		e[1] = 0;   e[5] = 1;   e[9]  = 0;   e[13] = 0;
		e[2] = 0;   e[6] = 0;   e[10] = 1;   e[14] = 0;
		e[3] = 0;   e[7] = 0;   e[11] = 0;   e[15] = 1;
		return this;
	},
};

function Matrix2x2(){
	this.elements=new Float32Array([
			1,0,
			0,1,
			]);
};

Matrix2x2.prototype={
	constructor:Matrix2x2,

	setTo:function (ele){
		var e=this.elements;
		e[0]=ele[0];
		e[2]=ele[1];
		e[1]=ele[2];
		e[3]=ele[3];

		return this;
	},

	setIdentity:function (){
		var e = this.elements;
		e[0] = 1;   e[1] = 0;
		e[2] = 0;   e[3] = 1;
		return this;
	},

	rotateTo:function (angular){
		var e = this.elements;
		var v=angular;
		e[0]=Math.cos(v);e[1]=Math.sin(v);
		e[2]=-Math.sin(v);e[3]=Math.cos(v);
		return this;
	},

	rotate:function (angular){
		var a=new constructor();
		a.rotateTo(angular);
		this.concat(a);
		return this;
	},

	/**
	 *this=anotherXthis;
	 */
	concat:function (another){
		var a=another.elements;
		var e=this.elements;
		var n1,n2,n3,n4;
		n1=a[0]*e[0]+a[2]*e[1];n2=a[1]*e[0]+a[3]*e[1];
		n3=a[0]*e[2]+a[3]*e[1];n4=a[1]*e[2]+a[3]*e[3];

		e[0]=n1;e[1]=n2;e[2]=n3;e[3]=n4;
		return this;
	}
}

};

