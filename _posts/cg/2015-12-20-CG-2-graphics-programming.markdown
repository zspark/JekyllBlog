---
layout: post_with_wisdom
title:  "《交互式计算机图形学》复习笔记-图形学编程"
date:   2015-12-25
category: CG
published: true 
excerpt: ""
wisdom: 如果你以为用户是白痴，那就只有白痴才用它。 —— 李纳斯·托沃兹（Linus Torvalds），LINUX之父
meta: 
author: 
subImgPath: cg\cg1\
tags: [计算机图形学 computer-graphics cg CG]
---

## 第二章 图形学编程

{{site.blank}}第二章就是为了写个谢尔并斯基镂垫程序，但是Edward却引发说了一堆东西，叫一般人可写不出来。

### 绘制模式

传统的绘制模式有典型的两种：

1. 立即绘制模式：就是便计算边提交给OpenGL试图让其绘制；
2. 延迟绘制模式：先计算出全部的需要绘制的数据，比如坐标、颜色等，保存在数组中，完事统一提交给OpenGL；

{{site.blank}}简单分析下这两种方式就会发现：如果需要再次绘制，第一种便需要重新再计算一遍数据；如果数据提交频繁（比如一个物体动来动去），第二种方式就会因内存数据频繁的向GPU提交而成为性能瓶颈。于是OpenGL出现了第三种方案，应该说是前两种方案的折中：**先全部计算出来，完事一个批次提交给显存，而不是把数据依然留存在内存中。**

### 点与顶点

> 在OpenGL中一定区分“点”与“顶点”的含义。“顶点”是空间中的一个位置，我们在计算机图形学中使用顶点的空间包括二维的、三维的和四维的。我们利用定点来定义图形系统中可识别的基本几何图元。比如我们一个点，那它在空间中就需要一个顶点来定义；再比如一条线段，就需要2个空间中的顶点来定义等等。  --《交互式计算机图形学》第六版

### API

既然OpenGL、D3x都是虚拟照相机模型下的图形系统，那么其API的设计就免不了下面7种类型：

* 图元函数：定义了系统可以显示的低级对象或者最基本的实体。视API的不同，图元函数可以包括点、线段、多边形、像素文本和各种曲线；
* 属性函数：控制图元在显示器上显示的方式；
* 观察函数：可以指定各种视角；
* 变换函数：用户可以对对象进行诸如旋转、平移、缩放之类的变换；
* 输入函数：为了开发交互式应用程序，图形系统必须提供输入函数；
* 控制函数：使得用户可以与窗口系统通信，初始化我们的程序，以及处理在程序执行期间发生的任何错误；
* 查询函数：在应用程序中我们可能经常使用API中的其他信息，包括照相机的参数或者帧缓存中的值。

{{site.blank}}OpenGL中的参数大多数是持续性的，他们的值保持不变，除非我们调用改变状态的函数显示地改变他们。OpenGL与各个不同的系统之间有一个接口函数库，

|OS|使用的库|
|:-----:|:-----:|
|X Window System |GLX|
|window System	|wgl|
|mac	|agl|

OpenGL扩展库(GLEW)：这是个与操作系统无关的库，主要是一些函数、变量等的初始化。；

OpenGL实用工具库\箱(GLUT：OpenGL Utility Toolkit)：提供了任何现代窗口系统所需的最小功能集；

### 图元的类型：

* 几何图元(geometric primitive);
* 图像图元\光栅图元(raster primitive)：光栅图元的一个例子是像素阵列，比如点阵字体，它不具有几何属性，我们不能像对几何图元那样对光栅图元进行几何操作。光栅图元需要经过另一条流水线的处理，这条流水线与几何流水线并行，终点也是帧缓存，如图2.6。

{% include image.html src="cg/cg1/image_cg1_1.jpg" caption="图2.6 简化了的OpenGL管线 来自《交互式计算机图形学》E文第六版 P.57" width="795" height="309" align="center" %}

### OpenGL中的几何图元

