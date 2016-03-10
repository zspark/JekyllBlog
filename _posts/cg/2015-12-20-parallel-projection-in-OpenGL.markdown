---
layout: post_with_wisdom_mathjax
title:  "OpenGL中的平行投影"
date:   2015-07-25
categories: jekyll CG
published: true
excerpt: ""
wisdom: 知识最大的敌人不是无知，而是错觉。—— 斯蒂文·霍金（Stephen Hawking）
meta: 
author: 
subImgPath: cg\cg4_view\
tags: [计算机图形学 computer-graphics cg CG]
---

{{site.blank}}*我很欣赏霍金上面的名言，用中国大众语言表达出来就是“自以为是”，我这里想表达的不是“自以为是”在褒贬上的含义，而是直白的字面意思：自己觉得就是这个样子。相比无知，自以为是应该更加可怕，因为自以为是的人会大胆的做一些可怕的事情但浑然不知。*

{{site.blank}}OpenGL中的投影至少有两种，一种平行投影，一种透视投影。所谓平行投影，就是投影线彼此平行，可以分为平行正投影与平行斜投影。下面记录下自己对OpenGL中平行投影的理解。

## 平行正投影

{{site.blank}}平行正投影表示不但投影线彼此要平行，还要与投影平面垂直。由于投影线彼此平行，因此不会相交，所投影的图像也不会产生“近大远小”的视觉效果，图1就是个平行正投影，远处的四边形投影到平面f上后是绿色线段n，近处的三角形投影后是蓝色的线段l（图像重叠，看的不是很清楚）。我们分析这张图可以知道物体上的顶点投影过去后，其y值不变，而x值变成了与平面f的x值相同的值。联想到三维空间，假如f是xoy平面，远处物体要平行投影，其结果应该会是物体的x，y值不变，而z值变成了0。

![img0][img0] 图1

这种投影下的变换矩阵很简单：

$$
\left[
\begin{matrix}
1,0,0,0\\
0,1,0,0\\
0,0,0,0\\
0,0,0,1\\
\end{matrix}
\right]
$$

{{site.blank}}我不知道大家如何理解矩阵对顶点的变化，我说一下自己的。当一个矩阵左乘一个顶点（都是齐次的）的时候，矩阵的第一行影响变换后的新顶点的x值，第二行影响y值，第三行影响z值，第四行影响齐次坐标下的w值。拿上面矩阵来说，它的第一行只有第一个分量是1，表示最终顶点的x值只取原来顶点x值的1倍，因为其他分量是0，也影响不到。倘若第一行是$$2,5,0.5,2$$的话，表示最终顶点的x值是被变换之前的顶点的x值的2倍、y值的5倍，z值的0.5倍，还有w值的2倍所影响。再比如点一行是$$0,1,0,0$$的话，表示最终顶点的x值与原来顶点的x值没关系，其值仅仅是原来顶点的y值。（**一定注意是矩阵左乘向量**）

{{site.blank}}从矩阵中看出变换后的点的z值不受原来点的任何分量的影响，一律是0.这也正是我们想要的结果。从数学的角度来看这样就完成了平行正投影的计算过程，但在我们的OpenGL来看，还差点火候。因为OpenGL渲染管线会在后期裁减掉`规范视见体（Canonical View Volume,CVV）`外面的任何顶点、线段、物体等，而我们在建模的时候基本不会把模型的大小限制在CVV大小的立方体（一个边长为2，且与轴平行，中心点与原点重合的立方体）里面去做，图2是个在3DMax下的模型顶点坐标。世界空间下的所有物体也不会恰巧全部与眼标架的z轴对称。所以解决这个问题的办法就是通过平移与缩放。

![img5][img5] 图2

