---
layout: post
title:  "MirageUIMaker使用指南（0.8.5）"
date:   2015-11-23 17:50
category: work
published: true
tags: []
---

## 1 介绍
{{site.blank}}MirageUIMaker是一款基于Mirage引擎，纯AS3语言开发的开源游戏UI界面编辑器。它具有市面上UI编辑器的常用功能，同时兼具windows10全新的界面布局。UIMaker最大的特点是轻巧，它可以快速启动、快速编辑、快速发布，删除了程序集成开发的功能，使得UIMaker更加专注于设计。

## 2 特点
* 快速启动：UIMaker轻量级的设计使得工具启动速度得到了很大提升；
* 专注设计：大胆的去掉了程序与界面集成的传统编辑器，把精力集中于界面的设计上，细分软件系统的开发；
* 预览功能：设计界面的过程中可以及时预览，更加方便复杂组件的设计；
* 工程层级直观可见：从更大的尺度把握工程开发，及时掌控全局资源与层级关系；

## 3 使用指南

### 3.1 布局
{{site.blank}}UIMaker界面上分布着8个区域，如下图3.1.1所示，彩色文字与对应颜色区域明确表示，里面还有两个黑色区域，一个左上角的菜单区（点击后出现）、另一个项目管理区（点击后出现）；

![Img][img_1] 图3.1.1

### 3.2 创建、激活项目
{{site.blank}}首次打开UIMaker，需要创建编辑项目，点击图3.2.1中设计区的“新建项目”按钮

![Img][img_2] 图3.2.1

出现如下图3.2.2中“新建项目”对话框，在此输入项目名、项目位置、默认高宽（默认值为960pixels\*640pixels）点击确定即可完成创建项目。

![Img][img_4] 图3.2.2

{{site.blank}}此时在“资源列表”选项卡中会出现刚才创建的项目，设计区“已存在项目”栏目也出现这个项目的显示。新建项目还有另外一条路径就是在菜单区中创建，在出现的菜单列表中选择“新建项目”按钮，也会出现图3.2.1的“新建项目”对话框；

{{site.blank}}当前激活的项目决定了在保存文件的时候程序默认选择的路径。从图3.2.3设计区“已存在项目”栏目可以看出现在已经存在两个项目，其中标有**（A）**的表示当前激活项目，在这里你可以选择点击不同的项目从而在他们之间切换；

![Img][img_7] 图3.2.3

{{site.blank}}项目创建完成后，UIMaker会在指定的目录下创建以项目名为名字的子目录，然后在该子目录下面又创建四个子目录，具体见下：

* editor：保存UIMaker的编辑文件，以.editor为扩展名，可再次打开继续编辑；
* resource：保存该项目使用过的或者正在使用的资源文件，当用户从磁盘其他地方指定资源后，UIMaker会拷贝该资源到本目录下，方便以后制作图集；
* view：保存每个编辑文件对应的导出文件，该文件是界面最终在项目中使用的，扩展名.view；
* view\_cfg：生成view子目录下所有view文件的配置文件，所谓以后项目所有资源的一项子配置而存在；

### 3.3 创建、保存、打开文件
{{site.blank}}当前有激活项目时，UIMaker才允许用户创建编辑文件（.editor）。用户可以点击工具栏中的新建文件按钮![img][img_102]或者菜单栏中的“新建文件”按钮，从而创建一个全新的编辑文件，此时设计区界面切换进入编辑状态。

{{site.blank}}保存![Img][img_100]、打开![Img][img_101]按钮的位置与创建文件按钮的位置一样，不再赘述。需要说明的是打开文件还可以从项目管理区中editor目录下双击打开，如图3.3.1。

![Img][img_20] 图3.3.1

>这里需要强调的是：组件实例属性的变化是及时生效的，不需要用户点击类似“执行”按钮。

### 3.4 编辑文件
{{site.blank}}编辑文件是重点。当创建了一个新文件后，用户可以从UIMaker左边的组件区中拖入想要使用的组件到设计区就可以创建一个该组件的实例，同时编辑器的实例层级区会刷新以显示最新的实例层级关系，UIMaker右边的实例编辑区也会显示当前选中的组件实例的可编辑属性条目。UIMaker有四种不同的属性编辑条目：

