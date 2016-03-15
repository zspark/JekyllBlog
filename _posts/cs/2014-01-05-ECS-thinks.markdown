---
layout: post_with_wisdom
title:  "使用ECS思想开发的一款格子游戏引擎"
date:   2014-01-05
category: CS
published: true
excerpt: "引擎使用ECS架构思想来实现，也是第一次完全使用ECS架构，庆幸的是自己编程从来就有类似ECS的思想。因为我总觉得传统的对象继承对内存浪费是比较大的（当然这有可能是程序设计上的问题），有时候我不得不继承，但继承后却有大部分祖宗字段是根本用不着的。对内存的这种浪费，就我个人而言是不能接受的。"
wisdom: 软件就像熵：难以把握，没有重量，服从热力学第二定律；比如说，它总是在增长。 —— 诺曼·奥古斯丁（ Norman Augustine），洛克希德马丁公司前总裁
meta: 
author: 
tags: [ecs,ECS,collision-detection,entity-component-system]
---

{{site.blank}}引擎使用ECS架构思想来实现，也是第一次完全使用ECS架构，所幸的是自己曾有过类似ECS的想法，因为我总觉得传统的对象继承对内存浪费是比较大的（当然这有可能是程序设计上的问题），有时候我不得不继承，但继承后却有大部分基类字段是根本用不着的。对内存的这种浪费，就我个人而言是不能接受的。前不久接触到该架构思想，有种相见恨晚的感觉。下面是Demo在github的地址：
{% include github.html repo="tileengine" %}

{% include swf.html src="TileEngineDemo_s.swf" align="center" width="700" height="280" caption="方向键控制上下左右，空格跳跃，操作与端游《冒险岛》相似，注意！如果不能控制对象，请将鼠标移动到demo上点击，以便让其获得当前系统焦点！尽量切换到英文输入法下！" %}


## ECS思想

{{site.blank}}此前编程涉及的都是传统OOP理念下的实物对象继承游戏，随着游戏技术的不断发展，传统继承机制暴露出了部分缺陷，
比如游戏里面有2个类，一个是不能行走、攻击但是生长的BaseTree，另一个是能走能攻击敌人的BaseMonster，现在我的游戏里面需要有这样一种对象：会长枝叶的树形怪物（它能够攻击玩家，同时具备一切树木的基本属性，还能走路），请问你打算继承哪个基类（这里不考虑多重继承）？

{{site.blank}}这就是传统OOP编程至少在游戏编程领域慢慢暴露出的问题，这便导致`ECS(Entity-Component-System)`架构的慢慢出现。

> Entity-component-system (ECS) is an architectural pattern that is mostly used in game development. An ECS follows the Composition over inheritance principle that allows greater flexibility in defining entities  --摘自wiki

{{site.blank}}ECS并不是面向对象的OOP，而是面向数据的DOP。这就需要一定的认知与理解上的转变,ECS是一种架构思想，并不是一种相对具体的框架，在其思想下，你可以写框架，亦可以写引擎，或者直接写游戏。


### 重要概念

1. Component
要说明ECS中三个字母依次代表的含义，我觉得需要先说C`Component`；

{{site.blank}}ECS中的字母C`Component`是英语‘组件’的含义。说起组件可能我们更加倾向于想到按钮、单选框、文本等，这两种“组件”虽然在含义上有出入，但究其在各自框架结构中扮演的角色却是相同的：**他们都是一个更大系统的组成部分**。

{{site.blank}}设想一个按钮组件，我们可以想到它会有caption/label属性，正常情况下它也一定可以被点击，有一定的外形。但是我们绝不会想到正常情况下的按钮组件会有列表List的功能、播放动画的功能等等。联系到ECS中的组件也是一样的：**一个组件会有一项具体的的功能，但绝对不会有系统全部的功能。**

{{site.blank}}我们继续分析按钮组件。一个按钮会被点击，从而触发一些应用逻辑，这是说按钮有部分逻辑存在；同样当我们设置按钮的状态为不可点击时，它会一直被渲染成类似灰色的样子是因为其记录了一些数据。这样看来按钮组件就可以被定义为一个具有被点击功能的逻辑与数据的合体。这种对按钮组件的抽象并不适合ECS中的组件定义，结合之前所说ECS是面相数据的，于是更加准确的CES组件定义便是：
**一个具体的、性质相对单一的一组数据的集合**

> Component: the raw data for one aspect of the object, and how it interacts with the world. "Labels the Entity as possessing this particular aspect". Implementations typically use Structs, Classes, or Associative Arrays.  --摘wiki

{{site.blank}}了解了`Component`的基本思想后，我们可以将上面树妖的简单数据分成三个组件，componentA包含了成长相关的数据，componentB包含攻击相关的数据。componentC包含行走相关的数据。一般情况下我们会再创建一个新的结构或者类，用它去组合componentA与componentB，如此一来，ECS中的E`Entity`便登场了。