OpenGL中一共有7种图元：

|图元   |type    |说明     |
|:-----:|:------:|:-------:|
|点     |GL_POINTS|每个顶点被显示的大小至少是一个像素|
|线段     |GL_LINES |相继的顶点配对成线段的两个端点    |
|折线     |GL_LINE_STRIP|中间顶点也相连，但顶点数组中的首尾顶点不相连|
|折线   |GL_LINE_LOOP|首尾也相连的折线|
|三角形|GL_TRIANGLES|相继的每三个顶点被解释为一个三角形|
|三角带|GL_TRIANGLE_STRIP|每个顶点与前两个顶点组成一个新的三角形|
|三角形扇|GL_TRIANGLE_FAN|第一个顶点共享，后续依次减去第2、第3...顶点构成新的三角形|

三角形是OpenGL所支持的唯一多边形，多边形中的绘制有三种不同的模式：

* 点模式（GL_POINT）；
* 线模式（GL_LINE）；
* 填充模式（GL_FILL）；

这三种模式仅仅针对多边形，通过glPolygonMode函数来进行指定，具体参考官方[函数指南][url4]；点、线段、折线等图元无效。

> 我们把用来描述对象如何被绘制的方式称为属性(atribute)。  ---《交互式计算机图形学》第六版中文

### 颜色

{{site.blank}}目前常用的颜色是RGBA颜色，四个分量，每个8位，共32位。历史上出于帧缓存深度太小（比如只有8位），而出现过`索引颜色`模式，这里简单说下索引颜色模式。

{{site.blank}} 假如帧缓存深度只有8位，那么只能表示256种不同的数字（2的8次方），倘若每个数字表示一种颜色的话，这远远不能说是色彩丰富。但是当我们不用这些数字表示颜色，而是用他们表示一个索引，从一个被称为`查色表`的地方去映射一种颜色的话，那么整个颜色的选择就会增大自由度。换句说话如果用256中数字仅仅表示颜色，那么这些颜色是固定死了的，不同的应用只能使用这些颜色，爱用不用。加入是索引的话，应用A建立一个查找表，里面是256种自己中意的颜色，应用B也建立一个自己的查找表，里面又是自己青睐的色彩，这样表现增大了颜色可定制可选择的自由度，是一种技术上的进步。

{{site.blank}}OpenGL设置清屏颜色的函数是glClearColor，参数依次是RGBA的四个分量。

{{site.blank}}第二章还简单说了下观察，这个我会在复习第四章的时候详细做笔记，暂时忽略，这章讲观察无非是为了更清楚的说明本章最终的镂垫程序中的点的坐标为什么被限制在-1到1范围。

### 与OS窗口系统的交互

{{site.blank}}前面的内容说了下glut库函数提供了任何现代窗口系统所需要的最小功能集，这就意味着当你需要更多更全面的与系统窗口交互的功能，需要自己写功能。无论如何glut对于一般应用那也是不二的选择，主要说下其提供的几个重要函数。

* glutInit(int \*argc,char \*\*argv);
* glutCreateWindow(char \*title);
* glutInitDisplayMode(GLUT_RGB \| GLUT_DEPTH \| GLUT_DOUBLE);
* glutInitWindowSize(GLuint w,GLuint h);
* glutInitWindowPosition(x,y);
* glutMainLoop();
* glutMouseFunc();
* glutKeyboardFunc();
* glutDisplayFunc();
* glutIdleFunc();

** 重点注意glutInitDisplayMode函数的参数之间是通过逻辑或结合起来的。**

### 传入顶点数据

{{site.blank}}书中是通过OpenGL显卡缓存的方式提交顶点的，这就是之前说的OpenGL提供的第三个方案，这部分内容我看在书后期基本没有再出现，不打算将其作为重点复习，而会在全新的链接中参考第五版蓝宝书第八章缓冲区对象的内容记录。先给出按照传统的glBegin()，glEnd()的方式传递顶点数据给OpenGL的代码，程序如下。

