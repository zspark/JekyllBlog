---
layout: post_with_mathjax
title:  "微分中值定理与导数的应用"
date:   2016-05-09
category: math
published: true
excerpt: ""
meta: 
author: 
tags: []
---
~同济大学高等数学第六版第三章~

## 微分中值定理

### 费马（Fermat）引理
{{site.b}}设函数f(x)在点x0的某邻域U(x0)内有定义，并且在x0处可导，如果对任意的x属于U(x0)，有f(x)<=f(x0)或(f(x)>=f(x0));
那么f'(x0)=0;


### 罗尔（Roll）定理

{{site.b}}如果函数f(x)满足

1. 在闭区间[a,b]上连接；
2. 在开区间(a,b)内可导；
2. 在区间端点处的函数值相等，即f(a)=f(b);

那么在(a,b)内至少有一点c，使得f'(c)=0;

### 拉格朗日（Lagrange）中值定理

{{site.b}}如果函数f(x)满足：

1. 在闭区间[a,b]上连续；
2. 在开区间(a,b)内可导；

那么在(a,b)内至少有一点&xi;(a<&xi;<b),使等式f(b)-f(a)=f'(&xi;)(b-a);

### 泰勒中值定理（Lagrange中值定理的推广）

{% include image.html src="math/Taylor.jpg" caption="泰勒中值定理" width="727" align="center" %}


### 柯西中值定理

{{site.b}}如果函数f(x)及函数F(x)满足：

1. 在闭区间[a,b]上连续；
2. 在开区间(a,b)内可导；
3. 对任一x属于(a,b)，F'(x)!=0;

那么在(a,b)内至少有一点&xi;,使等式(f(b)-b(a))F'(&xi;)=(F(b)-F(a))f'(&xi;);


## 洛必达法则
{{site.blank}}当遇到求解$${0\over0}$$或者$${\infty \over \infty}$$的极限时（未定式），我们可以根据一定的前提条件，利用洛必达法则求解。

### 定理一
设：

1. 当x->a时，函数f(x)及F(x)都->0；
2. 在点a的某去心邻域内，f'(x),F'(x)都存在且F'(x)!=0;
3. $$ \lim_{x\to a}\frac{f'(x)}{F'(x)}存在或为0； $$（不存在还计算它做什么）；

则：
$$
\lim_{x\to a}\frac{f(x)}{F(x)}=\lim_{x\to a}\frac{f'(x)}{F'(x)}
$$

### 定理二
设：

1. 当x->&infin;时，函数f(x)及F(x)都->0；
2. 当\|x\|>N时f'(x)与F'(x)都存在，且F'(x)!=0;
3. $$ \lim_{x\to \infty}\frac{f'(x)}{F'(x)}存在或为0； $$（不存在还计算它做什么）；

则：
$$
\lim_{x\to \infty}\frac{f(x)}{F(x)}=\lim_{x\to \infty}\frac{f'(x)}{F'(x)}
$$

等价无穷小：

$$
e^x\sim1+x\\
e^x-1\sim x\\
sinx\sim x\\
tanx\sim x\\
ln(1+x)\sim x\\
x-ln(1+x)\sim {1\over2}x^2\\
1-cosx\sim{1\over2}x^2\\
arcsin(x) \sim x\\
arctan(x) \sim x\\
$$

## 泰勒公式
{% include image.html src="math/Taylor.jpg" caption="公式（3）便是泰勒公式" width="727" align="center" %}

### 麦克劳林公式：
{% include image.html src="math/McLaughlin.jpg" caption="麦克劳林公式" width="733" align="center" %}

### 实例：
{% include image.html src="math/McLaughlin_example.jpg" caption="实例1" width="810" align="center" %}

## 曲率

### 弧微分公式

$$ds=\sqrt{1+y^{'2}}dx$$

学习曲率公式的推导。
曲率圆，曲率中心，去路半径；

## 方程的近似解
根的隔离，隔离区间，

* 二分法：找出一个隔离区间，折半查找f(x)的值，根据符号缩小隔离区域，继续折半查找、计算，直到得出想要的精度；
* 切线法：找出一个隔离区间。计算二价导数，从其符号确定选取的端点（函数值与二阶导数相同的符号的端点）。计算切线与y=0的交点，缩小区间，重复计算；

## 总复习题
{% include image.html src="math/example01.jpg" caption="实例2" width="479" align="center" %}


## 不足

* 证明不等式能力弱，可能需要劲量寻找具体的函数;
* 有逻辑就按照方法证明;

==EOF==