{{site.blank}}说平移与缩放的时候，我们需要先说下自定义视见体，视见体就是规定空间中什么范围内的物体最后要被呈现在显示器上，定义它的目的就是希望在该范围中的物体被成像，而不仅仅是在CVV中，显然这样一来我们的工作会大大提升自由度，比如建模师可以随意建模，应用程序也可以随意指定视见体大小。但是毕竟裁剪与后期的处理是管线固定了的，所以我们在获得高自动度之后就需要利用一个矩阵，将自定义视见体中的所有要显示的物体变换到CVV中，基本的思路就是：如果偏离了原点就平移回来，如果视见体比CVV大就缩小。比如我们前端程序设置了这样一个立方体：（**这里强调一句，一般我们在平行投影的时候，自定义视见体被定义成与轴垂直的长方体，而在透视投影的时候，定义为四棱台**）

$$
\begin{align}
left \le &x \le right\\
bottom \le &y \le top\\
0 \le near \le &z \le far\\
\end{align}
$$

现在问题集中在如何将定义的视见体（上面的范围）映射到CVV大小的空间与位置下。

### 平移与缩放

{{site.blank}}首先通过平移将自定义视见体（后面用“视见体”表是自定义视见体，用CVV表示规范化视见体）的中心$$(\frac{left+right}{2} , \frac {bottom+top}{2} , \frac{near+far}{2})$$移动到眼标架原点。普通平移矩阵，大家应该很熟悉：

$$
T=
\left [
\begin{matrix}
1,0,0,-\frac{left+right}{2}\\
0,1,0,-\frac {bottom+top}{2}\\
0,0,1,\frac{near+far}{2}\\
0,0,0,1\\
\end{matrix}
\right ]
$$

注意到矩阵第三行没有负号‘-’，什么原因？这里要是不说清楚的话，打死各位看官也不可能明白。

* 在渲染管线中，当顶点进入投影阶段的时候，能确定的是之前已经经过了模视变换，此时处理的所有顶点坐标都已经处于眼坐标系空间了；
* 眼空间下OpenGL依然使用的是右手坐标系，z轴正向指向照相机后面，所以凡是能被照相机看见的物体，他们的z坐标基本清一色的是负数；

我们再查看下上面定义的视见体范围可知，near与far变量全部是正数。问题来了，视见体的近、远裁减面是正数，意味着视见体处于眼标架的z轴正向（照相机后面），此时的程序并不是不可以执行，就是逻辑上不太直观的被理解，你想照相机看着前方，看到的却是后面的景象！所以这里要说明的是，**在用OpenGL研究观察的时候，near与far仅仅表示近、远裁剪面到眼标架原点的距离，实际位置需要加上负号。**这样一来视见体便是在照相机的前面（z负半轴），平移的时候需要向正方向移动，所以没有负号。这个矩阵就能将空间中任意地方的视见体的中心平移到原点处。之后需要通过缩放，将其映射成CVV的大小，矩阵是：

$$
S=
\left [
\begin{matrix}
\frac {2}{right-left},0,0,0\\
0,\frac {2}{top-bottom},0,0\\
0,0,\frac {2}{far-near},0\\
0,0,0,1\\
\end{matrix}
\right ]
$$

将矩阵级联，得到变换矩阵$$M$$为：

$$
M=ST=
\left [
\begin{matrix}
\frac {2}{right-left},0,0,0\\
0,\frac {2}{top-bottom},0,0\\
0,0,\frac {2}{far-near},0\\
0,0,0,1\\
\end{matrix}
\right ]\times
\left [
\begin{matrix}
1,0,0,-\frac{left+right}{2}\\
0,1,0,-\frac {bottom+top}{2}\\
0,0,1,\frac{near+far}{2}\\
0,0,0,1\\
\end{matrix}
\right ]=
\left [
\begin{matrix}
\frac {2}{right-left},0,0,-\frac{left+right}{right-left}\\
0,\frac {2}{top-bottom},0,-\frac {bottom+top}{top-bottom}\\
0,0,\frac {2}{far-near},\frac{near+far}{far-near}\\
0,0,0,1\\
\end{matrix}
\right ]
$$

