---
layout: post_with_mathjax
title:  "群聊天逆矩阵记录"
date:   2016-03-04 10:27
categories: jekyll math
published: true
excerpt: ""
meta: 
author: 
tags: [math,inverse-matrix]
---
{{site.blank}}昨天在计算机图形学群中聊天，有人问$$\left[\begin{matrix}R,T\\0,1 \end{matrix}\right]$$怎么求逆。看完觉得这岂不简单，用伴随矩阵就可以做到，但担心他可能有其他想法，便说“伴随矩阵啊，还是你想知道什么更简便的方法？”，后面就闲聊了几句。突然另一朋友写出这样一个公式，一开始给我愣在那里，什么意思一时间就是看不懂，等静下心来完整推导后一切明了，公式不错，点赞。

$$
\left[
\begin{matrix}
R,P\\
0,1
\end{matrix}
\right]
\left[
\begin{matrix}
R^\top,X\\
0,1
\end{matrix}
\right]
=
\left[
\begin{matrix}
RR^\top,RX+P\\
0,1
\end{matrix}
\right]
$$

因为R为旋转矩阵，所以$$RR^\top=1$$，如果我们能使$$RX+P=0$$的话，上面等号左边的第二个矩阵就是第一个矩阵的逆矩阵了。

$$
RX+P=0;\\
RX=-P;\\
X=-R^\top P;
$$

将平移矩阵X带入上面的矩阵，于是就得到了逆矩阵：

$$
\left[
\begin{matrix}
R^\top,-R^\top P\\
0,1
\end{matrix}
\right]
$$

我觉得这个方法应该源自矩阵分块化求逆的推演，分块化矩阵求逆有这样的公式（注意前提条件：A、B为可逆矩阵）：

$$
{
\left[
\begin{matrix}
A,C,\\
0,B
\end{matrix}
\right]
}^{-1}
=
\left[
\begin{matrix}
A^{-1},-A^{-1}CB,\\
0,B^{-1}
\end{matrix}
\right]
$$

这里取矩阵B为1阶单位阵，再加上旋转矩阵是正交矩阵的特点，很容易得出与上面相同的逆矩阵。

[qicifangchen_baidu]:http://baike.baidu.com/link?url=XI8RIoMTxQa7NY8MYqHNJhLU7fpd8yDVvS1f8bGWQAQ2cZ1vOmDmq3HuvoxfbvBHfqxLRSTmuu0GbPMdmlz7na
==EOF==








