---
layout: post_with_mathjax
title:  "极坐标下曲线长度微分公式的思考"
date:   2016-06-04
category: math
published: true
excerpt: ""
meta: 
author: 
tags: [math polar-coordination]
---
{{site.b}}前一段时间在乱翻高数的时候看到了笛卡尔坐标系下的曲线微分公式，或者叫弧微分公式：$$ds=\sqrt{1+y'^2}dx$$，当时并没有想到极坐标下的形式。最近在某数学群中有人说起极坐标下的弧微分公式，并且给出了公式，说该公式很普遍，于是我想推导一番。


## 微元

{% include image.html src="math/polar/math_thinking_1_2.jpg" caption="图1 极坐标系下的曲线形状，方程为&rho;=4&theta;" with="246" align="right" %}

{{site.b}}微分中自变量与因变量的微元是什么意思？就是一个极小的变化量，他们之间还有一定的关系，这个系数就是导数。比如函数$$y=4x$$，微元之间的关系就是$$dy=4dx$$，也就是说自变量变化一个微单元，因变量就需要变化4倍于它的单元，并且这个变化是线性的（从函数曲线图中就能看出来）。再比如函数$$y=x^2$$，微元之间的关系就是$$dy=2xdx$$，此时的自变量微元变化与因变量微元之间不是线性的，而是随着自变量具体值而不同。具体点说就是，取x=3，此时微元之间的关系是$$dy=6dx$$。说这些的重点是：微元之间有关系，这种关系可能随着自变量的不同而不同。如论如何：微元就是变化量。

{{site.b}}下面我简单记录下自己对其的推导。如右图所示，假设该极坐标系下的方程为$$\rho=a\theta (a>0)$$，微元等式为$$d\rho=ad\theta$$，在任意$$\theta$$与$$\theta+d\theta$$时刻该曲线上的两点BC如图2所示，图中已经标出了相关的变量。因为圆周弧长、半径与夹角的公式为$$s=r\theta$$，在微观情况下，其弦长与弧长是相等的，所以我们认为图中DB长度就是$$DB=da=\rho d\theta$$，又因为$$d\theta$$足够小，所以图中DB与DC是垂直的（不要在意图中的情况），这样一来弧长为：

$$CB=ds=\sqrt{da^2+db^2}=\sqrt{\rho^2(d\theta)^2+db^2}$$

{% include image.html src="math/polar/math_thinking_1_1.jpg" caption="图2 微观下曲线示意图" with="333" align="right" %}

公式中db是什么？就是我们上面分析的因变量的变化量，即：自变量从$$\theta$$开始，增加一个$$d\theta$$后，因变量便从$$\rho$$增加了自变量的$$\rho'(\theta)$$倍，现在全部带入公式中。

$$ds=\sqrt{\rho^2(d\theta)^2+db^2}=\sqrt{\rho^2(d\theta)^2+\rho'^2(d\theta)^2}=\sqrt{\rho^2+\rho'^2}d\theta$$

{{site.b}}这样我么便得到了极坐标下弧长微分公式，其形式与笛卡儿坐标系下的弧长公式相同。从公式中我们很容易能推导出圆周长公式，设圆的半径为R，那么该圆在极坐标系下的方程为$$\rho=R$$，带入公式得到$$ds=\rho d\theta$$，积分得到周长为：$$C=2\pi R$$







==EOF==









