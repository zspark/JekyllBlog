---
layout: page
title: Casually
permalink: /casually/
---
##
{% raw %}
##GLSL编程拾零

* GLSL中的矩阵、向量的+、-、\*、/在一定条件下为分量计算；扩展：
Hadamard product(matrices);
* GLSL中的矩阵是列优先矩阵；
* GLSL中基本运算需要多加注意小数点，比如float f=1/9;最后的f是0，而不是0.111111，如果写成float=1.0/9.0;结果才是0.111111；有这样写法的朋友可能写过一段时间脚本程序。
* gl_FragCoord
* distance();


《http://gamedevelopment.tutsplus.com/tutorials/how-to-write-a-smoke-shader--cms-25587》文章中将使用2个FBO，分别存储A、B两个纹理对象，第一次渲染将A的纹理数据经过算计计算后写入B，将B渲染到舞台上，第二次渲染将B的经过算法写入A，再将A渲染到舞台上。如此反复；

##OpenGL基本渲染管线流程

|元素|所在标架|说明|
|:----:|:----:|:-----:|
|模型|模型空间（物体空间）|建模时期|
|模型地形组成的世界|世界空间（全局空间）||
|照相机、观察者|眼空间（照相机空间）||
|模型|裁剪坐标系|经过投影变换后|
|模型|NDC|透视除法后|
|模型|NDC|执行正投影|
|模型|窗口坐标系|视口变换后|

##我的工具箱

* picpick：非常优秀的图片简单处理工具，免费；
* geogebra：2D几何绘图软件，外加简单的3D；
* vim：“vim在手，天下我有”；
* filezilla：开源FTP工具；
* procexp：系统进程查看工具，非常优秀；
* umlet：UML绘图工具，开源；
* freemind：非常优秀的脑图软件，整合你的开发思维，开源；
* git：版控软件，时间穿越不再是梦；
* vlc：天朝的《暴风影音》《迅雷看看》等等等烦不烦？广告烦不烦？试试这个，开源、全平台的视屏播放器，我非常喜欢；
* xnviewer：国外免费的图像处理软件，比picpick功能全，非常优秀；
* notepad2：notepad是win系统自带的文本编辑器，notepad2是款非常简单的文本编辑器，全部4个文件（一个exe，一个配置ini，2个文本txt），用它来可以替代系统notepad，功能很全，甚至还有语法高亮，保证你会喜欢上他；
* 7z：压缩软件，开源；
* krita：非常优秀的涂鸦软件，随心所欲，想画就画，开源；
* Sumatra PDF：开源pdf阅读软件，非常轻巧；

##拾零

glCullFace(GL_BACK);
glEnable(GL_CULL_FACE);
glEnable(GL_DEPTH_TEST);
glEnable(GL_LIGHTLING);
glFrontFace(GL_CCW);

* [这里][3]Mathjax公式语法；

* [这里][1]有charley_yang的一篇关于C++ typedef的用法小结，对自己有帮助，希望也能帮助到别人。
* [这里][2]是一篇关于Jekyll的文章，总结还算全面。
[这里][4]这里有一篇不错的文章，介绍vs中各种路径。

##vim

* [这里][url2]有个介绍vim字体相关设置的文章；
* [这里][url1]有个介绍vim录制功能的：
* 查看光标处到文件头这部分内容的相关信息：g ^G

###NERDTree在\_vimrc中的基本配置
在 vim 启动的时候默认开启 NERDTree（autocmd 可以缩写为 au）

>autocmd VimEnter * NERDTree

按下 F2 调出/隐藏 NERDTree

>map \<F2\> :silent! NERDTreeToggle\<CR\>

将 NERDTree 的窗口设置在 vim 窗口的右侧（默认为左侧）

>let NERDTreeWinPos="right"

当打开 NERDTree 窗口时，自动显示 Bookmarks

>let NERDTreeShowBookmarks=1


##Window下的文件连接
这个功能非常好用，我也是之前从linux系统中学来的，就是一个文件如果被好多功能共享的时候，而你又不想或者不能复制多份文件，此时文件连接就非常好用。

在以管理员运行的命令行中输入：mklink /?可以查看mklink的帮助


==EOF==

[1]:http://www.cnblogs.com/charley_yang/archive/2010/12/15/1907384.html
[2]:http://higrid.net/c-art-blog_jekyll.htm
[3]:http://mlworks.cn/posts/introduction-to-mathjax-and-latex-expression/
[4]:http://blog.csdn.net/lp310018931/article/details/47991759

[url1]:http://www.cnblogs.com/sunyubo/archive/2010/09/15/2282123.html
[url2]:http://vim.wikia.com/wiki/Setting_the_font_in_the_GUI
