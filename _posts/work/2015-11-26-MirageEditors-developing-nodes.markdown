---
layout: post
title:  "编辑器开发日志"
date:   2015-11-26 15:01
categories: jekyll work
published: true
tags: [mirage,editor,UI,effect,2D,particle]
---

{{site.blank}}在整理MirageAnimator（一块序列帧动画编辑器）编辑器的时候，之前的同事对View（各个显示的模块）的编号不是固定的，而是在程序初始化的时候动态指定的，从0一直++。这种写法的优点就是不会造成编号的重复，而且容易在必要的时候插入一个View。回过头来想想我们在对实例设置编号的时候，一般都是将编号保存在一个类似id的变量里面，之后的逻辑一般或者全部是针对id来进行的，这就是说程序员，包括计算机本身不关心id的具体内容，既然如此为什么不在编程的时候动态指定这些内容的。我们完全不要叫真这中设计会对效率有多少影响，因为它仅仅是一种“面向程序员”的编程。

{{site.blank}}这两天重构了2个编辑器的代码，唯一的原因就是老代码对编辑器不友好，具体体现在IDE不能连接到源、程序员不能方便读写程序，甚至连第三方库程序的“可读性”都比不了。库程序好比另一个集团，好歹客户知道其集团地址，各个对外的部门。而这种不友好的编程风格就像一个黑洞，什么都看不到。
之前公司大牛说他的编程经验之精华就是“敏捷开发”，唯快不破，也许大神戏言，因为他的言行最觉得是个“怪人”，但我对此不太同意。我总是有意识的将程序的架构与社会的建构联系起来，比如社会有管理机构，有公路，有公司，也有个人，这就好比程序中的各种模块，以及模块的功能与之间的通道，人就好比模块间通信的数据源。往抽象里说社会还有法律，有道德，这就是程序中对一个模块的定义，有时候一个模块的功能绝对不能超过该定义而执行逻辑，这就是法律，而有时候某些功能是互相协作的模块间谁都可以参与的，这就类似社会中的道德；这是对大型项目的拟社会比喻，但对于小型项目或者一个仅仅为了计算某个结果的程序而言，对社会的比喻就需要缩小为公司甚至更小。从我这个角度去思考的话，倘若编程的核心是“敏捷开发”的，那么社会结构有是什么？

{{site.blank}}出于flashAMF协议的方便性，公司各种编辑器经可能的使用它去序列化一些数据，其中包括编辑器编辑完成后将要输出的文件。
如果使用这种方法的话，我承认对最终数据的保存与读取会是相当方便，只要在程序中对相关的数据类注册一个别名，将数据与别名序列化进文件中，在正式项目使用该文件的时候反序列化读取即可。方法确实简单，但问题亦是可见。
最明显的问题就是需要向客户暴露编辑器最终文件的数据结构，因为如果不暴露的话反序列化工作不能进行，暴露之后面临着结构化编程中对封装概念的无视与对安全性的无视，当然还有其他不好的地方就是：有时候，可能大部分情况下用户根本不需要你这个结构文件；

{{site.blank}}于是我决定抛弃对结构文件的序列化支持，而采用自定义序列化过程。这里记录下各个编辑器最终文件的序列化结构，一方面整理下结构本身，二来好方便查阅。

#MirageUIMaker

{{site.blank}}主体由许多“块”组成，每一个块即是一个显示对象，块中包含固定的一些数据，比如类型，成员变量的键值对，自己的编号，父容器编号，自己的id（**id与
编号不是一个概念，编号主要用来映射谁是谁的父容器，id用来在运行时获取该显示实例**）；

.view文件格式：

|id  |类型       |长度     |说明                              |
|:--:|:---------:|:-------:|:---------------------------------|
|1   |int        |4        |一共有多少个块                    |
|2   |int        |4        |UTF编码下的显示对象类型名长度     |
|3   |UTFString  |-/-      |显示对象类名                      |
|4   |Dictionary |-/-      |属性的键值对，保存与字典中        |
|5   |int        |4        |UTF编码下的显示对象实例id         |
|6   |UTFString  |-/-      |显示对象实例id                    |
|7   |int        |4        |自己的编号                        |
|8   |int        |4        |父容器的编号                      |

其中2到8是一个完整的块的内容，下面依次重复，循环n次；

#MirageEffector

{{site.blank}}从效率与文件大小2个方面考虑的话，我决定去掉对2D粒子属性名（一个字符串）的记录，仅仅记录属性的值，映射过程是固定死了的，比如第一个读出来的数据固定就是粒子初始红色，第二个固定是初始绿色，以此类推；

.pex文件格式：