{% highlight c++ linenos%}
void render() {
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glBegin(GL_POINTS);
	const uint NumPoint = 5000;
	vec2 points[NumPoint];

	//先给出三角形三个顶点；
	vec2 vertices[3] = {
		vec2(-1.0,-1.0),
		vec2(0.0,1.0),
		vec2(1.0,-1.0)
	};

	//在三角形内部选择一个任意的初始点；
	points[0] = vec2(.25, .5);

	//计算并存储N-1个新顶点；
	for (int i = 1; i < NumPoint; i++) {
		int j = rand() % 3;
		points[i] = (points[i - 1] + vertices[j]) / 2.0;
		glVertex2f(points[i].x, points[i].y);
	}
	
	glEnd();
	glFlush();
	glutSwapBuffers();
};
{% endhighlight %}

### 双缓存

{{site.blank}}现代显卡帧缓存中的数据提交到显示器与应用程序刷新帧缓存是两个不同步的过程（部分设备有这样强制同步的机制），于是就产生一个明显的问题，比如帧缓存正在提交数据，而此时应用程序又刷新了帧缓存，那么最终呈现到监视器上的画面就是两部分，一般来说是上面一个画面，下面一个画面。双缓存的意义就在于帧缓存的两边各用一个缓存，应用程序所有的提交经过OpenGL后达到`后端缓存(back buffer)`，而监视器上显示的都是`前端缓存(front buffer)`的内容。程序员只需要在合适的时候调用glSwapBuffer()函数即可告知显卡将后端缓存中的内容提交到前端。


## 精简版谢尔并斯基镂垫程序

{{site.blank}}下面是程序的main函数，其中的render函数参见上面程序。

{% highlight c++ linenos %}
int main(int argc, char* argv[]) {
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGBA |GLUT_DOUBLE | GLUT_DEPTH);
	glutInitWindowSize(800, 600);
	glutInitWindowPosition(100, 100);

	glutCreateWindow("Hello, GL");
	glutDisplayFunc(render);
	glewExperimental = GL_TRUE;

	// Very important!  This initializes the entry points in the OpenGL driver so we can 
	// call all the functions in the API.
	GLenum err = glewInit();
	if (GLEW_OK != err) {
		fprintf(stderr, "GLEW error");
		return 1;
	}

	cout << glGetString(GL_VERSION) << endl;
	cout << glGetString(GL_RENDERER) << endl;
	glutMainLoop();

	return 0;
}
{% endhighlight %}

## 着色器

{{site.blank}}说起着色器，最基本的两个便是顶点着色器、片元着色器，其他的着色器比如细分控制着色器、细分计算着色器、还有几何着色器。拿GLSL着色器语言来说，它也有自己的一套规范，扩展了C语言的数据类型（添加了矩阵和向量）。Edward在第二章首次介绍了着色器的基本用法，并且在镂垫程序中派上用场。

### 顶点着色器

{{site.blank}}前面说过应用程序的数据在通过渲染管线的时候，几何图元中的顶点肯定要经过顶点处理模块，该模块会对经过的顶点经行矩阵变换从而将其坐标从物体坐标系下转换到照相机坐标系下。这是一般的情况，程序员完全可以不让其进行坐标变换或者随性乱变换，这都是可以的，而这些“想怎么着就怎么着”的做法就是在顶点着色器中进行的。

{% highlight glsl linenos%}
#version 430
in vec4 vPosition;
void main(){
 gl_Position=vPosition;
}
{% endhighlight %}

{{site.blank}}上面是一个很简单的顶点着色器程序，其中我们申明了一个vec4类型的变量vPosition，同时用in修饰表示他是从流水线上游（并不一定是直接上游，见下图）提交过来的输入数据，gl_Position是顶点着色器内置的一个vec4实例的类型，不需要我们再次申明。**顶点着色器可以附带处理颜色数据，但是其最基本的作用就是要给流水线下游的模块输出顶点的新坐标，也就是内置的gl_Position必须在输出后至少有数据**。当然gl_Position不给他赋值的话一样可以编译通过，并且正常运行程序，就像下面代码，此时OpenGL会保证你看不见任何东西。

