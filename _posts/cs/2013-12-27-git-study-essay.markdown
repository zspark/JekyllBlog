---
layout: post_with_wisdom
title:  "Git学习、复习随笔"
date:   2013-12-27 21:51:15
categories: jekyll cs
published: true
excerpt: "Git学习、复习随笔"
wisdom: 学而时习之，不亦说乎。 —— 孔子
meta: 
author: 
tags: [git,version-control]
---

*这篇文章是在我2013年博文[《Git安装随笔》][1]的基础上修改完成的，此时的我肯定更加熟悉Git。*

##  概括

{{site.blank}}按照公司要求，新的3D项目及其库项目使用Git作为版本管理系统，之前有同事集中普及过一次Git的基本操作，这次受命于公司也算与Git有缘吧。这里记录下自己学习Git的相关笔记与学习、复习心得；

{{site.blank}}[Git][2]是一款开源软件，采用分布式管理的做法，不再绝对集中控制版本的不同，而是将诸如SVN，CVS等集中式管理版本的做法“移植”到了本地，这种做法有助于扩大开发者的自由度，理论上可以本地无限制的创建与销毁分支`branch`而不会影响到其他的合作开发者。这里说的是‘不再绝对集中’意思是Git虽然是分布式管理系统，但依然可以通过服务器来控制汇总，让合作开发者能够同步各自的最新进展。

{{site.blank}}Git服务端的安装我暂时不太清楚也暂不深入计较，但在使用本地Git时你需要知道这样一件事：如果你打算克隆`clone`一份Git服务器上的仓库或是提交你的程序到Git服务器，你都需要向服务器证明：‘你是谁？’，如果你不这样做服务器是不会接受你的提交请求`pull request`的。

{{site.blank}}如何要让服务器知道你是谁呢？Git的设计者做了这样一个策略：所有想要克隆或者提交程序的客户端都需要到Git服务器注册自己的信息，注册时粘贴由本地Git客户端生成的一串公开字符串（称为公钥`public key`，我们暂时称为A串）即可，这字符串便是客户端的ID。这样每当Git客户端提交文件的时候，会连同生成的另外一串字符串（称为私钥`private key`，我们暂时称为B串）一起提交，服务器收到后经过算法计算出全新的一个字符串（我们暂时称为C串）后，与你之前提交的A串进行比较，如果相同就证明你是之前提交过公开字符串的客户端，他就会接受而不拒绝本次提交请求。

## TortoiseGit.exe

{{site.blank}}[TortoiseGit][3]的安装与使用无异于TortoiseSVN，除了部分界面不同以外，其他界面基本相同，推荐从SVN转过来的程序员使用；需要说明的是TortoiseGit是运行在Git的命令行的基础上的，也就是说TortoiseGit是个外衣，其核心依然是Git客户端。这就要求我们如果打算使用[TortoiseGit][3]的话，需要先安装[Git][2]客户端。

## Git.exe
{{site.blank}}[Git][2]客户端的安装相比[TortoiseGit][3]要复杂一些（仅仅是这两个软件的安装而言）。windows系统`Git-for-windows`下的安装过程中会让你选择具体的内容，比如是否安装Git命令行`Git-bash`给其他pc机用户，是否创建PATH环境变量，是否安装Git界面`Git-GUI`（没错，Git开源组织也开发了Git的外衣，还有好多，比如github客户端），是否安装高级什么什么交互的插件,是使用openSSH还是使用PuTTY SSH等，各取所需，无须赘述。


今天除了全面了解、安装Git以外，还熟悉了基本的Git-bash命令：

* 注册基本信息：`git config --global  name="zspark";git config --global email="z_spark@163.com"`
* 需要指定服务器git地址，首次使用后会在~ /.ssh下生成know_hosts文件，保存服务器Git信息，以便下次使用；
`git clone remote-git-server-URL;`
* 拉取服务器数据；`git pull origin-repository;`
* 查阅命令帮助：`git help <cmd name>;`
* 新建分支：`git branch new-branch-name;`
* 删除分支：`git branch -d exist-branch-name;`-D参数表示强制删除未合并分枝；
* 切换分支：`git checkout exist-branch-name;`
* 查看有几个源：`git remote -v;`
* 查看当前Git客户端版本：`git --version;`
* 查看历史提交记录：`git log;`
* 查看所有交互记录（包括历史提交记录）：`git reflog;`

## 关于Gerrit审核服务器的启动

比如gerrit安装在：c:/gerrit/

启动：c:/gerrit/bin/gerrit.sh start -d c:/gerrit/

-d或者--gerrit_site

==EOF==

[1]:http://www.zspark.net/?post=12
[2]:http://git-scm.com/
[3]:http://tortoisegit.org/



