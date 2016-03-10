---
layout: post_with_wisdom_mathjax
title:  "微分方程（二）"
date:   2015-11-11 21:47:48
categories: jekyll math
published: true
excerpt: ""
wisdom: 如果你以为用户是白痴，那就只有白痴才用它。 —— 李纳斯·托沃兹（Linus Torvalds），LINUX之父
meta: 
author: 
tags: [math,微分方程,differential-equation]
---

*我一遍遍的回味着基础学科的知识，只因为它们太深奥。*

## 齐次方程

{{site.blank}}许多数学科目中都提到“齐次”这个概念，笼统来说可以参见[这里][qicifangchen_baidu]，这里需要强调的是，微分方程中的“齐次”指的不仅仅是各项变量次数之和相等，而是一定要化成

$${dy\over dx}=\varphi (\frac yx)$$

这种形式的方程。

{{site.blank}}求解一阶齐次微分方程的基本原则就是利用变量替换，将不能“变量分离”的状态，转换成能变量分离的状态。从上式可见，这个替换方案就是

$$u=\frac yx$$

如此一来$$dy\over dx$$可变成$${du\over dx}x+u$$，带入方程就得到“可分离变量的微分方程”；

## 一阶线性微分方程

{{site.blank}}对于未知函数y及其导数是一次的方程叫做一阶方程，如果常数项又不涉及y，那么就是一阶线性微分方程方程

{{site.blank}}数学上常用**常数变易法**来求解这种方程，常数变易法让我始终有意无意的联想到仿射空间下的移动：尽管常数项可以是自变量的函数，但毕竟与因变量y无关。纵观整个微分方程，其通解都会出现额外常数项，从而形成`微分方程积分曲线`，这条曲线会随着常变量的不同而平移到不同的位置，原来的一阶线性微分方程的解会不会是常数项在某一具体值下的图像。

{{site.blank}}整个**常数变易法**的过程，就是先求的齐次线性方程的通解，再替换常数项为自变量x的函数$$u=\varphi(x)$$，从而假设这个关于y的新的普通方程是原来一阶线性微分方程的一个特解，带入原方程从而解得变量u，就得到了方程的通解；

==EOF==

[qicifangchen_baidu]:http://baike.baidu.com/link?url=XI8RIoMTxQa7NY8MYqHNJhLU7fpd8yDVvS1f8bGWQAQ2cZ1vOmDmq3HuvoxfbvBHfqxLRSTmuu0GbPMdmlz7na