{% highlight glsl linenos%}
#version 430
in vec4 vPosition;
void main(){
}
{% endhighlight %}

现在新的问题出现了，如何映射用in修饰的变量与主程序中的数据？比如我有2个in修饰的上游变量，主程序也有2个数据提交，现在谁对应谁？什么类型？（因为OpenGL与GLSL是不同的语言，vec4可能OpenGL中没有，就算有也可是名字一样罢了）；还好OpenGL提供了获取GLSL代码中部分变量的函数glGetAttribLocation()，见下程序，我们获取了在顶点着色器中的变量vPosition，将它映射到了loc下，紧接着我们开启对这个变量内容的写入，第三条glVertexAttribPointer()函数是指明了我们传给着色器vec4变量的内容的格式。[参见官网函数手册][url4]

{% highlight c++ linenos %}
GLuint loc = glGetAttribLocation(program, "vPosition");
glEnableVertexAttribArray(loc);
glVertexAttribPointer(loc, 2, GL_FLOAT, GL_FALSE, 0, BUFFER_OFFSET(0));
{% endhighlight %}

更多的语法这里暂不提及。

### 片元着色器（片段着色器）

> 光栅化模块输出位于视见体内部的每个图元的片元。每个片元都会被片元着色器处理。每次执行片元着色器时必须至少输出每个片元的颜色，除非这个片元在片元着色器中被标记为丢弃。   ---《交互式计算机图形学》第六版中文

{% highlight glsl linenos%}
#version 430
void main(){
 gl_FragColor=vec4(1.0,0.0,0.0,1.0);
}
{% endhighlight %}

{{site.blank}}上面就是个简单的片元着色器程序，可以看出它有一个与gl_Position很相近的变量gl_FragColor。联想可知其做表达的应该是最终的片元颜色，没错。从OpenGL3.0开始片元颜色的输出也可以使用另一种形式，如下。

{% highlight glsl linenos%}
#version 430
out vec4 fColor;
void main(){
 fColor=vec4(1.0,0.0,0.0,1.0);
}
{% endhighlight %}

其中out修饰的便是输出变量，每个片元都经过上面程序处理后发现都输出了红色。片元变量从之前的gl_FragColor（固定的）到现在的随意起名的变量可以看出，OpenGl的发展是适应现代图像系统的“完全可编程”的理念的。

### 编译、连接着色器程序

{{site.blank}}当程序员写完了各种着色器程序后，不能光在外部保存个文件或者在程序里面写完放着。我们需要编译每个着色器代码，然后连接到被称为`程序对象(Program Object)`的对象上才能使用。`把着色器连接到程序对象的过程中会产生一个表，着色器中的变量名会与表中的索引相关联。`首先利用glCreateShader(shader_type)方法创建一个`着色器对象(Shader Object)`，然后将着色器代码传入对象中，紧接着编译它（编译可能会失败，可以通过glGetShaderiv()获取一些失败的信息，方便调试），编译成功后将着色器对象附加到程序对象上，当全部你想要的着色器对象附加完成后，就可以尝试将程序对象连接到主程序中。

{% highlight c++ linenos%}
//创建程序对象
GLuint program = glCreateProgram();

//创建顶点着色器对象
GLuint vShader=glCreateShader(GL_VERTEX_SHADER);
glShaderSource(vShader, 1, (const GLchar**)&s.source, NULL);
glCompileShader(vShader);
glAttachShader(program, shader);

//创建片元着色器对象
GLuint fShader=glCreateShader(GL_FRAGMENT_SHADER);
glShaderSource(fShader, 1, (const GLchar**)&s.source, NULL);
glCompileShader(fShader);
glAttachShader(program, fhader);

//链接；
glLinkProgram(program);
{% endhighlight %}

## 注意