{{site.blank}}大家以为这就完事了吗？还没有，还有最后一步，那就是，当我们将视见体转换到CVV的大小与位置后，我们的标架同样需要从眼空间转换到裁减空间下（CVV就是在裁剪空间下），而OpenGL中的裁剪空间是左手坐标系。

> “由于屏幕坐标经常指定为左手系，因此规范化观察体也常指定为左手系统。这样就可以将观察方向的正距离解释为离屏幕（观察平面）的距离。”  --《计算机图形学》中文第三版 P.298<br>
“Because screen coordinates are often specified in a left-handed reference frame, normalized coordinates also are often specified in a left-handed system. This allows positive distances in the viewing direction to be directly interpreted as distances from the screen(the viewing plane). Thus, we can convert projection coordinates into positions within a left-handed normalized-coordinate reference frame, and these coordinate positions will then be transferred to left-handed screen coordianteds by the viewport transformation.” 《计算机图形学》英文第四版 P. 344

{{site.blank}}可以知道这是为了以后流水线处理的方便，并没有太多需要解释的东西。这个变换是必须的，因为流水线后面阶段在判断z序的时候，是根据“z值越大越离照相机远”的逻辑来经行的，倘若不转换，成像的结果就是远处的物体在近处的前面，甚至物体本身后面也在自己的前面，what a mass！所以上面我们计算出来的矩阵$$M$$需要再右乘左右手的转换矩阵，最终OpenGL下的平行正投影变换矩阵$$M_{ortho}$$为：

$$
M_{ortho}=
\left [
\begin{matrix}
1,0,0,0,\\
0,1,0,0,\\
0,0,-1,0,\\
0,0,0,1
\end{matrix}
\right ]\times M=
\left [
\begin{matrix}
\frac {2}{right-left},0,0,-\frac{left+right}{right-left}\\
0,\frac {2}{top-bottom},0,-\frac {bottom+top}{top-bottom}\\
0,0,-\frac {2}{far-near},-\frac{near+far}{far-near}\\
0,0,0,1\\
\end{matrix}
\right ]
$$


### 测试程序

{{site.blank}}下面是个简单的测试程序。平面不在CVV里面，但是通过$$M_{ortho}$$变换后，落在了CVV里面，最终成像。

{% highlight c++ linenos%}
#include <Windows.h>
#include <GL\glew.h>
#include <GL\freeglut.h>
#include "../../common/Angel.hpp"
#include "../../common/vec.hpp"

using namespace std;

#define BUFFER_OFFSET(bytes) ((GLvoid*) (bytes))

GLuint vPos;
GLuint vColor;

void initApp
 //vertices;
 //从左上角顶点开始、顺时针旋转的4个顶点；
 //这里表明，四边形的四个顶点及其组成的整个平面都不在CVV里面；
 const int SIZE = 4.5;
	vec4 vertices[4] = {
		vec4(-SIZE,SIZE,-SIZE,1),//A,0
		vec4(SIZE,SIZE,-SIZE,1),//B,1
		vec4(SIZE,-SIZE,-SIZE,1),//C,2
		vec4(-SIZE,-SIZE,-SIZE,1),//D,3
	};

	//color，依次为红绿蓝白；
	vec4 colors[4] = {
		color(1,0,0,1),
		color(0,1,0,1),
		color(0,0,1,1),
		color(1,1,1,1),
	}; 

	//indexes;
	GLuint indexes[6] = {
	 0,3,1,2,1,3
	};

	GLuint program = Angel::InitShader("vshader3.glsl", "fshader3.glsl");
	glUseProgram(program);

	GLuint vBuffer[2];
	glGenBuffers(2, vBuffer);
	glBindBuffer(GL_ARRAY_BUFFER, vBuffer[0]);
	glBufferData(GL_ARRAY_BUFFER, sizeof(vertices)+sizeof(colors), NULL, GL_STATIC_DRAW);
	glBufferSubData(GL_ARRAY_BUFFER, 0, sizeof(vertices), vertices);
	glBufferSubData(GL_ARRAY_BUFFER,  sizeof(vertices), sizeof(colors), colors);

	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, vBuffer[1]);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indexes), indexes, GL_STATIC_DRAW);

	 //获取顶点着色器中的同意变量地址； 
	vPos = glGetAttribLocation(program, "vPosition"); 
	glEnableVertexAttribArray(vPos);
	glVertexAttribPointer(vPos, 4, GL_FLOAT, GL_FALSE, 0, BUFFER_OFFSET(0));

	vColor = glGetAttribLocation(program, "vColor");
	glEnableVertexAttribArray(vColor);
	glVertexAttribPointer(vColor, 4, GL_FLOAT, GL_FALSE, 0, BUFFER_OFFSET(sizeof(vertices)));

	glClearColor(0, 0, 0, 1);
}

