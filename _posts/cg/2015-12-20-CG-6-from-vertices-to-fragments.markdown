---
layout: post_with_wisdom_mathjax
title:  "《交互式计算机图形学》复习笔记-从顶点到片元"
date:   2016-03-02
categories: jekyll CG
published: true
excerpt: "重点讨论裁剪、光栅化、隐藏面消除"
keywords: "cg,clippling,rasterization,hidden-surface removal,3d,计算机图形学,computer-graphics"
wisdom: 如果你以为用户是白痴，那就只有白痴才用它。 —— 李纳斯·托沃兹（Linus Torvalds），LINUX之父
meta: 
author: 
subImgPath: cg\vertices_to_fragments\
tags: [计算机图形学 computer-graphics cg CG]
---

## 从顶点到片元

> “在计算机图形学中，图形的生成过程以应用程序为起点，而以图像的生成为终点。”	摘自《交互式计算机图形学》中文第六版P.213

图形系统必须做的事情有两点：

* 每个几何对象必须通过图形绘制系统；
* 帧缓冲中要为显示的颜色赋值；

目前主流的绘制策略有两条：

* 面向对象的（object-oriented)： 面向对象的渲染策略需要大量的内存以及单独处理每个对象所需的大量时间开销，随着高密度存储技术的发展，这个已经不是主要问题，其局限性是：无法处理大部分的全局计算，比如光的反射计算；
* 面向图像的（image-oriented)：主要问题是需要事先使用优秀的数据结构为后期处理做数据基础，不然从像素出发的逆向绘制策略难以辨识哪些几何对象影响哪些像素。

### 片元处理

{{site.blank}}片元处理需要至少从这两点去理解，第一需要注意经过光栅化后的几何图元，它可能自带有一定的插值或者平面值颜色（来自顶点颜色属性），同时颜色又需要来自纹理，这两者之间需要一定的逻辑柔和起来，通常在片元着色器中使用分量积的逻辑计算方式；第二需要明白整个片元在计算颜色完毕后写入帧缓存的方式，我们可能需要用到glBlendFunc与glBlendEquation，一个用来调整等式的因子，一个用来调整等式的方程，比如用加法还是减法还是其他。

这里还说到隐藏面消除与背面剔除功能，这是两个概念，前者是说物体A被物体B全部遮挡，那么A就不要绘制；后者是说对于一个面是否要绘制正面与、或背面。

### 裁剪

{{site.blank}}对裁剪的理解，不能局限与流水线中对图元的处理（在CVV中就保留，不在或者部分在的话就裁剪）。应用程序中采用一定的逻辑在流水线开始之前就屏蔽需要绘制的部分对象也是一种裁剪，比如采用八叉树等数据结构首先屏蔽在摄像头后面的物体，或者采用某种算法轻松计算出完全处于不透明实体后面的物体，然后排除此次渲染。这无疑是提高程序整体性能的关键步骤。

下面主要说下《交互式计算机图形学》中提到的两个2D（可扩展到3D）线段裁减算法：

1. Cohen-Sutherland算法
2. Liang-Barsky算法；（Liang是指梁友栋）
3. Sutherland-Hodgeman算法

#### Cohen-Sutherland Clipping

又叫“编码裁减算法”，是首个使用浮点减法和位操作相结合代替大量的高开销浮点乘法和除法的裁减算法。

优点：

1. 要处理的线段非常多，而实际显示在屏幕上的比较少时；
2. 可扩展到三维空间；

算法思路：

![img0][img0]图片来自交计图E文版

算法将四条屏幕的边无限延长，这样整个屏幕所在的平面被划分成了9个区域，并且进行编码，如上图所示。编码并非随意经行，假设四位编码为abcd，a位表征的是所有y值大于ymax的情况（大于的话就是1，小于为0），b位是所有y值小于ymin的情况（小于就是1，大于为0），c位表示所有x值大于xmax的情况，d位表示所有x值小于xmin的情况。屏幕所在区域（中间部分），全部为0。当给定一条线段后，首先对端点经行编码，端点在哪个区域就用哪个4位的编码表示即可。再次假设两个端点A、B的编码分别为：o1，o2.现在o1与o2之间就会存在下面四种情况：

1. o1=o2=0：两个端点都在中间区域，肯定不需要裁剪；
2. o1=0，o2!=0，或相反：说明有一个端点是在中间区域，另一个在外面，需要裁剪【注1】；
3. o1&o2!=0：说明两个端点在屏幕的同一外侧，这是可以完全丢弃的线段；
4. o1&o2=0：说明两个端点不在同一外侧，有可能横/斜穿中间区域，此时就需要经行裁剪【注2】；