1. 文本输入条目：![Img][img_entry1]，内置可以输入任何字符，具体组件有特别类型要求除外；
2. 数字输入条目：![Img][img_entry0]，内置只能输入数字相关字符，比如0-9,-,.；
3. 布尔条目：![Img][img_entry2]，只能勾选与不勾选，该条目定位的属性只有两种状态；
4. 定位条目：![Img][img_entry3]，这种条目右边有个按钮，点击后，可针对不同的属性定位到不同的对话框，提供比较复杂的属性编辑；
5. 下拉条目：![Img][img_entry4]，这种条目是为“多选一”而存在的，点击条目中按钮部分任意位置，可弹出下拉列表，选择并点击想要的子条目即完成操作；

{{site.blank}}用户对各种组件的属性编辑就是靠这五种属性编辑条目来完成的。当用户选定一个组件实例后，UIMaker会生成其属性对应的编辑条目供用户编辑，针对不同的组件，条目的数量与功能可能是不同的。

#### 3.4.1 容器组件
![Img][img_comp0] 容器组件

{{site.blank}}容器组建是最基本的组件之一，它类似Mirage中的DisplayObjectContainer实例，具有组件最基本的诸如x、y、alpha、visible、rotation、mouseEnabled、scaleX，scaleY等8个属性，见图五。容器组建没有width与height属性，其大小是由容器内部子组件的位置与大小决定的。

#### 3.4.2 动画组件（Movie组件）
![Img][img_comp2] 动画组件

{{site.blank}}动画组件是用来显示用MirageAnimator编辑器编辑的动画文件的，属性条目相较容器组件多了movieName可输入文本条目，这是用来告诉编辑器显示哪个动画。播放动画就需要用到动画资源（即序列帧资源），这些资源在设置movieName条目的内容之前需要导入UIMaker，否则UIMaker会弹出图3.4.2.1的提示框。

![Img][img_22] 图3.4.2.1

{{site.blank}}现在说下如何导入动画配置文件与动画资源。点击菜单选择“设置动画配置文件”，打开图3.4.2.2所示对话框。对话框中“主配置文件名”是需要用户输入用ResTool工具编辑的资源总配置文件（具体操作参见ResTool使用指南）。“Movie配置文件Id”是指动画配置文件在主配置文件中的id编号（每一个用MirageAnimator编辑并且导出的‘动画配置文件’都需要在主配置文件中进行配置，从而得到该动画配置文件唯一的ID），“资源根目录”是指上述主配置文件所在的路径。

> 注意：土豆库会自动配置好地区与语言目录，所以用户这里只能指定项目根目录，最终URL路径可以从“主配置最终URL”查看。

![Img][img_23] 图3.4.2.2

{{site.blank}}当必要的路径、文件名指定完毕后，点击“确定”按钮，UIMaker会尝试将数据导入内存，成功、失败都会有提示，见下图：

![Img][img_24] ![Img][img_25] 

#### 3.4.3 图片组件
![Img][img_comp2] 图片组件

{{site.blank}}图片组件的类型是Bitmap，Bitmap有个显著的特点就是：可以指定九宫格放大，如果九宫格为null的话，就是缩放操作。

{{site.blank}}Bitmap编辑属性多了texture与grid，此二者都是定位条目，需要点击右边绿色按钮方可进入编辑对话框。图3.4.3.1所示是点击texture条目按钮之后的选择纹理对话框，用户需要选择想要的纹理资源，然后点击“打开”按钮就可以将选中的纹理添加到编辑区的图片组件了，见图3.4.3.2

![Img][img_26] 图3.4.3.1
![Img][img_27] 图3.4.3.2

{{site.blank}}图片需要放大或者缩小的话，用户可以选择在“实例编辑区”对应的条目编辑，也可以鼠标左键按住图3.4.3.2中周边的8个蓝块之一拖动，因为我们暂时没有指定图片的九宫格数据，所以此时拖动的话是缩放原始图片以适应大小。接下来我们设置九宫格数据，点击grid9条目右边的绿色按钮出现如图3.4.3.3所示的“编辑九宫格信息”窗口，这里用户可以拖动窗口中的4条白线已达到九宫格定位的效果，定位好后点击“确定”按钮，回到设计区。此时界面中图片组建的效果发生了变化，当指定九宫格数据后，图片的高旷不再以缩放表示，而是使用九宫格纹理，具体变化参见图3.4.3.4，图3.4.3.5