2. Entity
{{site.blank}}ECS中的字母E`Entity`就是“实体”的意思。这个实体是数据实体，并不是对象实体（因为前面说过他是面相数据的，并且它是由各种Component组合而成的）。究竟是如何组合的呢？想想我们的树妖，能走能攻击还能生长，那我们就创建一个树妖实体，让他组合了上面A，B，C三种组件，这不就包含了一切需要的数据嘛，倘若是个普通怪物，仅仅组合B，C即可。普通树的话就只有A了。这就是Entity：**由各种必要Component组合而成的另一个对象。**

> Entity: The entity is a general purpose object. Usually, it only consists of a unique id. They "tag every coarse gameobject as a separate item". Implementations typically use a plain integer for this.  --摘自wiki

> Entity - A container into which components can be added, usually hierarchical (any Entity can have sub-Entities).  --摘自wiki

3. System
{{site.blank}}ECS中的字母S`System`是逻辑的躯体。它们（游戏里面可能有好多System）驱动着添加进来的所有同一类型组件C`Component`做出指定的逻辑运算。有的System需要的Component不止一种。比如系统要渲染Bitmap到屏幕，至少需要知道BitmapData的数据（绘制什么东西）、Bitmap的坐标、旋转、缩放，父容器（绘制到哪里）才行，如果我们用PositionComponent记录坐标、旋转与缩放的话，那肯定还需要另外一个记录着BitmapData数据的Compnent。再拿上面的树妖做比，树妖要攻击敌人，其ComponentB组件虽然保存有攻击力、暴击率、暴击伤害、攻击速度等一套数据，但也仅仅是一堆数据而已，他们如何计算？如何依赖？，我们需要将该组件以类似参数的形式传递给攻击系统（姑且叫做SystemAttack），攻击系统经过逻辑运算得出了本次攻击的具体伤害数值。而树妖实体E`Entity`的另外一个组件ComponentA则被传递给了成长系统（SystemGrow）得到了具体的成长值。其他树妖组件同此逻辑；**System是用来执行游戏逻辑，计算组件数据，驱动数据流的进行。**

可以看出一个S`System`并不是针对一个具体的Entity而执行逻辑，而是根据E中更小的C来执行；

> System: "Each System runs continuously (as though each System had its own private thread) and performs global actions on every Entity that possesses a Component of the same aspect as that System."  --摘自wiki

### Extra
{{site.blank}}有的开发者将一个具体的System用到的所有Component封装到一个被称为Node的全新类里面，方便每次System驱动的时候只需要一种对象Node实例，而不是一堆组件实例；

{{site.blank}}ECS架构还有一个称作SystemManager的类，这个其实就是集中管理所有System实体，整体驱动、停止等；

{{site.blank}}有了ECS这种将复杂对象的一组相关属性封装成组件存储，而将逻辑统一由System处理的架构思想，上面传统对象继承存在的问题迎刃而解，树怪实体（Entity）可以包含基类树与基类怪的所有Component，外带自己独特的Component，将他们各自推进针对不同Component处理的System逻辑处理器里面执行。这就是ECS的核心：**尽可能抽象对象，分裂对象，分裂到具体程序要求的最低级别，然后用各自独立的系统去批处理相同定义的数据块，屏蔽实体对系统的多样化要求，进而简化程序开发复杂度。**

### 引擎目前不支持的常用功能

* 斜坡格子；
* 电梯；

## 经验总结

* 必须对自己将要设计的系统全面熟悉，Component一定要严格存储自己的数据，不同Component之间不可有交集，且字段定义必须非常明确；
* System是所有一类Node的批处理系统，这些Node中的Component可能来自完全不同的Entity，这就需要System尽量抽象，不可简单针对一类Entity下的Component属性，更不可能只针对一个;
* 习惯了写传统类结构关系，从而在开发期间，总想着各种对象继承，对象属性什么的，切记一定要强迫自己转变（是吸收、使用新的技术，绝不是抛弃传统的对象继承）；
* Entity中各种Component具体值的初始化，可交由不同的config类完成，你可以根据Entity的不同类型使用一个很长的 if.else指向具体的config装配方法，这都不是重点；


## 相关参考资料

- [维基百科][1]
- [Richard Lord][2]
- [Piemaster.net][3]
- [lmorchard][4]


==EOF==


[1]:http://en.wikipedia.org/wiki/Entity_component_system
[2]:http://www.richardlord.net/blog/what-is-an-entity-framework
[3]:http://piemaster.net/2011/07/entity-component-primer/
[4]:http://blog.lmorchard.com/2013/11/27/entity-component-system 