|类型       |长度     |Mirage中属性名  |说明                              |
|:---------:|:-------:|:--------------:|:---------------------------------|
|uint       |4        |-/-             |记录粒子相关metadata（注一）      |
|Short      |2        |-/-             |记录该2D粒子属性个数              |
|uint       |4        |-/-             |UTF编码下的纹理名长度             |
|UTFString  |-/-      |texture         |该粒子纹理名（带扩展），路径固定  |
|float      |4        |duration        |粒子系统持续时长（秒）            |
|float      |4        |emitterX        |粒子x坐标            |
|float      |4        |emitterY        |粒子y坐标            |
|float      |4        |emitterXVariance        |x坐标浮动             |
|float      |4        |emitterYVariance        |y坐标浮动             |
|float      |4        |speed        |速度            |
|float      |4        |speedVariance        |速度浮动            |
|float      |4        |lifespan        |生命周期            |
|float      |4        |lifespanVariance        |生命周期浮动            |
|float      |4        |emitAngle        |发射角度            |
|float      |4        |emitAngleVariance        |            |
|float      |4        |gravityX        |水平重力            |
|float      |4        |gravityY        |垂直重力            |
|float      |4        |radialAcceleration        |法（径）向加速度            |
|float      |4        |tangentialAcceleration        |切向加速度            |
|float      |4        |radialAccelerationVariance        |            |
|float      |4        |tangentialAccelerationVariance        |            |
|float      |4        |startColorRed        |岂始红色            |
|float      |4        |startColorGreen        |            |
|float      |4        |startColorBlue        |            |
|float      |4        |startColorAlpha        |            |
|float      |4        |startColorRedVariance        |            |
|float      |4        |startColorGreenVariance        |            |
|float      |4        |startColorBlueVariance        |            |
|float      |4        |startColorAlphaVariance        |            |
|float      |4        |endColorRed        |结束红色            |
|float      |4        |endColorGreen        |            |
|float      |4        |endColorBlue        |            |
|float      |4        |endColorAlpha        |            |
|float      |4        |endColorRedVariance        |            |
|float      |4        |endColorGreenVariance        |            |
|float      |4        |endColorBlueVariance       |            |
|float      |4        |endColorAlphaVariance        |            |
|float      |4        |maxNumParticles        |粒子最大数（注意一个pex文件是一个粒子系统的）            |
|float      |4        |startSize        |起始大小            |
|float      |4        |startSizeVariance        |            |
|float      |4        |endSize        |结束大小            |
|float      |4        |endSizeVariance        |            |
|float      |4        |emitterType        |发射器类型            |
|float      |4        |maxRadius        |最大半径            |
|float      |4        |maxRadiusVariance        |            |
|float      |4        |minRadius        |最小半径            |
|float      |4        |rotatePerSecond        |旋转速度            |
|float      |4        |rotatePerSecondVariance        |            |
|float      |4        |startRotation        |起始旋转角度            |
|float      |4        |startRotationVariance        |            |
|float      |4        |endRotation        |结束旋转角度            |
|float      |4        |endRotationVariance        |            |
|float      |4        |blendMode        |混合类型，枚举            |
|float      |4        |emissionRate        |发射速率            |

注一：
uint第一个字节记录当前该文件的版本，与编辑器版本不同，该版本是独立的，从1到255；
uint第二个字节第一位记录该文件是否为模板文件（1为模板文件，0反之），模板文件不允许通过编辑器正常保存途径保存，编辑后只可另存为；
其他位带需求逐渐补充；

#MirageAnimator

{{site.blank}}Animator只有编辑文件没有显式的导出，编辑文件是能再次导入到编辑器中继续编辑的数据状态文件，而Animator最终导出的隐式文件全部只有一个（要么重新指定），它就是potato中MovieAsset类需要加载的动画配置文件，是个‘人可读’的txt文件；这里主要说下编辑文件（.mvd)。
Animator没有大动，按原版继续。

.mvd文件格式：

|类型       |长度     |Mirage中属性名  |说明                              |
|:---------:|:-------:|:--------------:|:---------------------------------|
|Dictionary |-/-      |-/-             |用字典记录全部                    |



##坑

* 我序列化完毕的文件却不能显示出来，几番打印信息发现需要显示数字0的地方，有的显示0，有的显示0.00，马上意识到原数据可能是字符串，经过排查，问题就解决了，确实是字符串。

* Adobe的AS3编译器有这样的bug，就是变量名如果与这个文件import的其他类所在的包名一样的话，编译器会报告
` Warning:(130, 0) [MirageAnimator]: Definition name is the same as an imported package name. Unqualified references to that name will resolve to the package and not the definition.`警告，此时编译是可以通过的，但是如果你后续逻辑是使用该变量的属性或者成员方法，编译器就会跑去那个包相关的地方找，然后就是报错了`Error:(131, 0) [MirageAnimator]: Call to a possibly undefined method xxx through a reference with static type Object.`，一个佐证就是在IDE中完全可以连接到正确的位置；

#经验

{{site.blank}}当一个引擎对焦点的支持只有一个的时候，在底层库框架的设计上就一定要注意鼠标划入触发的“焦点对象”与文本输入时的“框焦点”的对象两个概念。这两个概念不能混淆，可以想象当鼠标划入一个list后原来可输入的文本框焦点丢失是一种什么样的体验。
