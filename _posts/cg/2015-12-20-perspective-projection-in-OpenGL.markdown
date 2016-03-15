---
layout: post_with_wisdom_mathjax
title:  "OpenGL中的透视投影"
date:   2015-07-26
category: CG
published: true
excerpt: ""
wisdom: 知识最大的敌人不是无知，而是错觉。—— 斯蒂文·霍金（Stephen Hawking）
meta: 
author: 
subImgPath: cg\perspective_projection\
tags: [计算机图形学 computer-graphics cg CG]
---

{{site.blank}}下面记录下自己对OpenGL中透视投影的推导过程。透视投影就是大家常见的，投影后看起来很自然的有“近大远小”视觉效果的投影，远处的物体之所以投影后要变小，是因为距离相比其他物体要远（距离透视中心COP），这就给我们一个处理透视投影的思路：可以用距离来决定物体要缩放多小。

## 透视投影

{% include image.html src="cg/perspective_projection/image_pers_0.jpg" caption="《交互式计算机图形学》英文版截图" width=400 align="right" %}
{{site.blank}}问题的核心依然是利用一个怎样的矩阵，可以将自定义的四棱台变换到CVV下（预备知识参考[这里][mysiteurl1]），不要忘记我们变换的重要思想：**级联**。所以我们完全可以这样推导：先尝试将四棱台变换成平行投影下的轴平行立方体，然后利用平行投影的知识级联得出结果。公式如下：

$$M_{pers}=M_{ortho}N$$

其中矩阵N就是我们想要求出的“尝试将四棱台变换成平行投影下的轴对齐立方体”的矩阵。假如应用程序规定了像右边这样的四棱台（注意near与far仅仅表示到COP的距离），我们先从其俯视图开始，参见图一。

{% include image.html src="cg/perspective_projection/image_pers_10.jpg" caption="图一 四棱台俯视图" width=563 align="right" %}

{{site.blank}}从程序给定的right、left等数据中，我们不能确定四棱台一定就是个正四棱台（z轴对称），但图中的顶点的基本数据我们可以通过三角形相关定理很容易的推导出来，我们的目的就是要将ABCD变成A'BCD'。拿图中普遍的顶点E来说，它需要变换到E'处，所要变化的只有x轴上的值（俯视图下，不考虑y数值），z轴不需要变化。变化的函数便是：

$$ x'=f(x)={\frac{x*near}{-z}} $$

公式表明，只要我们将四棱台上的任何一个点进行这样的变化后，原来顶点所构成的四棱台就会变成一个四方体，而且还是轴对齐的四方体。这让我们非常开心，因为就只需要如此简单的一个计算整个透视投影就可以完成。我们现在尝试将变化写成矩阵的形式：
$$
N_1=
\left[
\begin{matrix}
\frac{-near}z,0,0,0\\
0,1,0,0\\
0,0,1,0\\
0,0,0,1
\end{matrix}
\right]
$$

图4.36的侧视图（y与z轴关系）推导与图1一样，整体下来y的变化函数如下：

$$y'=f(y)={\frac{y*near}{-z}}$$

级联到上面的$$N_1$$矩阵里面就是：
$$
N_1=
\left[
\begin{matrix}
\frac{-near}z,0,0,0\\
0,\frac{-near}z,0,0\\
0,0,1,0\\
0,0,0,1
\end{matrix}
\right]
$$

{{site.blank}}$$N_1$$矩阵就数学上而言没有问题，但是我们设计一个矩阵，其目的就是希望批处理一堆数据，而此时的矩阵$$N_1$$是每个顶点各不相同，因为里面有z值。整个逻辑是先确定顶点，然后才能通过顶点的z值确定矩阵，完事再变化。而不是流水线想要的先确定一个固定的矩阵，然后一堆顶点一个一个接受变化。所以我们需要变一变。

