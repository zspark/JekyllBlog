---
layout: post_with_wisdom_mathjax
title:  "《交互式计算机图形学》复习笔记-几何变换（下）"
date:   2016-01-01
category: CG
published: true
excerpt: ""
wisdom: 如果你以为用户是白痴，那就只有白痴才用它。 —— 李纳斯·托沃兹（Linus Torvalds），LINUX之父
meta: 
author: 
subImgPath: cg\cg3\
tags: [计算机图形学 computer-graphics cg CG]
---
==TBC==

### 绕任意给定直线的旋转

{% include image.html src="cg/cg3/image_cg3_rotate_line_0.jpg" caption="图3.56 来自《交互式计算机图形学》E文本" width="232" height="237" align="left" %}
{{site.blank}}这个问题比起上一节明显具体多了，我们不去计较物体到底是围绕着给定的直线旋转还是物体围绕着以给定直线的方向为轴自己的重心旋转，这都不重要，这节的重点就是我给你一个方向，并且指定一个物体，要你沿着这个方向旋转这个物体。我们此前的讨论都是围绕物体如何绕标架的某一个具体的基的分向量旋转，说到这里可能会有灵感爆发：绕任意直线的旋转可以分成两步，第一步想办法通过一个矩阵N将给定直线旋转到与某一条基的分量平行的状态；第二步就是之前的旋转M。计算出来后，将他们级联（注意顺序），就是最后的变换矩阵了。**看完交计图第三章，第四章多遍后，结合网络上的其他文章，就会发现Edward有意将级联思想灌输给读者：任何复杂的变换，我们都可以用许多基本的变化通过级联的方式得到最终的变换矩阵。这个思想我觉得很重要，一来方便硬件流水线化计算，二来很清晰的展现了矩阵变化的思想，三来有助于理解复杂变换。**

{{site.blank}}我们先将“直线”抽象为“单位向量”，并且将空间中这条向量平移到起始点与标架原点重合的位置。紧接着将向量旋转到xoz平面。除了将直线围绕z轴以外，围绕x轴也可以，不过大家都采用x轴。我们知道旋转的矩阵是这个样子：

$$
M=\left[
\begin{matrix}
cos\theta,-sin\theta\\
sin\theta,cos\theta\\
\end{matrix}
\right]
$$

其中$$\theta$$就是要旋转的角度。从矩阵完全可以知道，我们不需要明确的计算出来$$\theta$$是多少度，只需要知道$$cos\theta$$与$$sin\theta$$即可。

{% include image.html src="cg/cg3/image_cg3_rotate_line_1.jpg" caption="图5.37 来自《交互式计算机图形学》E文本" width="233" height="237" align="left" %}
见图3.56，我们只需要将向量l旋转$$\theta_x$$角度后，就能到xoz平面。而$$\theta_x$$就是向量d与z轴之间的夹角，而d是l在yoz平面的投影。这样一来$$cos\theta_x$$与$$sin\theta_x$$都能算出来，分别是：

$$cos\theta_x = {\alpha_z \over \|d\|},sin\theta_x = {\alpha_y \over \|d\|}$$

写成矩阵形式：

$$
M=\left[
\begin{matrix}
1,0,0,0\\
0,{\alpha_z \over \|d\|},-{\alpha_y \over \|d\|},0\\
0,{\alpha_y \over \|d\|},{\alpha_y \over \|d\|},0\\
0,0,0,1\\
\end{matrix}
\right]
$$


图3.57就是将l旋转到xoz平面后的图像，**我当年这里有个小小的理解错误，就是将图中淡绿色向量（就是l）理解成了图3.56中l在xoz平面的投影了，大家注意，图3.57中的l不是原来的投影，而是向量l旋转$$\theta_x$$后的位置。**现在就是将图中向量l再次旋转到与z轴重合，很明显通过围绕y轴就可以做到，图中所示旋转$$\theta_y$$度便是，明显能够知道：

$$cos\theta_y = {\|d\| \over \|l\|} = \|d\|,sin\theta_y = {\alpha_x \over \|l\|} = \alpha_x$$

$$
M=\left[
\begin{matrix}
\|d\|,0,-\alpha_x,0\\
0,1,0,0\\
\alpha_x,0,\|d\|,0\\
0,0,0,1\\
\end{matrix}
\right]
$$

**看完这个矩阵，如果不假思索，可能会觉得两处$$\alpha_x$$的符号应该互换。但实际情况是不互换，不要被图3.57中的$$\theta_y$$角度所欺骗，它只是标注了需要旋转的角度，实际情况是向量l旋转了$$-\theta_y$$度。**

最后再沿着z轴旋转，这之前我们讨论过。

### uniform变量
第三章后面捎带说了下shader中的uniform变量，它是用来修饰变量的，从单词意思就初步能了解该变量在一帧渲染的过程中是不变的。

{% highlight glsl linenos%}
uniform float utime;
attribute vec4 vPosition;
void main(){
	vPosition.x=(1+sin(utime));	
	gl_Position=vPosition;
}
{% endhighlight %}

shader中uniform变量的值是这么与应用程序关联的：

{% highlight c++ linenos%}
GLint timeParam;
timeParam = glGetUniformLocation("utime");
glUniform1f(timeParam,100.0);
{% endhighlight %}

## 总结
{{site.blank}}本章主要是变换，我觉得主要抓住对不同仿射空间变换的理解为主，这将为第四章铺好道路，章节最后出现了四元数，这小部分内容对于交计图的基础部分（一到七章）没有用，应该到更后面的层级建模、过程建模里面讲到骨骼的时候可能会更多的用到。

==EOF== 


