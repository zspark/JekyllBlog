---
layout: post_with_wisdom_mathjax
title:  "凸包及其算法（一）"
date:   2015-06-25
categories: jekyll technical
published: true
excerpt: ""
wisdom: 计算机科学就是有关计算机的，正如天文学就是有关望远镜的。—— 艾兹格·迪杰斯特拉（Edsger W. Dijkstra），荷兰计算机科学家，最短路径算法提出者
meta: 
author: 
tags: [collision-detection Computer algorithm convex-hull gift-wrapping]
---

*学习物理碰撞相关的理论，凸包`convex hull`是绝对逃避不了的一个术语。*

##凸包的概念##

>在一个实数向量空间V中，对于给定集合X，所有包含X的凸集的交集S被称为X的凸包。（来自：[百度百科][1]）

{{site.blank}}上面概念就是说：凸包是凸集的子集，且是包含集合X的最小的子集；按照坊间通俗的话来说就是把所有的点用橡皮筋圈起来，橡皮筋形成的那个凸多边形就是这些个点集的凸包。

![hull][img1] 图 1（图片来源：百度百科）

{{site.blank}}这样的直观解释不能说不对，但显然不太考究，他会将读者的理解集中在“橡皮筋”之上，认为那个多边形的边就是凸包的实体。但是我们从概念上理解的话明显实体还要包括里面的东西（最小的凸集）。故此凸包是整个面而不仅仅是边；


##凸包的应用##

