---
layout: post
title:  "MirageEffector使用指南(0.8.3)"
date:   2015-12-29
categories: jekyll work
published: true
excerpt: ""
meta: 
author: 
tags: [work]
---
##1 介绍
{{site.blank}}Mirage_Effector是一款基于Mirage引擎，纯AS3语言开发的开源游戏2D粒子特效编辑器。市面上2D粒子编辑器比较少，而目前游戏开发特效的表现又越加被重视，Mirage Effect正是在这样的需求下立项并发布。Mirage Effect可以很快的设计出Mirage引擎支持的大部分粒子特效，可视化参数调节及时展现最新的表现效果，为你的游戏开发节约大量时间成本;

##2 特点
* 快速启动：Mirage Effector轻量级的设计使得工具启动速度得到了很大提升;
* 及时呈现：Mirage Effector可以快速的呈现用户对粒子各项参数调整之后的表现，使得开发轻松愉快;
* 随时发布：一个特效生成一个文件，任何目录都可以保存，也可以随时读入编辑，灵活性很大;

##3 使用指南

###3.1 布局
{{site.blank}}Effector界面上分布着5个区域，如下图所示，彩色文字与对应颜色区域明确表示，里面还有左上角的黑色区域，是菜单区（点击后出现）。

![Img][img_1] 图 Effector主界面

###3.2 选择模板
{{site.blank}}Effector提供了39个2D粒子系统模板文件，全部位于程序根目录的template/目录下，该目录还有粒子系统需要用到的纹理png文件。用户点击菜单，选择“模板库”条目，就可以打开模板预览与选择窗口了,见图 3.2.2

![Img][img_2] 图 3.2.1
![Img][img_3] 图 3.2.2

{{site.blank}}单击列表中的粒子系统条目，先从窗口右侧进行预览，方便用户找到与想要粒子系统效果相近的模板，等待确定后，双击该条目就可以在编辑器“效果展示区”出现了。打开模板文件的另一条路径就是传统的从“资源管理器”窗口找到想要的文件（.pex后缀），双击即可。具体操作参见“文件的保存、打开”栏目（见下）。

###3.3 编辑粒子属性、设置底图
{{site.blank}}粒子系统属性的编辑很简单，绝大部分就是用鼠标拖动图四中红色区域所示的滑块改变属性值即可，只有三项属性设置与此不同，这里介绍下：

![Img][img_4] 图 粒子系统编辑界面（部分）

{{site.blank}}第一个是为粒子系统设置纹理的条目，见图 3.3.1。点击图中“纹理路径”按钮，打开“选择纹理”系统窗口，从这里可以找到计算机中任何地方的纹理资源（带透明通道的png资源）。选好后，点击“打开”按钮，就可以在编辑器查看最新纹理下粒子系统的表现了。同时刚才选择的纹理资源会被编辑器自动拷贝到根目录的“work”子目录下，从而方便后期处理。

![Img][img_5] 图 3.3.1

{{site.blank}}第二个是下拉菜单形式的“混合类型”与“发射器类型”条目，见图3.3.2。这与传统软件的下拉菜单无异，不多赘述。

![Img][img_6] 图3.3.2

{{site.blank}}第三个是设置“横坐标”与“纵坐标”的可输入条目，见图3.3.3。这种条目会在鼠标点击后高亮显示边框，意味着用户可以此时输入数字。这里需要注意的是：并不是每次输入都是可以即时呈现的，而是在输入完毕后回车才能呈现。

![Img][img_7] 图3.3.3

{{site.blank}}Effector的编辑区还有一个需要注意的地方就是：不同的“发射器类型”（一共2种），其“粒子发射器属性”面板中的内容是不同的，见下面两张图。这是因为不同类型的发射器有自己独特的属性（图中已列出对应类型的全部粒子发射器属性）。

![Img][img_8] 
![Img][img_9]

