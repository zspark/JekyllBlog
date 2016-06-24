---
layout: post_with_wisdom
title:  "Prototype.JS"
date:   2016-06-10
category: CS
published: true
excerpt: ""
wisdom: Prototype takes the complexity out of client-side web programming. Built to solve real-world problems, it adds useful extensions to the browser scripting environment and provides elegant APIs around the clumsy interfaces of Ajax and the Document Object Model.
meta: 
author: 
tags: [prototype JS js]
---

V：1.7.3

## 模块：Ajax

### 类：Ajax.PeriodialUpdater
{{site.b}}PrototypeJS针对Ajax的函数中有个让我新鲜的API参数，该接口叫Ajax.PeriodicalUpdater，其参数（可选）为frequency(Number,default=2)与decay(Number,default=1)，frequency表示间隔多少秒后全新发送一次请求，鉴于网络传输时间的异同，这里的间隔并不是发送到下一次发送，而是上一次发送返回到下一次发送开始；decay表示发送间隔延迟的倍数，默认为1表示永远只间隔2秒发送下一个，如果是2的话，第二次请求是2秒后，而第三次请求就是2*2=4秒后了，第四次是4*2=8秒后...这个间隔的增长并不以为这可以在越来越长的间隔内做些“坏事”，当上一次返回的数据不合法的话，请求间隔会重新从默认值开始。

**PeriodicalUpdater与Updater不同，没有继承关系**

### 类：Ajax.Request
{{site.b}}Request就是个对一次通信数据、回调函数的包装结构，它有着相对简短的生命周期：

* Created：创建
* Initialized：初始化
* Request sent：请求发送
* Response being received ( can occur many times, as packets come in )：接收响应，可能触发多次；
* Response received, request compelte：全部接收，完成；

{{site.b}}官方文档强调了一下onComplete事件。无论成功与否，都会在最后回调完成事件，加入还有onSuccess事件的话，那肯定是先onSuccess后onComplete。onSuccess会在下面二种情况下被调用：1. 收到的网络状态码不识别；2. 收到的网络状态码为2xy家族；**如果请求的数据符合同源条件，并且符合以下MIME-types的话，Prototype.JS会在收到数据后调用eval执行，所以你甚至都不需要在Request实例中写回调函数。**

符合的MIME-types为：

* application/ecmascript
* applicqation/javascript
* application/x-ecmascript
* application/x-javascript
* text/ecmascript
* text/javascript
* text/x-ecmascript
* text/x-javascript


### 类：Ajax.Updater
{{site.b}}Updater类是Request类的子类，用于在收到回应数据后刷新指定的DOM元素的内容，构造函数参数有evalScript，表示是否先执行回应数据内部的JS代码，后刷新元素内容。可以将第一个参数使用一个对象代替，这样可以加入success与failure两个键值对，表示针对不同的响应对不同的DOM元素进行刷新。

==TBC==

[url1]:http://www.regexlab.com/zh/regref.htm
[url2]:https://msdn.microsoft.com/zh-cn/library/ae5bf541(VS.80).aspx
[url3]:http://tool.oschina.net/regex/