![Img][img_29] 图3.4.3.3

![Img][img_28] 图3.4.3.4
![Img][img_30] 图3.4.3.5

#### 3.4.4 按钮组件
![Img][img_comp3] 按钮组件

{{site.blank}}按钮组件中有类型图片纹理设置的定位条目，比如upTexture、downTexture、selectTexture、gird9，他们的设置与图片一样，这里不赘述。唯一与之前介绍组件不同的是多出来个textFormat定位条目：![Img][img_40]，点击定位按钮出现“TextFormat属性编辑”对话框，如图3.4.4.1。里面有三个编辑条目，依次指定按钮上文本的**颜色、字体、大小**三个属性，点击颜色定位按钮出现如图所示调色板，其使用与经典软件如photoshop，flashprofessional类似。

![Img][img_41] 图3.4.4.1

![Img][img_42] 图3.4.4.2

#### 3.4.5 输入文本
![Img][img_comp4] 输入文本组件

{{site.blank}}顾名思义，该组件会在运行时允许用户动态输入文本内容。其特别的编辑条目就是maxChar、mutLine与restrict，各自说明如下：

* maxChar：表示用户最大可以动态输入几个字符；
* mutLine：表示该输入文本框是否允许多行输入，允许的话会是图3.4.5.1，不允许的话就图3.4.5.2
* restrict：是正则表达式的字符串形式，目前使用字符串转换正则表达式的方式可能会因为转义字符的存在而有bug，该功能新版本可能会屏蔽；

![img][img_50] 图3.4.5.1
![img][img_51] 图3.4.5.2

#### 3.4.6 滑块组件
![Img][img_comp5] 滑块组件

{{site.blank}}滑块组件可编辑条目如上图所示，其中direction是个下拉条目，内容只有两条，表示用户想要该组件垂直可滚动还是水平可滚动。backTexture与backGrid9表示指定用户想要的滚动条底图纹理及其九宫格；handleTexture与handlGrid9表示指定用户想要的拖拽头。下图中上面滑块是指定了底图，下面滑块是指定了底图与拖拽头；

![Img][img_60] 图3.4.6.1

#### 3.4.7 文本组件
![Img][img_comp6] 文本组件

{{site.blank}}文本组件不同于输入组件之处是它不能与用户直接交互，除此之外，两者暂无明显显示上的区别；

### 3.5 多选
{{site.blank}}设计区的组件实例都可以通过左键单击来激活的，但也选择了一个，想要在UIMaker中多选的话，需要在点击其他实例之前按住shift键，如图3.5.1所示。多选之后的另一处变化时实例编辑区变成了图3.5.2的样子。图中按钮第一行从左向右依次为：**左对齐、垂直居中对齐、右对齐**，第二行从左向右依次为：**上对齐、水平居中对齐、下对齐**。

![Img][img_200] 图 3.5.1
![Img][img_201] 图 3.5.2

图3.5.1中选中的两个组件对齐后的表现如下：

* 左对齐：![Img][img_202]
* 垂直居中对齐：![Img][img_203]
* 右对齐：![Img][img_204]
* 上对齐：![Img][img_205]
* 水平居中对齐：![Img][img_206]
* 下对齐：![Img][img_207]

### 3.6 实例层次结构
{{site.blank}}如果用户在编辑过程中发现组件A被组件B压在下面，但我们想要A在B上面，这个时候就需要改变组件之间的层级关系，如图3.6.1。用户可以在实例层级区拖动任意一个到另一个上面释放，即可完成层级改变。

![Img][img_11] 图3.6.1

具体来说分两种：

1. 如果将组件A拖至非容器组件B上面释放，则将添加A到组件B的上面；
2. 如果将组件A拖至容器组件C上面释放，UIMaker会弹出提示![Img][img_104]，告诉用户想要的更具体行为；

