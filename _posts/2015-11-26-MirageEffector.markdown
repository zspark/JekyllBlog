---
layout: post
title:  "MirageEffector"
date:   2015-11-26 15:01
categories: jekyll work
published: true
tags: [mirage,effect,2D,particle]
---

##MirageEffector##

&#160; &#160; &#160; &#160;出于flashAMF协议的方便性，公司各种编辑器经可能的使用它去序列化一些数据，其中包括编辑器编辑完成后将要输出的文件。
如果使用这种方法的话，我承认对最终数据的保存与读取会是相当方便，只要在程序中对相关的数据类注册一个别名，将数据与别名序列化进文件中，在正式项目使用该文件的时候反序列化读取即可。方法确实简单，但问题亦是可见。
最明显的问题就是需要向客户暴露编辑器最终文件的数据结构，因为如果不暴露的话反序列化工作不能进行，暴露之后面临着结构化编程中对封装概念的无视与对安全性的无视，当然还有其他不好的地方就是：有时候，可能大部分情况下用户根本不需要你这个结构文件；

&#160; &#160; &#160; &#160;于是我决定抛弃对结构文件的序列化支持，而采用自定义序列化过程。这里记录下MirageEffector最终文件的序列化结构，一方面整理下结构本身，二来好方便查阅；

###pex文件格式###

&#160; &#160; &#160; &#160;从效率与文件大小2个方面考虑的话，我决定去掉对2D粒子属性名（一个字符串）的记录，仅仅记录属性的值，映射过程是固定死了的，比如第一个读出来的数据固定就是粒子初始红色，第二个固定是初始绿色，以此类推；

.pex文件格式：

|id  |类型       |长度     |Mirage中属性名  |说明                              |
|:--:|:---------:|:-------:|:--------------:|:--------------------------------|
|1   |Short      |2        |-/-             |记录该2D粒子属性个数              |
|2   |uint       |4        |-/-             |UTF编码下的纹理名长度             |
|3   |UTFString  |-/-      |texture         |该粒子纹理名（带扩展），路径固定  |
|4   |float      |4        |duration        |粒子系统持续时长（秒）            |
|5   |float      |4        |emitterX        |粒子x坐标            |
|6   |float      |4        |emitterY        |粒子y坐标            |
|7   |float      |4        |emitterXVariance        |x坐标浮动             |
|8   |float      |4        |emitterYVariance        |y坐标浮动             |
|9   |float      |4        |speed        |速度            |
|10   |float      |4        |speedVariance        |速度浮动            |
|11   |float      |4        |lifespan        |生命周期            |
|12   |float      |4        |lifespanVariance        |生命周期浮动            |
|13   |float      |4        |emitAngle        |发射角度            |
|14   |float      |4        |emitAngleVariance        |            |
|15   |float      |4        |gravityX        |水平重力            |
|16   |float      |4        |gravityY        |垂直重力            |
|17   |float      |4        |radialAcceleration        |法（径）向加速度            |
|18   |float      |4        |tangentialAcceleration        |切向加速度            |
|19   |float      |4        |radialAccelerationVariance        |            |
|20   |float      |4        |tangentialAccelerationVariance        |            |
|21   |float      |4        |startColorRed        |岂始红色            |
|22   |float      |4        |startColorGreen        |            |
|23   |float      |4        |startColorBlue        |            |
|24   |float      |4        |startColorAlpha        |            |
|25   |float      |4        |startColorRedVariance        |            |
|26   |float      |4        |startColorGreenVariance        |            |
|27   |float      |4        |startColorBlueVariance        |            |
|28   |float      |4        |startColorAlphaVariance        |            |
|29   |float      |4        |endColorRed        |结束红色            |
|30   |float      |4        |endColorGreen        |            |
|31   |float      |4        |endColorBlue        |            |
|32   |float      |4        |endColorAlpha        |            |
|33   |float      |4        |endColorRedVariance        |            |
|34   |float      |4        |endColorGreenVariance        |            |
|35   |float      |4        |endColorBlueVariance       |            |
|36   |float      |4        |endColorAlphaVariance        |            |
|37   |float      |4        |maxNumParticles        |粒子最大数（注意一个pex文件是一个粒子系统的）            |
|38   |float      |4        |startSize        |起始大小            |
|39   |float      |4        |startSizeVariance        |            |
|40   |float      |4        |endSize        |结束大小            |
|41   |float      |4        |endSizeVariance        |            |
|42   |float      |4        |emitterType        |发射器类型            |
|43   |float      |4        |maxRadius        |最大半径            |
|44   |float      |4        |maxRadiusVariance        |            |
|45   |float      |4        |minRadius        |最小半径            |
|46   |float      |4        |rotatePerSecond        |旋转速度            |
|47   |float      |4        |rotatePerSecondVariance        |            |
|48   |float      |4        |startRotation        |起始旋转角度            |
|49   |float      |4        |startRotationVariance        |            |
|50   |float      |4        |endRotation        |结束旋转角度            |
|51   |float      |4        |endRotationVariance        |            |
|52   |float      |4        |blendMode        |混合类型，枚举            |
|53   |float      |4        |emissionRate        |发射速率            |


###坑###

&#160; &#160; &#160; &#160;我序列化完毕的文件却不能显示出来，几番打印信息发现需要显示数字0的地方，有的显示0，有的显示0.00，马上意识到原数据可能是字符串，经过排查，问题就解决了，确实是字符串。