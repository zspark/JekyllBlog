---
layout: post_with_wisdom
title: "OpenGL函数" 
date:   2016-01-14
categories: jekyll CG
published: false
excerpt: ""
wisdom: 软件就像熵：难以把握，没有重量，服从热力学第二定律；比如说，它总是在增长。 —— 诺曼·奥古斯丁（ Norman Augustine），洛克希德马丁公司前总裁
meta: 
author: 
tags: [OpenGL]
---
获取当前使用的渲染程序的id，可以用来判断某个渲染程序是不是正在使用；
GLint currentProgram =0;
glGetIntegerv(GL_CURRENT_PROGRAM,&currentProgram);

GLuint tex;
glGenTextures(1,&tex);
glBindTexture(GL_TEXTURE_2D,tex);
glTexPramateri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_S,GL_REPEAT));
glTexPramateri(GL_TEXTURE_2D,GL_TEXTURE_WRAP_T,GL_REPEAT));






==EOF==