> ！！实例层级区的组件越往下越在上面。

层级结构区还有其他两个小功能：

1. 左键单击可选激活对应编辑区的实例，方便定位；
2. 点击![img][img_105]按钮，可隐藏对应组件在设计区的显示，这个功能不同于各组件的visible属性，它是一种给设计者隐藏冗余组件的友好设计罢了；

### 3.7 快捷键
{{site.blank}}UIMaker目前支持快捷键操作，暂不支持自定义快捷键，全部组合按键如下表所示。

|快捷键|说明|
|:-------------------------------------------|:-----------------------------------------------|
|Ctrl+Enter|预览|
|Ctr+W|关闭预览|
|Ctrl+C|拷贝|
|Ctrl+V|粘贴|
|Ctrl+X|剪贴|
|Ctrl+S|保存|
|Ctrl+Z|撤销|
|Ctrl+Y|反撤销|
|Ctrl+Minus|缩小设计区|
|Ctrl+Equal|放大设计区|
|Delete|删除激活的组件|
|Up|当前激活组件向上移动一个像素|
|Down|当前激活组件向下移动一个像素|
|Left|当前激活组件向左移动一个像素|
|Right|当前激活组件向右移动一个像素|
|Shift+Up|当前激活组件向上移动十个像素|
|Shift+Down|当前激活组件向下移动十个像素|
|Shift+Left|当前激活组件向左移动十个像素|
|Shift+Right|当前激活组件向右移动十个像素|

### 3.8 文件预览与使用
{{site.blank}}当用户编辑完了界面之后，可以点击![Img][img_103]预览按钮查看整体效果，此时某些在设计区无法查看的属性也会表现出其效果，比如visible属性。UIMaker在预览的时候会在项目目录的view子目录下生成tmp.view临时文件，可随时删除。想要保存的时候，点击主界面工具区的![img][img_100]保存按钮，会出现“保存文件”对话框，输入文件名并点击“确定”按钮后，UIMaker会在激活项目的view目录下生成对应的.view文件，这个文件就是具体项目使用的文件。使用过程很简单，主要两部分：

第一步载入\*.view文件：

{% highlight as3%}
var url:String="test.view";		//view文件的名称与路径；
UIMaker.load(url,this);			//参数二表示指定的父容器；
{% endhighlight %}

第二步对文件中摆放的组件实例添加触发逻辑，比如按钮按下、文本框输入等：

{% highlight as3 %}
var btn:Button=UIMaker.getDisplayObject(url,"btn") as Button;	//向之前url指定的view文件中获取id为btn的实例；
btn.addEventListener(GestureEvent.CLICK,onC);			//添加业务逻辑；
{% endhighlight %}

大家可能想知道上面代码中“btn”是什么意思，这个就是获取view文件中具体实例的标志，它是在UIMaker中的编辑区给想要以后添加逻辑的实例自定义命名的字符串，如图3.8.1所示。也就是指定id属性的内容即可；

![Img][img_21] 图3.8.1

## 4 关于软件
{{site.blank}}UIMaker在MIT开源软件协议下发布。被授权人有权利使用、复制、修改、合并、出版发行、散布、再授权及贩售软件及软件的副本。
被授权人可根据程序的需要修改授权条款为适当的内容。同时在授权人在其软件和软件的所有副本中都必须包含版权声明和许可声明。


==EOF==