> 【注1】：需要计算出线段与屏幕某条边缘的交点，之后使用在屏幕内的一部分；<br>
【注2】：需要先计算出一个端点与屏幕某条边缘的交点，然后再利用新计算的交点与另一个端点计算出第二个交点，最后使用两个交点中间的部分（也就是留在屏幕中的线段）；


#### Liang-Barsky Clipping

{{site.blank}}由于在图形学中对于线段的表示一般是使用参数形式（因为这种表达方式有很好的鲁棒性），那么可否从其参数中得到有关线段裁剪的启发呢？图一是个简单的线段与裁减窗口的示意图，从线段的参数方程可以知道四个绿点的alpha值肯定介于0到1之间，同时F点的alpha值应该大于E点的alpha值（假设从P0到P1），而如果小于的话，就像图二那样，此时线段根本不可能在裁剪区域内。所以整个算法的核心就是**在必要的时候计算alpha，然后比较EFGH四个绿点的alpha值的大小关系，从而确定是否裁剪与裁减范围。**该算法完全可以在其他方面使用，比如碰撞检测中射线是否与物体碰撞等，可以参考《Real time collision detection》E
文版P179页 5.3.3 Intersecting Ray or Segment Against Box。

![img1][img1]图一
![img2][img2]图二


这里[http://www.skytopia.com/project/articles/compsci/clipping.html][url0]有一篇关于该算法的很棒的文章，不过文章最后的完整代码中有一点可以优化的地方就是：for循环中计算r的值与下面的if判断可以互换，就像下面3,4行这样。

{% highlight c linenos %}
//others...
if (edge==3) {  p = ydelta;     q =  (edgeTop-y0src);   }   
if(p==0 && q<0) return false;   // Don't draw line at all. (parallel line outside)
r = q/p;

if(p<0) 
//others ...
{% endhighlight %}

### Sutherland-Hodgeman Clipping
{{site.blank}}上面的算法都是将线段数据传入，函数结束后得到的是最终的结果。整个函数体是将裁减区域看成一个4条直线组成的整体来对待，如果我们将他们拆开对待，变成4个子模块（这种情况下每个子模块也比较简单），每个模块处理一条具体的裁剪边。如此一来更适合流水线绘制结构，见下图；

![img3][img3]图片来自交计图E文版

## 光栅化

### DDA算法（数字微分分析器算法）
该算法就是利用自变量变化，计算因变量的值，从而确定必要的像素位置。看下图中斜率小的直线，自变量（假设是x轴）每次增加1，计算出来对应的y值，因为像素的位置是整数，所以将y四舍五入取整，得到图中可见的像“台阶”式的一组像素。但是当直线斜率大于1的时候（就像图中比较垂直的直线那样），每次计算出来的y值跨度太大，导致对应的像素不能连贯起来。解决的办法是当直线斜率大于1后，我们将直线方程的自变量、因变量互换（y值为自变量，每次增加1，计算x），这样就能解决。

![img4][img4]图片来自交计图E文版

### Bresenham算法

Bresenham算法网上说是DDA的改进，不过从算法的整体思路来看两者确实有些相似。首先他们都事先需要判断斜率是否大于1，是的话就需要互换两个变量；其次因变量也是以1为单位步进计算；
我这里打算从4个层面说下Bresenham算法：

1.约定：

监视器上有像素，像素是离散的，我们不会去说（0.3，0.3）像素在哪里，只会说（3，1）像素，但是我们在二维屏幕上说明一些问题的时候一般都是用卡尔坐标系，它是连续的，这并没有什么不妥。但是当我们不做人为约定的话，就会在理解上出现一时的紊乱，比如像下面两张图一样。

![b0][b0]
![b1][b1]

如果使用第一种坐标系的位置的话，那么区间$$\{x,y\mid x\in[3,4),y\in[1,2)\}$$是属于像素(3,1)的，如果使用第二种，那么区间$$\{x,y\mid x\in[2.5,3.5),y\in[0.5,1.5)\}$$是属于像素(3,1)的。下面所说算法约定使用第二种坐标系。

2.算法理论：

整个算法的核心就是利用好直线的斜率，很明显自变量每次增加1后，因变量肯定增加一个单位斜率的大小（或者一个单位斜率倒数的大小，如果变量互换的话），**这样的好处就是不需要代入直线方程计算出全新的y值。**然后我们利用历史上累计的y变化量与0.5做比较，根据比较的大小关系确定本次垂直像素的选取。
举个例子：假如射线从原点出发，斜率0.3。当自变量（针对该例应该选x）增加1个单位后，y增加0.3，0.3小于0.5，表示该点还没有“逃脱”像素(1,0)的范围，所以这点必须是像素(1,0)，如图十所示。

![b1][b10]图十

紧接着x值继续增加1，y历史变化0.3，此时再加上斜率0.3为0.6，比较后发现超出了0.5，于是全新的点(2,0.6)属于像素(2,1)，如图十一所示。

![b2][b11]图十一

此时y的历史变化值0.6就需要进行一次修正，因为0.6是针对像素(2,0)而言的，也就是说：以像素(2,0)来说，因变量的0.6表示向上增长了0.6个单位，但对于像素(2,1)而言，此时的因变量应该为0.6-1=-0.4，表示图中点M的y值相对于像素(2,1)的中心点在下方0.4个单位。如果继续增长想“逃脱”第二行像素(x,1)的范围，至少还需要0.5+(0.4)=0.9个单位。

修正就是减去1，从而y的历史变化值成了-0.4。如图十二所示

![b3][b12]图十二

循环继续，x继续增加1，y的历史变化值继续加上斜率0.3，变成了-0.1。比较后小于0.5，说明垂直像素不做变化，如图十三。

![b13][b13]图十三

后面依然还是循环（直到线段的另一个端点结束），从图十四中知道点Q的历史变化y为0.2+0.3=0.5，此前约定像素的范围得知点Q属于像素(5,2),修正后为-0.5。

![b14][b14]图十四

3.算法优化：

{{site.blank}}从上面的说明中可以看出，整个算法循环的部分是不停的增加因变量斜率值大小的数值，然后比较，条件成立的话修正因变量。虽然是些性能不错的加减法，但都是浮点运算，因此我们尝试给统一乘以一个具体的值，化浮点为整型。注意到直线斜率的计算是这样的：$$k=\frac{\Delta y}{\Delta x}$$，因此这个具体的值就是$$\Delta x$$

4.算法实现：

{% highlight c++ linenos%}
//pixelArray是数组的指针；
//这样写不太好，容易修改其他数据，而且不报错：。
static void bresenham_final(point2& p1, point2& p2, point2* pixelArray) {
	int dx = p2.x - p1.x;
	int dy = p2.y - p1.y;
	int x = p1.x;//自变量开始时候的值；
	int y = p1.y;//因变量开始时候的值；
	int finalX = p2.x;//自变量结束的值；
	bool swaped = false;
	float k = (float)dy / (float)dx;

	if (k>1.0f || k<-1.0f){
	 //这种情况下需要转换自变量、因变量：；
	 x = p1.y;
	 y = p1.x;
	 finalX = p2.y;
	 int tmp = dy;
	 dy = dx;
	 dx = tmp;
	 swaped = true;
	}

	const int stepX = dx / abs(dx);
	const int stepY = dy / abs(dy);
	dx = 2*abs(dx);
	dy = 2*abs(dy);

	int error = -dx>>1;//-0.5*2dx;
	while (x != finalX) {
	 if (swaped) {
		pixelArray->y = x;
		pixelArray->x = y;
	 }
	 else {
		pixelArray->x = x;
		pixelArray->y = y;
	 }
	 error += dy;//(dy/dx)*dx;
	 if (error > 0 ) {
		error -= dx;//1.0f*dx;
		y += stepY;
	 }
	 x += stepX;
	 pixelArray++;
	}
}
{% endhighlight %}

测试程序如下：
{% highlight c++ linenos %}
point2 p1 = { 0.0f,0.0f };
point2 p2 = {-600.0f,1000.0f };
//使用Bresenham直线算法计算出p1与p2之间的像素点坐标，存入m_p中（m_p是个一维数组）
ICG::bresenham_final(p1, p2, m_p);
//ICG::bresenham(p1, p2, m_p);

vec2 points[1000];
for (int i = 0 ; i < m_size; i++) {
	points[i].x=m_p->x / 1000;
	points[i].y=m_p->y / 1000;
	m_p++;
}
//然后将这些点以glDrawArray(GL_POINTS,0,1000)的形式绘制；
//...（略）
{% endhighlight %}

测试截图：
![b20][b20]



==TBC==

[img0]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_Cohen-Sutherland-Clipping.jpg "img0"
[img1]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_Liang-Barsky-Clipping0.jpg "img1"
[img2]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_Liang-Barsky-Clipping1.jpg "img2"
[img3]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_Sutherland-Hodgeman-Clipping.jpg "img3"
[img4]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_DDA.jpg "img4"
[img5]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_DDA.jpg "img5"
[b0]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_bresenham0.jpg "b0"
[b1]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_bresenham1.jpg "b1"
[b10]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_bresenham10.jpg "b10"
[b11]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_bresenham11.jpg "b11"
[b12]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_bresenham12.jpg "b12"
[b13]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_bresenham13.jpg "b13"
[b14]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_bresenham14.jpg "b14"
[b20]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_bresenham_screenshot.jpg "img20"
[url0]:http://www.skytopia.com/project/articles/compsci/clipping.html