{{site.blank}}通过尝试我们会发现，无法确定一个“整个批次不变”的常规矩阵来完成上面的函数变化，但办法总比问题多。前辈们通过一个叫“透视除法”的后期运算完成了想要的过程。整个逻辑是这样的：

{{site.blank}}我们在计算机图形学中使用的点与向量都是四维的，向量没有位置，w分量是0，点有位置w分量是1，w分量除了0，1以外没有其他值的存在，我们何不在透视投影中利用w分量先保存一些有用的信息，等后期再利用！于是上面的函数关系分成两步，第一步先乘以near，第二步除以-z。矩阵如下：

1. 先乘以near,同时将该顶点的-z值先保存在w分量里面：
$$
P'=N_2\times P=
\left[
\begin{matrix}
near,0,0,0\\
0,near,0,0\\
0,0,1,0\\
0,0,-1,0
\end{matrix}
\right]P
$$

2. 等需要的时候再除以w分量:
$$
P''=\left(
\begin{matrix}
P'.x/P'.w\\
P'.y/P'.w\\
P'.z\\
P'.w/P'.w
\end{matrix}
\right)
\tag{1.1}
$$

**上面w分量也除以w分量是因为三维空间中的点的w分量是1（前面说过，不能是其他值）**

上面等式同样没有问题，但我们需要联系理论与实际：

* 理论上说，一个矩阵与标量进行乘法或者除法运算的话，是矩阵中的所有分量进行相同的乘除运算，而不是某几个分量；
* 实际上说，也没有哪一个硬件是针对某几个分量进行并行运算，除非私人订制；

所以上面的等式(1.1)在执行除法的时候应该是所有值都被除，就像下面这样：
$$
P''=
\left(
\begin{matrix}
P'.x/P'.w\\
P'.y/P'.w\\
P'.z/P'.w\\
P'.w/P'.w
\end{matrix}
\right)
=
\left(
\begin{matrix}
P'.x/P'.w\\
P'.y/P'.w\\
P'.z/P'.w\\
1
\end{matrix}
\right)
\tag{1.2}
$$

这样一来的话，我们点$$P''$$的z值经过矩阵$$N_2$$变化、再经过透视除法后，成了-1，原来的z值不见了，而且可以想到的是，自定义视见体中的所有的点的z值全部变成了-1。他们全部落在了一个z=-1的平面上，如果我们不需要深度测试的话，这样完全可以，问题是我们不可能不需要后期的深度测试，不然视见体中的物体谁该挡住谁怎么区分，现在所有点的z值一样，你说谁在谁后面？！所以我们必须保留原始的z值，最起码保留其大小关系，好让后期深度测试的时候判断。

{{site.blank}}我们将精力回到矩阵$$N_2$$上，因为我们的点通过该矩阵后丢掉了z值的信息，具体来说是矩阵第三行。P'的z值与P的z值一样，于是通过透视除法变成了-1。假如P'的z值是c，透视除法后我们想让它是原来的P.z，必然有这样的等式：下面假设P点坐标为(x,y,z,w),P'坐标为(x',y',z',w').

$$
c/w'=z;
$$

而c值是我们通过将矩阵$$N_2$$的第三行变成0，0，a，b来计算的。（因为我们不想让P'的z分量与P的x，y分量有函数关系，所以前两个分量为0.），等式如下：

$$
P'=N_3\times P=
\left[
\begin{matrix}
near,0,0,0\\
0,near,0,0\\
0,0,a,b\\
0,0,-1,0
\end{matrix}
\right]P
$$

$$
z'=a*z+b*w;\\
z'/w'=-\frac{a*z+b*w}{z}=z;\\
$$

$$
z^2+az+b=0;\tag {1.3}
$$

从上面的推导中可以知道，近裁减面（图1中的nearplane）的右上角点C(right,top,-near)，通过矩阵$$N_3$$后，还是这个点；而远裁减面（图1中的farplane）右上角的点D$$\left({right*far\over{near}},{top*far\over{near}},-far\right)$$，通过$$N_3$$后，需要变换到D'$$\left(right,top,-far\right)$$的位置。将这两个关联的点带入等式(1.3):