[img_1]:{{site.imgurl}}UIMaker/image_uimaker1.jpg
[img_2]:{{site.imgurl}}UIMaker/image_uimaker2.jpg
[img_3]:{{site.imgurl}}UIMaker/image_uimaker3.jpg
[img_4]:{{site.imgurl}}UIMaker/image_uimaker4.jpg
[img_5]:{{site.imgurl}}UIMaker/image_uimaker5.jpg
[img_6]:{{site.imgurl}}UIMaker/image_uimaker6.jpg
[img_7]:{{site.imgurl}}UIMaker/image_uimaker7.jpg
[img_8]:{{site.imgurl}}UIMaker/image_uimaker8.jpg
[img_9]:{{site.imgurl}}UIMaker/image_uimaker9.jpg
[img_10]:{{site.imgurl}}UIMaker/image_uimaker10.jpg
[img_11]:{{site.imgurl}}UIMaker/image_uimaker11.jpg
[img_20]:{{site.imgurl}}UIMaker/image_uimaker20.jpg
[img_21]:{{site.imgurl}}UIMaker/image_uimaker21.jpg
[img_22]:{{site.imgurl}}UIMaker/image_uimaker22.jpg
[img_23]:{{site.imgurl}}UIMaker/image_uimaker23.jpg
[img_24]:{{site.imgurl}}UIMaker/image_uimaker24.jpg
[img_25]:{{site.imgurl}}UIMaker/image_uimaker25.jpg
[img_26]:{{site.imgurl}}UIMaker/image_uimaker26.jpg
[img_27]:{{site.imgurl}}UIMaker/image_uimaker27.jpg
[img_28]:{{site.imgurl}}UIMaker/image_uimaker28.jpg
[img_29]:{{site.imgurl}}UIMaker/image_uimaker29.jpg
[img_30]:{{site.imgurl}}UIMaker/image_uimaker30.jpg

[img_40]:{{site.imgurl}}UIMaker/image_uimaker40.jpg
[img_41]:{{site.imgurl}}UIMaker/image_uimaker41.jpg
[img_42]:{{site.imgurl}}UIMaker/image_uimaker42.jpg

[img_50]:{{site.imgurl}}UIMaker/image_uimaker50.jpg
[img_51]:{{site.imgurl}}UIMaker/image_uimaker51.jpg

[img_60]:{{site.imgurl}}UIMaker/image_uimaker60.jpg
[img_61]:{{site.imgurl}}UIMaker/image_uimaker61.jpg
[img_62]:{{site.imgurl}}UIMaker/image_uimaker62.jpg

[img_100]:{{site.imgurl}}UIMaker/image_uimaker100.jpg
[img_101]:{{site.imgurl}}UIMaker/image_uimaker101.jpg
[img_102]:{{site.imgurl}}UIMaker/image_uimaker102.jpg
[img_103]:{{site.imgurl}}UIMaker/image_uimaker103.jpg
[img_104]:{{site.imgurl}}UIMaker/image_uimaker104.jpg
[img_105]:{{site.imgurl}}UIMaker/image_uimaker105.jpg

[img_200]:{{site.imgurl}}UIMaker/image_uimaker200.jpg
[img_201]:{{site.imgurl}}UIMaker/image_uimaker201.jpg
[img_202]:{{site.imgurl}}UIMaker/image_uimaker202.jpg
[img_203]:{{site.imgurl}}UIMaker/image_uimaker203.jpg
[img_204]:{{site.imgurl}}UIMaker/image_uimaker204.jpg
[img_205]:{{site.imgurl}}UIMaker/image_uimaker205.jpg
[img_206]:{{site.imgurl}}UIMaker/image_uimaker206.jpg
[img_207]:{{site.imgurl}}UIMaker/image_uimaker207.jpg

[img_comp0]:{{site.imgurl}}UIMaker/image_uimaker_comp0.jpg
[img_comp1]:{{site.imgurl}}UIMaker/image_uimaker_comp1.jpg
[img_comp2]:{{site.imgurl}}UIMaker/image_uimaker_comp2.jpg
[img_comp3]:{{site.imgurl}}UIMaker/image_uimaker_comp3.jpg
[img_comp4]:{{site.imgurl}}UIMaker/image_uimaker_comp4.jpg
[img_comp5]:{{site.imgurl}}UIMaker/image_uimaker_comp5.jpg
[img_comp6]:{{site.imgurl}}UIMaker/image_uimaker_comp6.jpg

[img_entry0]:{{site.imgurl}}UIMaker/image_uimaker_entry_0.jpg
[img_entry1]:{{site.imgurl}}UIMaker/image_uimaker_entry_1.jpg
[img_entry2]:{{site.imgurl}}UIMaker/image_uimaker_entry_2.jpg
[img_entry3]:{{site.imgurl}}UIMaker/image_uimaker_entry_3.jpg
[img_entry4]:{{site.imgurl}}UIMaker/image_uimaker_entry_4.jpg