void changeViewPort(int w, int h) {
	glViewport(0,0, w, h);
}

void render() {
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, NULL);
	glutSwapBuffers();
}

int main(int argc, char* argv[]) {
	cout << "Hello World!" << endl;
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGBA |GLUT_DOUBLE | GLUT_DEPTH);
	glutInitWindowSize(800, 600);
	glutInitWindowPosition(100, 100);
	glutCreateWindow("Hello, GL");
	glutReshapeFunc(changeViewPort);
	glutDisplayFunc(render);
	//glewExperimental = GL_TRUE;
	GLenum err = glewInit();
	if (GLEW_OK != err) {
		fprintf(stderr, "GLEW error");
		return 1;
	}

	glEnable(GL_DEPTH_TEST);
	cout << glGetString(GL_VERSION) << endl;
	cout << glGetString(GL_RENDERER) << endl;
	initApp();
	glutMainLoop();

	return 0;
}
{% endhighlight %}

这里是顶点与片元着色器：

{% highlight glsl linenos%}
//顶点着色器程序；
#version 430
in vec4 vPosition;
out vec4 fColor;
in vec4 vColor;

void main(){
 fColor=vColor;

 //下面是我们自定义的视见体，r=right,l=left,t=top,b=bottom,n=near,f=far
 //从视见体尺寸可知：应用程序中的平面虽然不在CVV里面，但一定在自定义视见体中;
 int r=9; int l=-9;
 int t=9; int b=-9;
 int n=2; int f=9;

 //平行正投影矩阵;(注意GLSL中的矩阵是列优先矩阵)
 mat4 m=mat4(
	2.0/(r-l),0,0,0,
	0,2.0/(t-b),0,0,
	0,0,-2.0/(f-n),0,
	-(l+r)/(r-l), -(b+t)/(t-b), -(n+f)/(f-n),1
 );

 gl_Position=m*vPosition;
}

//片元着色器程序；
#version 430
in vec4 fColor;
void main(){
 gl_FragColor=fColor;
}

{% endhighlight %}

最终的成像：
![img_demo][img_demo] <br>图 平行正投影


## 平行斜投影

{{site.blank}}平行斜投影就是投影线彼此平行，但投影线与投影平面不垂直的投影。下图就是一张平行斜投影的截图，从中可以简单的看出多边形ABCDE通过绿色投影线u投影到了平面f上，而我们处理它的方案是先将多边形ABCDE通过平行于f的方向错切到多边形A'B'C'D'E'的位置，然后再进行平行正投影。

![img3][img3] 图3 平行斜投影。

![img1][img7] <br>图4 斜投影。(a)俯视图。(b)侧视图。（来自英文版本《交互式计算机图形学》）

