---
layout: post_with_wisdom
title: "OpenGL立方体纹理备忘"
date:   2016-02-29
categories: jekyll CG
published: true
excerpt: ""
wisdom: “倘若代码和注释不一致，那么很可能两者都是错的。” —— Norm Schryer
meta: 
subImgPath: cg\
author: 
tags: [texture, cubeTexture]
---
尝试给立方体贴纹理，这里小做笔记：

{% highlight c++ linenos%}

//激活指定纹理单元；不写的话默认激活0号纹理单元；
glActiveTexture(GL_TEXTURE1);
//申请显卡缓存id;
GLuint id;
glGenTextures(1,&id);
//指定该id所指向的显存保存立方体纹理;
glBindTexture(GL_TEXTURE_CUBE_MAP,id);
//设置该纹理的相关参数；
glTexParameteri(GL_TEXTURE_CUBE_MAP,GL_TEXTURE_WRAP_S,GL_REPEAT);
glTexParameteri(GL_TEXTURE_CUBE_MAP,GL_TEXTURE_WRAP_T,GL_REPEAT);
glTexParameteri(GL_TEXTURE_CUBE_MAP,GL_TEXTURE_WRAP_R,GL_REPEAT);
glTexParameteri(GL_TEXTURE_CUBE_MAP,GL_TEXTURE_MIN_FILTER,GL_LINEAR);
glTexParameteri(GL_TEXTURE_CUBE_MAP,GL_TEXTURE_MAG_FILTER,GL_LINEAR);
//设置纹理数据；
int w, h, c;
unsigned char* image = stbi_load("data/textures/skybox/px.jpg", &w, &h, &c, 0);
std::cout << "image size:" << w << "," << h << endl;
glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_X, 0, GL_RGB, w, h, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
stbi_image_free(image);
image = stbi_load("data/textures/skybox/nx.jpg", &w, &h, &c, 0);
std::cout << "image size:" << w << "," << h << endl;
glTexImage2D(GL_TEXTURE_CUBE_MAP_NEGATIVE_X, 0, GL_RGB, w, h, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
stbi_image_free(image);
image = stbi_load("data/textures/skybox/py.jpg", &w, &h, &c, 0);
std::cout << "image size:" << w << "," << h << endl;
glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_Y, 0, GL_RGB, w, h, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
stbi_image_free(image);
image = stbi_load("data/textures/skybox/ny.jpg", &w, &h, &c, 0);
std::cout << "image size:" << w << "," << h << endl;
glTexImage2D(GL_TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, GL_RGB, w, h, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
stbi_image_free(image);
image = stbi_load("data/textures/skybox/pz.jpg", &w, &h, &c, 0);
std::cout << "image size:" << w << "," << h << endl;
glTexImage2D(GL_TEXTURE_CUBE_MAP_POSITIVE_Z, 0, GL_RGB, w, h, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
stbi_image_free(image);
image = stbi_load("data/textures/skybox/nz.jpg", &w, &h, &c, 0);
std::cout << "image size:" << w << "," << h << endl;
glTexImage2D(GL_TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, GL_RGB, w, h, 0, GL_RGB, GL_UNSIGNED_BYTE, image);
stbi_image_free(image);
//获取片元着色器中的立方体采样器地址；
GLuint samperLocation=glGetUniformeLocation(program,"fSamperCube");
//指定该采样器从具体纹理单元采样；
glUniform1i(samperLocation,1);
//其他..

{%endhighlight %}

需要注意的是:

1. 立方体纹理不必设置立方体8个顶点的纹理坐标，只需要将指定的8个顶点在空间中的正常坐标（三维的），通过顶点着色器传递给片元着色器后，使用texture函数采样即可；
2. 给纹理类型填充纹理数据时不要混乱，可以熟记那个横放的十字架图（见下图），交点位置自己确定后，其他5个面顺序也就固定了；

![cube_texture][img_cube_texture] <br>图片来自[维基百科][site_url]


{% highlight glsl linenos%}
//顶点着色器：
#version 430
in vec4 vPosition;
out vec3 fTexCoord

void main(){
 //将立方体正常的顶点坐标传奇给片元着色器；
 fTexCoord=vPosition.rgb;
}

//片元着色器：
#version 430
in vec3 fTexCoord;
uniform samplerCube fSamperCube;

void main(){
 //立方体采样器通过texture函数正常采样；
 vec4 texColor = texture(fSamperCube,fTexCoord);
 gl_FragColor=texColor;
}

{% endhighlight %}

==EOF==

[img_cube_texture]:{{site.basepath}}{{site.imgpath}}{{page.subImgPath}}image_cube_texture.jpg "cube_texture"
[site_url]:https://en.wikipedia.org/wiki/Cube_mapping