{{site.blank}}凸包是计算几何中基本的概念，既是基本概念其应用自然不是具体的，主要看使用者对凸包的理解。最常见的应用比如使用凸包去计算围绕树林的篱笆墙的最短距离，深入一些的话比如在《探求二维凸包及其应用》（徐瑞广，余志伟.中国矿业大学(北京）资源学院（100083））论文中作者提到用凸包区分两个点集是否可能被一条直接分开，再比如铸造新合金问题，乍看第与凸包没有关系，但作者还是巧妙的应用了凸包知识进行了计算。


这里简单说下凸包在CD`collision detection`中的应用。

{{site.blank}}一个物理碰撞引擎驱动的肯定不止是简单的规则图形，而对于不规则图形，我们一般使用图形的顶点去定义它。对于三角形，三个顶点可以任意顺序（注1），但是顶点数量大于3的话，他们就必须要有一定的顺序，否则不但不能计算正确的表面法线方向，而且不能正确计算面积等属性。如图2所示，点集顺序按字母顺序。

![Img][img2]
图 2

倘若不做处理，碰撞逻辑误以为AB、BC、CD、DA是四条边，这显然是不对的。故此需要先对该点集进行凸包计算，我们并不是为了显示（绘制）凸包的轮廓而去计算它，而是使用凸包计算过程中形成的统一的极点顺序（极点就是在凸包边上的顶点）。假如我们从A点开始计算，那么能在凸包边上的CW方向的下一个顶点肯定是D，然后是B，最后是C。


##算法理论##

{{site.blank}}凸包算法有好多种，比如卷包裹算法`gift wrapping algorithm`、格雷厄姆扫描算法`Graham-scan algorithm`、快包算法`Quick hull algorithm`等。

#####卷包裹算法#####

如图3所示，假如我们有这样一个点集

![Img][img4]
图 3

首先计算出肯定在凸包边上的一个极点，假设我们取最左边的点I，（如何计算指定方向下的最远点？ [点击这里][url2]）；然后我们的工作集中在如何得到第二个极点；

![Img][img6]
图 4 （局部）

从图4中可以看出，I的临近极点肯定是与直线w=I(x)夹角最小的点，图中向量u与w夹角为17.12度，而其他的点比如B则是48.68度，一次遍历下来后，夹角最小的肯定是H点，于是H点便是CCW方向下与I临近的下一个极点；
后面便是个循环，因为我们找到了下一个极点H，再找它的下一个极点与之前逻辑一样了。直到我们找到的下一个极点与第一个I相同，此循环便结束；

![Img][img7]
图 5

{{site.blank}}这里有个问题需要说明的是，图5中点I，A，E好像在同一条直线上。当然感觉可能是未必准确，但如果他们确实共线的话，这就需要我们自己决定点A的去留了，一般情况下点A是去掉的，因为他就是线段IE上的一个普通点而已，就算碰撞解决，也是与IE做线段碰撞，并非与点A做点参与的碰撞。有时候我们为了提高性能，做一些取舍计算，假如点I、A、E不公线，但是角IAE（A是顶点）大于一定的阈值，几乎为180度，这个时候完全可以近似为他们共线，从而省去一部分计算量。



#####具体实现（AS3）#####

{% highlight as3 %}
/**
* 输入点集，得到在凸包上的点集； 
* @param pointSet
* @param hullPointSet
* @return true表示经过了计算，false表示没有经过计算；
* 
*/
public static function handle(pointSet:Array,hullPointSet:Array):Boolean{
	if(pointSet==null || hullPointSet ==null)return false;
	if(pointSet.length<=2)return false;
	hullPointSet.length=0;
			
	//找到最左边的点；这个点肯定是个极点；
	var firstPoint:Vector2D=LAMath.getFarestPoint(pointSet,new Vector2D(-1,0));
	hullPointSet.push(firstPoint);
			
	var Point_a:Vector2D;//每次遍历的开始点，是上一个已经确定的极点；
	var Point_b:Vector2D=firstPoint;//每次遍历开始，是随机点集中的一点，该点在每次遍历之后是个极点；
	var d0:Vector2D=new Vector2D();
	var d1:Vector2D=new Vector2D();
			
	do{
		Point_a=Point_b;
		Point_b=pointSet[0];
		d0.resetComponent(Point_b.x-Point_a.x,Point_b.y-Point_a.y);
				
		for each(var v:Vector2D in pointSet){
			if(v==Point_a)continue;
			d1.resetComponent(v.x-Point_a.x,v.y-Point_a.y);
			var result:Number=LAMath.cross2D(d0,d1);
			if(result>0){
				//大于零，表示有更左边的点；于是跟新Pont_b为这个点，同时更新d0；
				Point_b=v;
				d0.resetComponent(Point_b.x-Point_a.x,Point_b.y-Point_a.y);
			}else if(result==0){
				//在同一条直线上;选择远端的点;
				if(LAMath.dotProduct(d0,d0)<LAMath.dotProduct(d1,d1)){
					Point_b=v;
					d0.resetComponent(Point_b.x-Point_a.x,Point_b.y-Point_a.y);
				}
			}
		}
				
		//一次遍历结束，Point_b记录的肯定是最左边的点（相对了d0方向）；推入极点数组；
		hullPointSet.push(Point_b);
		
	//如果最新得到的极点不是最初的极点，说明圈还没有封闭，继续找下一个极点；
	}while(firstPoint!=Point_b)
	
	return true;
}

{% endhighlight %}


####算法分析####

{{site.blank}}从上面算法中可以看出，整个过程至少包含嵌套的2次循环。外圈while循环用来判断本次do逻辑里面计算出来的极点是否为第一个极点；而do中的for循环主要是遍历所有顶点，如此一来Gift-wrapping算法的时间复杂度便是$$O(n*l)$$，其中n是凸包极点数量，l是点集数量。

{{site.blank}}进一步分析可知如果点集中的点全部在凸包上（比如圆），那么算法时间复杂度便是最大$$O(n^2)$$,所以卷包裹算法不适合计算极点密集型点集；


##注解##

注1：3个顶点的多边形虽然不可能造成边计算的错误，但仍然有可能造成表面法向方向的错误。故此依然需要排序，以方便用统一的逻辑处理；

--------------------------------------------------------------------------------------

相关论文、资料：

[维基百科][url3]

[百度][url1]

[百度][url2]



[url1]:http://baike.baidu.com/link?url=Nikbm6btMU9vNu2OvIsfSw0lVJg-Q0yTmkON-JHajHid4cxqRZf2w9hXME1xQinEIcpFkfM3Uum3H4vWVtbhW_
[url2]:http://wenku.baidu.com/link?url=_SMvLKhyey2woC4OhGS_ctQr6Xu6Ikf664MX_08Z80AxDquPF5iDOJS2SFpezfC5DfZS-PWo42HyQ5ch3XWRMjeTnhe7m_PCAZKjGjkfK3q
[url3]:https://en.wikipedia.org/wiki/Gift_wrapping_algorithm

[1]:http://baike.baidu.com/link?url=JfJ3gxnoHHDwkuvF8bBh3uoJ_Y2L0q_BmRthgtt8RsHwiq1UAXbd8EV3wxYt4RNW3V14FDnsg7i301dVrb-qyq
[img1]:{{site.basepath}}/img/convex-hull/image1.jpg "img1"
[img2]:{{site.basepath}}/img/convex-hull/image2.jpg "img2"
[img4]:{{site.basepath}}/img/convex-hull/image4.jpg "img4"
[img7]:{{site.basepath}}/img/convex-hull/image7.jpg "img7"
[img6]:{{site.basepath}}/img/convex-hull/image6.jpg "img6"

==TBC==