{{site.blank}}所以我们将问题的核心集中在如何通过错切使ABCDE编程A'B'C'D'E'。从图4可以看出(x,z)是多边形上的任何一个点，假设为P点，它想要移动到正投影的角度，必须向x轴正方向移动$$(x_{p'}-x)$$的距离。而这个距离正好是$$cot\theta$$的长度（包括符号），所以错切后的点P的位置就应该是$$(x+cot\theta * z)$$，从图（b）中也可以看到错切后的y值应该是$$(y+cot\phi * z)$$，所以这个错切矩阵应该是下面这样：

$$
\left[
\begin{matrix}
1,0,cot\theta,0\\
0,1,cot\phi,0\\
0,0,1,0\\
0,0,0,1
\end{matrix}
\right]
$$

这样一来，整个平行斜投影进一步变成了平行正投影，[这里][mysiteurl1]简单说了下OpenGL中的平行正投影。最后将整个矩阵级联起来就是了。

下面是立方体的顶点数据；
{% highlight c++ linenos%}
const float SIZE = 4.5;
 const float SIZE2 = 3;
 vec4 vertices[8] = {
	vec4(-SIZE,-SIZE,-SIZE2,1),//A,0
	vec4(-SIZE,-SIZE,-SIZE,1),//B,1
	vec4(-SIZE,SIZE,-SIZE2,1),//C,2
	vec4(SIZE,-SIZE,-SIZE2,1),//D,3
	vec4(SIZE,SIZE,-SIZE,1),//E,4
	vec4(-SIZE,SIZE,-SIZE,1),//F,5
	vec4(SIZE,-SIZE,-SIZE,1),//G,6
	vec4(SIZE,SIZE,-SIZE2,1),//H,7
 };

 //color
 vec4 colors[8] = {
	color(1,0,0,1),
	color(0,1,0,1),
	color(0,0,1,1),
	color(1,1,1,1),

	color(1,0,0,1),
	color(1,1,1,1),
	color(0,0,1,1),
	color(0,1,0,1),
 };
 //indexes;
 GLuint indexes[36] = {
	1,0,2,1,2,5,
	0,3,7,0,7,2,
	3,6,4,3,4,7,
	6,1,5,6,5,4,
	2,7,4,2,4,5,
	0,1,6,0,6,3,
 };
{% endhighlight %}

这里是顶点与片段着色器：
{% highlight glsl linenos%}
//顶点着色器
#version 430
in vec4 vPosition;
out vec4 fColor;
in vec4 vColor;
void main(){
 fColor=vColor;

 float l=-10;float r=10; 
 float b=-10;float t=10;
 float n=2; float f=9;

 //平行正投影矩阵;(注意GLSL中的矩阵是列优先矩阵)
 mat4 m=mat4(
	2.0/(r-l),0,0,0,
	0,2.0/(t-b),0,0,
	0,0,-2.0/(f-n),0,
	-(l+r)/(r-l), -(b+t)/(t-b), -(n+f)/(f-n),1
 );

 //错切矩阵（glsl中的三角数学函数没有cot，只有sin、cos、tan，所以这里用1/tan表示cot）
 float pi1_4=0.78;
 mat4 S=mat4(
	1,0,0,0,
	0,1,0,0,
	1.0/tan(pi1_4),1.0/tan(pi1_4),1,0,//1,1,1,0,
	0,0,0,1
 );

 gl_Position=m*S*vPosition;
}


//片段着色器
#version 430
in vec4 fColor;
void main(){
 gl_FragColor=fColor;
}
{% endhighlight %}

### 截图

![img8][img8]<br> 图 OpenGL中的平行斜投影






==EOF==



[img0]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_cg4_0.jpg "img0"
[img3]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_cg4_oblique_projection.jpg "img3"
[img5]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_cg4_5.jpg "img5"
[img7]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_cg4_7.jpg "img7"
[img8]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_cg4_8.jpg "img8"
[img_demo]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_cg4_parallel_projection.jpg "img_parallel_projection"