* 交计图第五版书后面的着色器程序写好后，请务必用LF结尾保存，CR或者CRLF都不会顺利被着色器对象编译，这个问题暂时没有查到相关文章，期待解答。
* 缺少glewExperimental = GL_TRUE;参考[OpenGL红宝书：第一个渲染程序Triangles常见问题归总][url3]

## 交计图中完整的示例程序

{{site.blank}}书中没有给出完整的程序，没准是大卸了八块，需要自己去拼凑，提供的网站可能也怪我没有深入搜索，其结果是空手而归。下面就贴出完整的实例程序。

Source.cpp文件:
{% highlight c++ linenos%}
#include <Windows.h>
#include <GL\glew.h>
#include <GL\freeglut.h>
#include <iostream>
#include "vec.h"
#include "Angel.h"

using namespace std;

const int NumPoint = 5000;
#define BUFFER_OFFSET(bytes) ((GLvoid*) (bytes))
void initApp() {
	vec2 points[NumPoint];

	vec2 vertices[3] = {
		vec2(-1.0,-1.0),
		vec2(0.0,1.0),
		vec2(1.0,-1.0)
	};

	//在三角形内部选择一个任意的初始点；
	points[0] = vec2(.25, .5);

	//计算并存储N-1个新顶点；
	for (int i = 1; i < NumPoint; i++) {
		int j = rand() % 3;
		points[i] = (points[i - 1] + vertices[j]) / 2.0;
	}

	GLuint program = Angel::InitShader("vshader21.glsl", "fshader21.glsl");
	glUseProgram(program);

	//创建并初始化一个顶点缓冲区对象；
	GLuint vao;
	glGenVertexArrays(1, &vao);
	glBindVertexArray(vao);

	//创建并初始化一个缓冲区对象；
	GLuint buffer;
	glGenBuffers(1, &buffer);
	glBindBuffer(GL_ARRAY_BUFFER, buffer);
	glBufferData(GL_ARRAY_BUFFER, sizeof(points), points, GL_STATIC_DRAW);

	//初始化顶点着色器中的顶点位置属性；
	GLuint loc = glGetAttribLocation(program, "vPosition");
	glEnableVertexAttribArray(loc);
	glVertexAttribPointer(loc, 2, GL_FLOAT, GL_FALSE, 0, BUFFER_OFFSET(0));

	glClearColor(1.0, 1.0, 1.0, 1.0);
}

void changeViewPort(int w, int h) {
	glViewport(0,0, w, h);
}

void render() {
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	glDrawArrays(GL_POINTS, 0, NumPoint);
	glFlush();
	glutSwapBuffers();
}

int main(int argc, char* argv[]) {
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGBA |GLUT_DOUBLE | GLUT_DEPTH);
	glutInitWindowSize(800, 600);
	glutInitWindowPosition(100, 100);

	glutCreateWindow("Hello, GL");
	// Bind the two functions (above) to respond when necessary
	glutReshapeFunc(changeViewPort);
	glutDisplayFunc(render);

	GLenum err = glewInit();
	if (GLEW_OK != err) {
		fprintf(stderr, "GLEW error");
		return 1;
	}

	//cout << glGetString(GL_VERSION) << endl;
	//cout << glGetString(GL_RENDERER) << endl;
	initApp();
	glPolygonMode(GL_FRONT, GL_POINT);
	glutMainLoop();

	return 0;
}
{% endhighlight %}

vec.h文件：
{% highlight c++ linenos%}
#pragma once
#include "GL\glew.h"

struct vec2{
	GLfloat x, y;
	vec2() {}
	vec2(GLfloat xx, GLfloat yy) :x(xx), y(yy) {}

	vec2 operator+(const vec2 &v) {
		return vec2(x + v.x, y + v.y);
	}

	vec2 operator/(GLfloat f) {
		return vec2(x / f, y / f);
	}
};

typedef struct vec2 point2;

{% endhighlight linenos%}

Angel.h文件：
{% highlight c++ linenos%}
#pragma once
#include <iostream>
#include "GL\glew.h"