###3.4 效果控制
{{site.blank}}效果控制的所有交互组件都在“控制区”。这里的交互是从粒子系统数量、持续时间、间隔时间三个纬度去横向观察用户编辑的粒子系统。“实例数量”是指效果展示区中一共有多少个用户编辑的粒子系统（最少一个），见图3.4.1。“持续时间”是指效果展示区中的所有实例播放多少秒后停止播放；“发射间隔”是指这些粒子系统在停止播放后又经过多少秒再次全新播放。**注意：这三个参数并不会随着粒子系统的导出（保存）而存在于最后的.pex文件中，它们仅仅是一种效果横向上的展示。**

![Img][img_10] 图 3.4.1

###3.5 文件的保存、打开
{{site.blank}}当用户编辑完了自己的粒子系统后，可以通过单击主界面工具栏内的“保存”按钮（一个软盘类的图标），或者从打开的菜单中选择“保存”选项都会打开一个名叫“保存文件”的窗口，这里选择您想要保存的目录，然后输入需要保存的文件名（可不带pex扩展），最后点击对话框红的“保存”按钮，Effector会将最终的pex文件保存在这里。打开文件的时候不能从模板选择那里查找，而是应该点击工具栏内的“打开文件”按钮或者选择菜单中的“打开文件”选项，在出现的“打开文件”窗口内选择之前保存的pex文件，最后点击“打开按钮”就可以将选择的pex文件导入Effector进行再次编辑。

{{site.blank}}重点说下导入的pex粒子系统文件纹理获取的策略。目前所有非模板pex文件在导入Effector后，Effector会首先检测软件根目录下的work子目录内是否有需要的纹理文件（同名同类型），没有的话会使用template子目录下的default.png默认纹理；而所有模板pex文件在导入后仅仅会检测template子目录下是否有纹理文件。

###3.6 文件使用
{{site.blank}}Effector存在的目的不是为了生成pex文件，而是在具体项目中使用pex文件，这就需要一个解析逻辑去处理pex文件，而这个文件就在土豆库中。2D粒子系统的使用非常简单，通过使用土豆库中的MirageEffector的静态方法::load()就可以获得ParticleSystem2D的实例。

load()方法有两个参数：

1. pex的全局或者相对路径（相对于具体项目根目录）；
2. 该粒子系统需要用到的纹理文件所在的目录（全局或相对目录）；

{% highlight as3 %}
var pexURL:String="url\\to\\your\\pex\\file\\test.pex";
var ps:ParticleSystem2D=MirageEffector.load(pexURL,"textureFolder\\");
ps.x=500;
ps.y=400;
addChild(ps);
{% endhighlight %}

当获得粒子系统实例后，就可以像使用Mirage中其他显示对象一样操作。

![Img][img_11] 图 读入具体项目后的粒子表现

##4 关于软件

{{site.blank}}Effector在MIT开源软件协议下发布。被授权人有权利使用、复制、修改、合并、出版发行、散布、再授权及贩售软件及软件的副本。
被授权人可根据程序的需要修改授权条款为适当的内容。同时在授权人在其软件和软件的所有副本中都必须包含版权声明和许可声明。


==EOF==

[img_1]:{{site.basepath}}/img/Effector/image_effector1.jpg
[img_2]:{{site.basepath}}/img/Effector/image_effector6.jpg
[img_3]:{{site.basepath}}/img/Effector/image_effector3.jpg
[img_4]:{{site.basepath}}/img/Effector/image_effector9.jpg
[img_5]:{{site.basepath}}/img/Effector/image_effector5.jpg
[img_6]:{{site.basepath}}/img/Effector/image_effector10.jpg
[img_7]:{{site.basepath}}/img/Effector/image_effector12.jpg
[img_8]:{{site.basepath}}/img/Effector/image_effector14.jpg
[img_9]:{{site.basepath}}/img/Effector/image_effector15.jpg
[img_10]:{{site.basepath}}/img/Effector/image_effector17.jpg
[img_11]:{{site.basepath}}/img/Effector/image_effector18.jpg
[img_12]:{{site.basepath}}/img/Effector/image_effector19.jpg
