---
layout: post_with_wisdom_mathjax
title:  "凸包及其算法（二）"
date:   2015-06-25
category: CG
published: true
excerpt: ""
wisdom: 计算机科学就是有关计算机的，正如天文学就是有关望远镜的。—— 艾兹格·迪杰斯特拉（Edsger W. Dijkstra），荷兰计算机科学家，最短路径算法提出者
meta: 
author: 
subImgPath: convex-hull\
tags: [collision-detection Computer algorithm convex-hull quick-hull]
---
==TBC==

凸包及其算法（一）[点击这里][urlpre]

### 快包算法(quick-hull-algorithm)

{{site.blank}}看过《实时碰撞检测算法技术》中的快包算法与维基百科中的算法，其中虽有部分出入，但本质一样：都是由内而外，膨胀到点集的边缘。不过《实时碰撞检测算法技术》一书中说为了快包算法健壮性，需要考虑两点：

1. 首次逼近四边形计算的时候，需要考虑到其退化情况，比如一个三角形或者一条直线；
2. 最远点不止一个的问题；

{{site.blank}}书中说为了考虑到四边形有可能退化的问题，需要算法注意首次逼近构造四边形的退化情况。这条明显过虑了，因为后期当图形被迭代‘充气’的时候，都是计算距离边（三维的话是面）最远的点，如此一来的话，先前的四边形就是画蛇添足，完全可以一开始就仅仅构造一条直线（边），然后向两边“充气”。第二条在我们熟悉了算法之后再看；

我们还是使用前面的点集，来具体看一下快包算法的过程，点集如下所示。

{% include image.html src="convex-hull/image4.jpg" caption="图1 随即点形成的一个点集" width="423" height="361" align="center" %}

首先计算出肯定在凸包上的2个点，比如是顶点H、E，它们构成初始边g，此时所有的其他顶点被分割成2部分：绿色与蓝色，见图2

{% include image.html src="convex-hull/image_qh4.jpg" caption="图2 遍历找到给定方向下的两个凸包边缘点" width="423" height="361" align="center" %}

后边要做的就是2部分，一部分遍历绿色的点直到完毕，另一部分就是遍历蓝色的点直到完毕，就拿蓝色来说。先找到距离直线g最远的顶点F，F肯定也是在凸包上的点，这个计算完毕后，肯定形成2条新的边h与i，见图3

{% include image.html src="convex-hull/image_qh5.jpg" caption="图3 找到蓝点集中距离HE直线最远的点" width="423" height="361" align="center" %}

后边的计算就与初始边的计算一样了，依次计算新的边对应的最远顶点，我们就得到了点C与B，至此蓝色点群遍历完毕；

下面就是计算绿色的点，步骤与上面一样。

#### 注意点

1. 新形成的边（比如h边），它是怎么确定自己寻找的方向是朝向C而不是反方向？
2. 寻找最远点的过程中，是要遍历点集的，如何减少遍历？

{{site.blank}}在我经验里面，所有涉及到“哪一边”的图形图像问题，一定要把握好**初始点**与**结束点**还有**方向**即可，比如我们明确在这个快包算法中，一律使用‘左边’，那么第一次找到的点F如果说要在初始边g的‘左边’的话，那么此时的初始边肯定是E为起始点，H为终点的边；当我们产生2条新边h与i之后，要保证以后检测的方向依然是“左边”的话，需要明确边h的起始点是E，终点是F，边i的起始点是F，终点是H；
大家肯定能想到当计算绿点群的时候，只需要将初始边方向改变就行了。所以没有必要调用2次函数，甚至写相同逻辑两边，当然这不是重点；

现在说下《实时碰撞检测算法技术》提到的第二条。见图4

{% include image.html src="convex-hull/image_qh6.jpg" caption="图4 最远点不止一个的问题" width="423" height="361" align="center" %}

{{site.blank}}当我们为某条边（图中是边g）寻找最远点的时候，发现除了点F外还有M，K，L这三个点并驾最远，这时快包算法的策略是取距离这条边（边g）两个顶点（E，H）最近的点，从图中看出，距离E最近的是L，距离H最近的是M，此两者选其一即可。有朋友可能会想到如果点K与点L距离点E一样远怎么办，比如E位于K，L两点的垂直平分线上？
稍微分析一下就知道这种情况不可能发生，如果有的话当初的点E就不可能被找到，代之的应该是图中的点L了。专业点说就是当E，H确定了后，其他所有的点都肯定位于边g的面域中，而非点域。

#### 具体实现（AS3）

{% highlight as3 linenos%}

{% endhighlight %}
(暂略)


#### 算法分析
快包的时间复杂度最好的情况下是：

$$
\begin{align}
T(n)&=2T(n/2)+O(n)\\
&=O(nlogn)\\
\end{align}
$$

{{site.blank}}上面公式计算起来可能不太容易，可参考《数据结构与算法分析--C语言描述》书中对于快速排序的时间复杂度计算。话说回来，该算法正因为叫快包算法，其快`quick`就是来自`快速排序quick sort`，两者原理相同。

最差的情况下是：

$$
\begin{align}
T(n)&=T(n-1)+O(n)\\
&=O(n^2)\\
\end{align}
$$


##### 质疑
{{site.blank}}[这里][url2]有篇关于凸包的博文，其中提到关于快包算法的时间复杂度最快能够达到O(n)的级别，我对此很质疑，快包算法就计算第一条分割线而言，怎么着也要O(n)的时间复杂度，更何况递归才刚刚开始。


### 相关资料：

[维基百科(https://en.wikipedia.org/wiki/Quickhull)][url_wiki_quickhull]

[http://www.personal.kent.edu/][url1]

==EOF==

[url_wiki_quickhull]:https://en.wikipedia.org/wiki/Quickhull
[urlpre]:http://www.zspark.net/jekyll/cg/2015/06/25/convex-hull-1.html
[url1]:http://www.personal.kent.edu/~rmuhamma/Compgeometry/MyCG/ConvexHull/quickHull.htm
[url2]:http://www.cnblogs.com/Booble/archive/2011/03/10/1980089.html




