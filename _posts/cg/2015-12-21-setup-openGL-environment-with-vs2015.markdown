---
layout: post
title:  "visual studio 2015下搭建openGL开发环境"
date:   2015-12-25
category: CG
published: true
excerpt: ""
meta: 
author: 
tags: [计算机图形学 computer-graphics cg CG]
---

*今天是洋人的圣诞节，不喜热闹的在下接茬复习计图。这是一个偏章，简单提供下相关文件与搭建步骤。*

{{site.blank}}这里不写一堆一堆的如何指导大家搭建环境，网上多的是（google查看），我主要提供下自己搭建的最顺利的一个版本。视频参考[这里][vedio1]，来自youtube需要翻墙。标题是《How to Set up OpenGL and GLUT in Visual Studio (C++)》作者使用的是vs2013，我搭建使用vs2015绝对保证可以运行。里面作者提供的下载资料估计也需要翻墙吧，为了国人方便，特别在未经原作者允许的情况下放入我的服务器提供下载。

压缩包目录结构：

* Glew and Glut
	* freeglut
		* bin
			* x64
				* freeglut.dll
			* freeglut.dll
		* include
			* GL
				* freeglut.h
				* freeglut_ext.h
				* freeglut_std.h
				* glut.h
		* lib
			* freeglut.lib
			* x64
				* freeglut.lib
	* glew-1.11.0
		* bin
			* ...
		* doc
			* ...
		* include
			* GL
				* glew.h
				* glxew.h
				* wglew.h
		* lib
			* Release MX
				* ...
			* glew32.lib
			* glew32s.lib
	* Base Code.txt
	* freeglut.dll
	* glew32.dll

-------------------

[本站下载][d1]

原作者提供站点下载:[http://download635.mediafire.com/aflwmwgl1vvg/cmlnr0pj0pyha5d/Glew+and+Glut.zip][d2]

### 简单的步骤

1. 在vs中创建一个空项目，作者特别强调了句“空项目”；

2. 在空项目中创建一个cpp文件，拷贝进去上面下载包中的`Base Code.txt`文件内的C++程序，此时肯定大量错误，这是测试环境是否搭建好了的测试程序，待用；

3. 打开项目属性面板，在`C/C++->General`下找到`Additional Include Directories`条目，添加下载包中的两个include目录进去；

4. 继续在属性面板的`Linker->General`下找到`Additional Library Directories`
条目，添加下载包中的两个lib目录进去；

5. 最后在`Linker->Input`中找到`AdditionalDependencies`条目，输入"freeglut.lib","glew32.lib"两个字符串；

配置就完成了，回到程序编辑区，发现错误没了，编译运行，一切良好；

### 说明

{{site.blank}}这里肯定会有不少朋友在搭建的时候出现各种各样的问题，大家自己解决，无非注意头文件是否包含了进去，等待连接的静态库文件（windows是.lib，Linue下是.a）是否配置了进去就好。有时候下载的源码文件，需要自己编译的，一般常见于Linue系统下的搭建，可能在编译期间会有各种问题或者编译后连接时各种问题，这都会将问题一层一层的引入深入，解决他们无助于对计图的理解。还是建议找被编译好的文件直接用。



==EOF==

[d1]:{{site.basepath}}{{site.assetspath}}Glew and Glut.zip
[d2]:http://download635.mediafire.com/aflwmwgl1vvg/cmlnr0pj0pyha5d/Glew+and+Glut.zip

[vedio1]:https://www.youtube.com/watch?v=8p76pJsUP44
[img_1]:{{site.basepath}}{{site.imgpath}}image_coor1.jpg
[img_2]:{{site.basepath}}{{site.imgpath}}image_coor2.jpg