namespace Angel{
	static char* readShaderSource(const char* shaderFile) {
		FILE* fp = fopen(shaderFile,"r");
		if (fp == NULL) { return NULL;}
	
		fseek(fp, 0L, SEEK_END);
		long size = ftell(fp);
		fseek(fp, 0L, SEEK_SET);
		char* buf = new char[size + 1];
		fread(buf, 1, size, fp);

		buf[size] = 0;
		fclose(fp);
		return buf;
	}

	GLuint InitShader(const char* vShaderFile, const char* fShaderFile) {
		struct Shader {
			const char* filename;
			GLenum		type;
			GLchar*		source;
		}shaders[2] = {
			{vShaderFile,GL_VERTEX_SHADER,NULL},
			{fShaderFile,GL_FRAGMENT_SHADER,NULL}
		};

		GLuint program = glCreateProgram();
		for (int i = 0; i < 2; i++) {
			Shader& s = shaders[i];
			s.source = readShaderSource(s.filename);
			if (s.source == NULL) {
				std::cerr << "Failed to read" << s.filename << std::endl;
				exit(EXIT_FAILURE);
			}
			//std::cout << s.source << std::endl;
			GLuint shader = glCreateShader(s.type);
			glShaderSource(shader, 1, (const GLchar**)&s.source, NULL);
			glCompileShader(shader);

			GLint compiled;
			glGetShaderiv(shader, GL_COMPILE_STATUS, &compiled);
			if (!compiled) {
				std::cerr << s.filename << "failed to compile:" << std::endl;
				GLint logSize;
				glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &logSize);
				char* logMsg = new char[logSize];
				glGetShaderInfoLog(shader, logSize, NULL, logMsg);
				std::cerr << logMsg << std::endl;
				delete[] logMsg;
				//exit(EXIT_FAILURE);

			}

			delete[] s.source;

			glAttachShader(program, shader);
		}

		//链接和错误检测；
		glLinkProgram(program);

		GLint linked;
		glGetProgramiv(program, GL_LINK_STATUS, &linked);
		if (!linked) {
			std::cerr << "Shader program failed to link" << std::endl;
			GLint logSize;
			glGetProgramiv(program, GL_INFO_LOG_LENGTH, &logSize);
			char* logMsg = new char[logSize];
			glGetProgramInfoLog(program, logSize, NULL, logMsg);
			std::cerr << logMsg << std::endl;
			delete[] logMsg;
		}
		return program;
	}
}
{% endhighlight %}

顶点着色器文件vshader21.glsl：
{% highlight glsl linenos%}
#version 430
in vec4 vPosition;
void main(){
 gl_Position=vPosition;
}
{% endhighlight %}

片段着色器文件fshader21.glsl：
{% highlight glsl linenos%}
#version 430

void main(){
 gl_FragColor=vec4(1.0,0.0,0.0,1.0);
}
{% endhighlight %}

### 效果图

{% include image.html src="cg/cg1/image_cg1_2.jpg" caption="二维谢尔并斯基镂垫图，来自demo绘制。" width=800 align="center" %}

{% include image.html src="cg/cg1/image_cg1_3.jpg" caption="三维谢尔并斯基镂垫效果图，来自网络。" width=816 align="center" %}

## 总结

{{site.blank}}第二章是个相比第一章更加具体的章节，即便如此也没有深入讲解每一个模块的深入方面。本章用一个镂垫程序为引子，重点介绍了一个普通的OpenGL程序基本的结构、程序与OpenGL交互数据的基本方式方法，扩展说了下颜色、着色器等。从第三章开始正式进入顶点处理模块————几何变换，这才是图形学的开始。

==EOF==

[vedio1]:[https://www.youtube.com/watch?v=8p76pJsUP44]
[url2]:https://github.com/opentk/opentk/issues/18
[url3]:http://www.cnblogs.com/caster99/p/4752354.html
[url4]:https://www.opengl.org/sdk/docs/man/

[url5]:http://www.xuebuyuan.com/839988.html