$$
\begin{cases}
n^2-an+b=0;\\
f^2-af+b=0;\\
\end{cases}
$$

解方程得到：

$$
\begin{cases}
a=n+f;\\
b=nf;\\
\end{cases}
$$

带入矩阵$$N_3$$，得到最终的形式：

$$
N_3=
\left[
\begin{matrix}
near,0,0,0\\
0,near,0,0\\
0,0,n+f,nf\\
0,0,-1,0
\end{matrix}
\right]
$$

### 级联$$M_{ortho}$$矩阵
{{site.blank}}现在级联起来平行投影矩阵$$M_{ortho}$$，

$$
M_{pers}=M_{ortho}N_3=
\left [
\begin{matrix}
\frac {2}{right-left},0,0,-\frac{left+right}{right-left}\\
0,\frac {2}{top-bottom},0,-\frac {bottom+top}{top-bottom}\\
0,0,-\frac {2}{far-near},-\frac{near+far}{far-near}\\
0,0,0,1\\
\end{matrix}
\right ]\times
\left[
\begin{matrix}
near,0,0,0\\
0,near,0,0\\
0,0,n+f,nf\\
0,0,-1,0
\end{matrix}
\right]=
\left [
\begin{matrix}
\frac {2near}{right-left},0,\frac{left+right}{right-left},0\\
0,\frac {2near}{top-bottom},-\frac {bottom+top}{top-bottom},0\\
0,0,\frac {-(near+far)}{far-near},\frac {-2near*far)}{far-near}\\
0,0,-1,0\\
\end{matrix}
\right ]
$$

至此就算从级联的角度推导了透视投影的矩阵，可能有童鞋会说`透视除法`怎么没有，因为它就是个标量与矩阵的除法运算，什么时候都可以，不影响矩阵级联。网络上还有使用其他方式推导的，大家可自行google。

## 简单的测试

应用程序中的定点数据；
{% highlight C++ linenos %}
void case3() {
 const float SIZE = 4.5;
 const float SIZE2 = 3;
 vec4 vertices[8] = {
	vec4(SIZE,-SIZE,-SIZE2,1),//A,0
	vec4(SIZE,-SIZE,-8,1),//B,1
	vec4(SIZE,SIZE,-SIZE2,1),//C,2
	vec4(SIZE*2,-SIZE,-SIZE2,1),//D,3
	vec4(SIZE*2,SIZE,-8,1),//E,4
	vec4(SIZE,SIZE,-8,1),//F,5
	vec4(SIZE*2,-SIZE,-8,1),//G,6
	vec4(SIZE*2,SIZE,-SIZE2,1),//H,7
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

顶点着色器
{% highlight glsl linenos %}
#version 430
in vec4 vPosition;
out vec4 fColor;
in vec4 vColor;
void main(){
 fColor=vColor;

 float l=-8;float r=8; 
 float b=-8;float t=8;
 float n=2; float f=9;

 //平行正投影矩阵;(注意GLSL中的矩阵是列优先矩阵)
 mat4 m=mat4(
	2.0/(r-l),0,0,0,
	0,2.0/(t-b),0,0,
	0,0,-2.0/(f-n),0,
	-(l+r)/(r-l), -(b+t)/(t-b), -(n+f)/(f-n),1
 );

 //将四棱台转换后轴对齐立方体的矩阵
 mat4 N=mat4(
	n,0,0,0,
	0,n,0,0,
	0,0,n+f,-1,
	0,0,n*f,0
 );

 gl_Position=m*N*vPosition;
}
{% endhighlight %}

### 测试截图

{% include image.html src="cg/perspective_projection/image_pers_14.jpg" caption="最后成像图" width=800 align="center" %}



==EOF==

[mysiteurl1]:{{site.basepath}}jekyll/cg/2015/07/25/parallel-projection-in-OpenGL.html
