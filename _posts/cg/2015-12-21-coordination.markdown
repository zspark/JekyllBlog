---
layout: post_with_mathjax
title:  "坐标变换"
date:   2015-12-21
categories: jekyll work
published: true
excerpt: ""
meta: 
author: 
tags: [work 坐标变换]
---

*今天有同事问我一个坐标变化的问题，问题很基础，但对于不熟悉矩阵变换的朋友来说，就难以下手。*

## 问题描述

{{site.blank}}世界坐标系下有个容器（容器可认为是一个全新的局部坐标系），该容器原点相对世界的坐标为(x,y)，容器里面有个随机放置的蓝色方块，方块左上角相对容器坐标为(x1,y1)，大小为(w1,h1)，容器里面还有个红点，红点坐标相对容器为(x2,y2)。当方块围绕其中心点旋转A角度后，请问红点应该如何变换才能使其保持旋转前后相对于方块位置不变？即假如原来红点在方块右上角，方块旋转后红点‘看上去’依然要在方块右上角。

## 解决

### 建立全新坐标系与旋转矩阵

{{site.blank}}先建立以方块旋转中心为原点的全新局部坐标系，该坐标系位于容器空间内。现在方块要旋转，方块的旋转其实可以看作是新坐标系下的物体旋转而非新坐标系本身旋转，如果看作后者，那就要涉及到容器空间，不然没有父空间何谈旋转？所以新空间中物体的旋转就是典型的笛卡儿坐标系下的旋转非仿射空间的旋转，公式就是典型的：

$$
\left[ \begin{matrix} cos\theta & -sin\theta \\ sin\theta & cos\theta \end{matrix} \right ] \tag{1}
$$

### 坐标变换

{{site.blank}}第二步要做的就是将容器空间下的红点坐标映射到刚才建立的全新空间坐标系下，我们知道方块中心坐标旋转前后始终不变：$$(x1+w1*.5,y1+h1*.5)$$，那么从方块局部空间到容器空间的变换矩阵就应该是:

$$
\left[ \begin{matrix} 
1 & 0 & x1+w1/2 \\ 
0 & 1 & y1+h1/2 
\end{matrix} \right ] \tag{2}
$$

反之从容器空间到方块局部空间的变换就是其逆矩阵：

$$
\left[ \begin{matrix} 
1 & 0 & -(x1+w1/2) \\ 
0 & 1 & -(y1+h1/2) 
\end{matrix} \right ] \tag{3}
$$

{{site.blank}}如此问题便解决了，红点坐标$$(x2,y2)$$通过矩阵(3)变化到新建的局部空间内$$(x2-(x1+w1/2),y2-(y1+h1/2))$$,然后在经过局部空间下的旋转变化(1)计算出红点在旋转后的位置（相对于方块的局部空间）

$$
\left( \begin{matrix}
(x2-(x1+w1/2))*cos\theta - (y2-(y1+h1/2))*sin\theta ,\\ 
(x2-(x1+w1/2))*sin\theta + (y2-(y1+h1/2))*cos\theta 
\end{matrix} \right) \tag {4}
$$

最后将该方块空间下的坐标点变换到容器空间下，也就是与矩阵(2)相乘；

$$
\left( \begin{matrix}
(x2-(x1+w1/2))*cos\theta - (y2-(y1+h1/2))*sin\theta +(x1+w1/2),\\ 
(x2-(x1+w1/2))*sin\theta + (y2-(y1+h1/2))*cos\theta +(y1+h1/2)
\end{matrix} \right) \tag {4}
$$

### 注意

{{site.blank}}**以上变换全部是假设所有空间都没有缩放，初了方块旋转外，其他空间都没有旋转。**

### 测试截图

(方块没有旋转)

![Img][img_1] 图一
![Img][img_2] 图二

## 总结

{{site.blank}}以上变换其实就是仿射空间下一个最基本的子空间旋转问题，其基本思路就是现将子空间平移到父空间原点，然后旋转，最后再平移回原来的地方。


==EOF==

[img_1]:{{site.basepath}}/img/coordination/image_coor1.jpg
[img_2]:{{site.basepath}}/img/coordination/image_coor2.jpg
