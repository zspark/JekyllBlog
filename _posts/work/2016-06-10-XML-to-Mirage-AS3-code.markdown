---
layout: post_with_wisdom
title:  "MornUI Builder的输出XML数据向AS3代码的解释程序"
date:   2016-06-10
category: work
published: true
excerpt: ""
wisdom: 君子喻于义，小人喻于利  ——	孔子
meta: 
author: 
tags: [MoreUI,翻译器]
---

{{site.b}}鉴于MoreUI Builder生成的.as文件逻辑，是动态的解析由其生成的XML数据，这种解析难免影响手机端的运算效率，故使用JS编写预解析程序。无论从代码的清晰度还是性能上绝对高于动态解析XML文件的方式，工具值得推广到所有该项目的人员使用，但是该项目没有相关严格的编程规范，这种情况下大家肯定更加倾向于使用动态解析的方式，因为人总是有惰性与熟练依赖性。

{{site.b}}具体的程序没什么出彩的地方，整个逻辑的核心就是查找替换、记录输出。其中查找替换需要劲量遵循上下文，否则有可能产生误替。比如类名Text需要替换成Label的话，不但需要大小写符合，而且需要前面有冒号等，随性的话可能替换文本中的Text单词。

{{site.b}}对了，JS对XML的解析使用的是jQuery提供的方法，整体的思路是使用了浏览器DOM解析引擎。

{% include image.html src="mornUI/mornUIdata.jpg" caption="mornUI生成的UI界面数据" width="100%" align="center" %}
{% include image.html src="mornUI/preparsedData.jpg" caption="经过预解析后，生成的as3代码（部分）" width="100%" align="center" %}

### 这里是程序

{% highlight js linenos %}
<html>
    <head>
        <title>FTX XML Tool</title>
        
        <script type="text/javascript" src="./jquery-2.2.4.min.js"></script>
        <script type="text/javascript" src="./XMLParser.js"></script>
        <script type="text/javascript" src="./classParser.js"></script>
    </head>
    <body>
        <form>
            <input type="radio" name="a" id="radio2" checked="true">处理XML</input>
            <input type="radio" name="a" id="radio3" >处理initHandler</input>
         </form>
         
        <textarea id="txt1" rows="40" cols="80"> </textarea>
        <button type="button" onclick="onButtonClick()">>></button>
         <textarea id="txt2" rows="40" cols="80">Here will output the result.</textarea>
    </body>
</html>
{% endhighlight %}
{% highlight js linenos %}
const PACKAGE_REGEXP=/\s*package\s+([\w\.]+)\s*(?=\{)/;
const IMPORT_REGEXP=/\s*import\s+[\w\.]+\s*;/g;
const EXTENDS_REGEXP=/\s+extends\s+(\w+)(?=\s*\{)/g;
const matchers=[
  {regexp:/:\s*Button(?=\s+|=)/g,target:":ClipButton"},
  {regexp:/:\s*Label(?=\s+|=)/g,target:":Text"},
  {regexp:/:\s*TextInput(?=\s+|=)/g,target:":InputText"},
  {regexp:/:\s*List(?=\s+|=)/g,target:":ExtList"},
  {regexp:/:\s*Image(?=\s+|=)/g,target:":Bitmap"},
  {regexp:/:\s*Tab(?=\s+|=)/g,target:":TabBar"},
  {regexp:/:\s*Clip(?=\s+|=)/g,target:":ClipImage"},
  {regexp:/:\s*Frame569UI(?=\s+|=)/g,target:":Frame569"},
  {regexp:/:\s*Frame892UI(?=\s+|=)/g,target:":Frame892"},
  {regexp:/:\s*(Panel|Box)(?=\s+|=)/g,target:":Container"},
];
const XML_REGEXP=/[\s\w]+var\s+uiXML\s*:\s*XML\s*=\s*(<\s*(\w+)\s+width\s*=\s*"(\d+)\s*"\s+height\s*=\s*"(\d+)\s*"[\u0000-\uFFFF]+\2\s*>)/;
const INSERT_POINT_REGEXP=/[\s\w]+function\s+createChildren[\u0000-\uFFFF]+\{[\u0000-\uFFFF]+\}/;

//<View width="62" height="98">

function parseAS3Class(classTxt){
    var txt=classTxt.replace(IMPORT_REGEXP,"");
    txt=txt.replace(EXTENDS_REGEXP," extends Container");
    txt=changeClassName(txt);
    
    var xmlTxt=txt.match(XML_REGEXP);
    
     txt=txt.replace(xmlTxt[0],"");
    var comp=parseXMLtoAS3Code(xmlTxt[1],xmlTxt[3],xmlTxt[4]);
    txt=txt.replace(INSERT_POINT_REGEXP,comp)
    
    return txt+'}}';
}

function changeClassName(txt){
     var i=0;
     while(i<matchers.length){
         var obj=matchers[i];
         var regexp=obj.regexp;
         var target=obj.target;
         
         txt=txt.replace(regexp,target);
         i++;
     }
     return txt;
};

var currentType=null;

function judge(){
    var arr=document.getElementsByName("a");
    for (var i=0;i<arr.length;i++){
        var r=arr[i];
        if(r.checked){
            switch(r.id){
                case "radio2":currentType="xml";break;
                case "radio3":currentType="fn";break;
                default:currentType='';break;
            }
            return;
        }
    }
};

function onButtonClick(){
    var oldTxt=document.getElementById("txt1").value;
    judge();
    switch (currentType) {
        case "xml":
            document.getElementById("txt2").value=parseAS3Class(oldTxt);
            break;
        case "fn":
            document.getElementById("txt2").value=handle_initHandler(oldTxt);
            break;
        default:
            alert("F M! can't recognize!");
            break;
    }
};

function handle_initHandler(txt){
    const REG=/clickHandler(?=\s*=)/g;
    txt=txt.replace(REG,"defaultTouchHandler");
    
    const REG4=/renderHandler(?=\s*=)/g;
    txt=txt.replace(REG4,"itemRenderHandler");
    
    const REG3=/selectHandler(?=\s*=)/g;
    txt=txt.replace(REG3,"itemSelectHandler");
    
    const REG2=/new\s+Handler\s*\((\w+)\)\s*(?=;)/g;
    txt=txt.replace(REG2,"$1");
    return txt;
}

var result=null;
var l_w=0;
var l_h=0;

function parseXMLtoAS3Code(xml,w,h){
    tmpCount=1;
    l_w=w;
    l_h=h;
    result="\noverride protected function createChildren():void {\n";
    addLineCode("this.width="+w+";");
    addLineCode("this.height="+h+";");
    addLineCode("super.createChildren();")
    
    var xml2=$("<xml>"+xml+"</xml>").find("View")[0];
    if(!xml2)xml2=$("<xml>"+xml+"</xml>").find("Dialog")[0];
    if(!xml2)alert("不存在的xml跟标签，默认查找的是View与Dialog，如果是新的请联系z_Spark");
    
    var childElement=xml2.firstElementChild;//like image
     traversal("this",childElement);
    addLineCode("}")
    return result;
    
}

function traversal(parent,ele){
    while(ele!=null){
        var childVar=parseXMLElement(parent,ele);
        if(ele.firstElementChild){
            traversal(childVar,ele.firstElementChild);
        }
        ele=ele.nextElementSibling;
    }
}

function parseXMLElement(parent,ele){
    //<img skin="png.friend.bg_firend" x="0" y="0" var="bg_firend">
    var childVar=null;
    var att=ele.attributes;
    switch (ele.localName) {
        case "img":
            childVar=getBitmapCode(parent,"Bitmap",att);
            break;
        case "button":
            childVar=genClipButtonCode(parent,"ClipButton",att);
            break;
        case "clip":
        case "clipimage":
            childVar=genClipImageCode(parent,"ClipImage",att);
            break;
        case "clipnumber":
            childVar=genClipNumberCode(parent,"ClipNumber",att);
            break;
        case "label":
            childVar=genTextCode(parent,"Text",att);
            break;
        case "vbox":
            childVar=genCode(parent,"VBox",att);
            break;
        case "hbox":
            childVar=genCode(parent,"HBox",att);
            break;
        case "panel":
        case "container":
        case "box":
            childVar=genContainerCode(parent,"Container",att);
            break;
        case "textinput":
            childVar=genInputTextCode(parent,"InputText",att);
            break;
        case "list":
            childVar=genExtListCode(parent,"ExtList",att);
            break;
        case "frienditem":
            childVar=genCode(parent,"FriendItem",att);
            break;
        case "checkbox":
            childVar=genCheckBoxCode(parent,"CheckBox",att);
            break;
        case "exttilelist":
            childVar=genExtTileListCode(parent,"ExtTileList",att);
            break;
        case "progressbar":
            childVar=genProgressBarCode(parent,"ProgressBar",att);
            break;
        case "tab":
            childVar=genCode(parent,"TabBar",att);
            break;
        case "frame569":
            childVar=genFrameCode(parent,"Frame569",att);
            break;
        case "frame892":
            childVar=genFrameCode(parent,"Frame892",att);
            break;
        default:
            addLineCode("//这里有个对"+ele.localName+"的解析，父容器为:"+parent+" 请自行添加。");
            alert("F M ,没有这样的元素，自行添加对其的解析。"+ele.localName)
            break;
    }
    addLineCode('');
    return childVar;
}

var tmpCount=1;

function genCheckBoxCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="skin"){
            addLineCode("var clipImage:ClipImage = new ClipImage();");
            addLineCode("clipImage.skinID = \""+element.value+".png\";");
            addLineCode("clipImage.validate();");
            addLineCode(childVar+".upTexture = clipImage.clips[0];");
            addLineCode(childVar+".selectTexture = clipImage.clips[2];");
        }else if(element.name=="label"){
            addLineCode(childVar+".textFormat = new TextFormat('',12,0xffffff);");
            addLineCode(childVar+".text = \""+element.value+"\";");
        }else if(element.name=="size"){
            addLineCode(childVar+".textFormat.size = \""+element.value+"\";");
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="mouseenabled"){
            addLineCode(childVar+".mouseEnabled = "+element.value+";");
        }else if(element.name=="scalex"){
            addLineCode(childVar+".scaleX = "+element.value+";");
        }else if(element.name=="scaley"){
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="scale"){
            addLineCode(childVar+".scaleX = "+element.value+";");
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    return childVar;
};

function genExtTileListCode(parent,childClassName,att){
     var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="skin"){
            addLineCode(childVar+".backTextureID = \""+element.value+".png\";");
            addLineCode(childVar+".handleTextureID = \""+element.value+"$bar."+element.value.substr(0,3)+"\";");
        }else if(element.name=="text"){
            addLineCode(childVar+".text = \""+element.value+"\";");
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="scalex"){
            addLineCode(childVar+".scaleX = "+element.value+";");
        }else if(element.name=="scaley"){
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="scale"){
            addLineCode(childVar+".scaleX = "+element.value+";");
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    return childVar;
}

function genInputTextCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    addLineCode("var tf:TextFormat = new TextFormat();");
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="text"){
            addLineCode(childVar+".text = \""+element.value+"\";");
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="space"){
            addLineCode(childVar+".spacing = "+element.value+";");
        }else if(element.name=="mouseenabled"){
            addLineCode(childVar+".mouseEnabled = "+element.value+";");
        }else if(element.name=="maxchars"){
            addLineCode(childVar+".maxChar = "+element.value+";");
        }else if(element.name=="scalex"){
            addLineCode(childVar+".scaleX = "+element.value+";");
        }else if(element.name=="scaley"){
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="scale"){
            addLineCode(childVar+".scaleX = "+element.value+";");
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="runtime"){
            addLineCode("//"+childVar+".runtime = "+element.value+";");
        }else if(element.name=="color"){
            addLineCode("tf.color = "+element.value+";");
        }else if(element.name=="font"){
            addLineCode("tf.font = \""+element.value+"\";");
        }else if(element.name=="size"){
            addLineCode("tf.size = "+element.value+";");
        }else if(element.name=="align"){
            
            if(element.value=="center"){
                addLineCode("tf.hAlign = TextField.ALIGN_CENTER;");
            }else if(element.value=="left"){
                addLineCode("tf.hAlign = TextField.ALIGN_LEFT;");
            }else if(element.value=="right"){
                addLineCode("tf.hAlign = TextField.ALIGN_RIGHT;");
            }
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    addLineCode(childVar+".textFormat =tf;");
    return childVar;
};

function genTextCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    addLineCode("var tf:TextFormat = new TextFormat();");
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="text"){
            addLineCode("if("+childVar+".htmlText == \"1\")"+childVar+".htmlText = \""+ element.value+"\";");
            addLineCode("else "+childVar+".text = \""+element.value+"\";");
        }else if(element.name=="ishtml"){
            addLineCode("if("+element.value+"){");
                 addLineCode("if("+childVar+".text )"+childVar+".htmlText = "+ childVar+".text;");
                 addLineCode("else "+childVar+".htmlText =\"1\";");
            addLineCode("}");
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="mouseenabled"){
            addLineCode(childVar+".mouseEnabled = "+element.value+";");
        }else if(element.name=="stroke"){
            addLineCode("//z_Spark commit:Text暂无stroke属性;");
            addLineCode("//"+childVar+".stroke = "+element.value+";");
        }else if(element.name=="wordwrap"){
            addLineCode("//z_Spark commit:Text暂无wordWrap属性;");
            addLineCode("//"+childVar+".wordWrap = "+element.value+";");
        }else if(element.name=="backgroundcolor"){
            addLineCode("//z_Spark commit:Text暂无backgroundcolor属性;");
            addLineCode("//"+childVar+".backgroundcolor = "+element.value+";");
        }else if(element.name=="scalex"){
            addLineCode(childVar+".scaleX = "+element.value+";");
        }else if(element.name=="scaley"){
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="scale"){
            addLineCode(childVar+".scaleX = "+element.value+";");
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="color"){
            addLineCode("tf.color = "+element.value+";");
        }else if(element.name=="font"){
            addLineCode("tf.font = \""+element.value+"\";");
        }else if(element.name=="size"){
            addLineCode("tf.size = "+element.value+";");
        }else if(element.name=="align"){
            
            if(element.value=="center"){
                addLineCode("tf.hAlign = TextField.ALIGN_CENTER;");
            }else if(element.value=="left"){
                addLineCode("tf.hAlign = TextField.ALIGN_LEFT;");
            }else if(element.value=="right"){
                addLineCode("tf.hAlign = TextField.ALIGN_RIGHT;");
            }
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    addLineCode(childVar+".textFormat =tf;");
    return childVar;
};

function genClipImageCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="skin"){
            addLineCode(childVar+".skinID = \""+element.value+".png\";");
        }else if(element.name=="clipy"){
            addLineCode(childVar+".direction = Style.VERTICAL;");
            addLineCode(childVar+".clipCount = "+element.value+";");
        }else if(element.name=="clipx"){
            addLineCode(childVar+".direction = Style.HORIZONTAL;");
            addLineCode(childVar+".clipCount = "+element.value+";");
        }else if(element.name=="mouseenabled"){
            addLineCode(childVar+".mouseEnabled = "+element.value+";");
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    return childVar;
};

function genClipNumberCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="skin"){
            addLineCode(childVar+".skinID = \""+element.value+".png\";");
        }else if(element.name=="clipy"){
            addLineCode(childVar+".clipDirection = Style.VERTICAL;");
        }else if(element.name=="clipx"){
            addLineCode(childVar+".clipDirection = Style.HORIZONTAL;");
        }else if(element.name=="mouseenabled"){
            addLineCode(childVar+".mouseEnabled = "+element.value+";");
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    return childVar;
};

function getBitmapCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="skin"){
            addLineCode(childVar+".textureID = \""+element.value+".png\";");
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="mouseenabled"){
            addLineCode(childVar+".mouseEnabled = "+element.value+";");
        }else if(element.name=="scalex"){
            addLineCode(childVar+".scaleX = "+element.value+";");
        }else if(element.name=="scaley"){
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="scale"){
            addLineCode(childVar+".scaleX = "+element.value+";");
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="anchorx"){
            addLineCode(childVar+".pivotX = "+element.value+";");
            addLineCode("if("+childVar+".pivotX >0 && "+childVar+".pivotX !=1 && "+childVar+".placeWidth >0){");
            addLineCode(childVar+".x -= "+childVar+".placeWidth * "+childVar+".pivotX;}");
        }else if(element.name=="anchory"){
            addLineCode(childVar+".pivotY = "+element.value+";");
            addLineCode("if("+childVar+".pivotY >0 && "+childVar+".pivotY !=1 && "+childVar+".placeHeight >0){");
            addLineCode(childVar+".y -= "+childVar+".placeHeight * "+childVar+".pivotY;}");
        }else if(element.name=="sizegrid"){
            addLineCode(childVar+".grid9 = ["+element.value.split(',')+"];");
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    return childVar;
};

function genClipButtonCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"|element.name=="buttonmode"){
        }else if(element.name=="skin"){
            addLineCode(childVar+".skinID = \""+element.value+".png\";");
        }else if(element.name=="label"){
            addLineCode(childVar+".text = \""+element.value+"\";");
        }else if(element.name=="labelsize"){
            addLineCode("if(!"+childVar+".textFormat)"+childVar+".textFormat = new TextFormat();");
            addLineCode(childVar+".textFormat.size = \""+element.value+"\";");
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="statenum"){
            if(element.value == "1")
            {
                addLineCode(childVar+".skinArr = [ClipButton.UP];");
            }
            else if(element.value == "2")
            {
                addLineCode(childVar+".skinArr = [ClipButton.UP,ClipButton.DOWN];");
            }
        }else if(element.name=="mouseenabled"){
            addLineCode(childVar+".mouseEnabled = "+element.value+";");
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    return childVar;
};

function genContainerCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"|element.name=="buttonmode"){
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="mouseenabled"){
            addLineCode(childVar+".mouseEnabled = "+element.value+";");
        }else if(element.name=="vscrollbarskin"){
            
            addLineCode("//z_Spark commit:Panel暂无vScrollBarSkin属性;");
            addLineCode("//"+childVar+".vScrollBarSkin = \""+element.value+"\";");
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    return childVar;
};

function genExtListCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="skin"){
            addLineCode(childVar+".skinID = \""+element.value+".png\";");
        }else if(element.name=="text"){
            addLineCode(childVar+".text = \""+element.value+"\";");
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="spacex"){
            addLineCode(childVar+".hspace = "+element.value+";");
        }else if(element.name=="spacey"){
            addLineCode(childVar+".vspace = "+element.value+";");
        }else if(element.name=="scalex"){
            addLineCode(childVar+".scaleX = "+element.value+";");
        }else if(element.name=="scaley"){
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="scale"){
            addLineCode(childVar+".scaleX = "+element.value+";");
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    return childVar;
};

function genExtTileListCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="skin"){
            addLineCode(childVar+".skinID = \""+element.value+".png\";");
        }else if(element.name=="text"){
            addLineCode(childVar+".text = \""+element.value+"\";");
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="spacex"){
            addLineCode(childVar+".spaceX = "+element.value+";");
        }else if(element.name=="spacey"){
            addLineCode(childVar+".spaceY = "+element.value+";");
        }else if(element.name=="repeatX"){
            addLineCode(childVar+".hTile = "+element.value+";");
        }else if(element.name=="repeatY"){
            addLineCode(childVar+".vTile = "+element.value+";");
        }else if(element.name=="scalex"){
            addLineCode(childVar+".scaleX = "+element.value+";");
        }else if(element.name=="scaley"){
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="scale"){
            addLineCode(childVar+".scaleX = "+element.value+";");
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    return childVar;
};

function genCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="text"){
            addLineCode(childVar+".text = \""+element.value+"\";");
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }else if(element.name=="space"){
            addLineCode(childVar+".spacing = "+element.value+";");
        }else if(element.name=="mouseenabled"){
            addLineCode(childVar+".mouseEnabled = "+element.value+";");
        }else if(element.name=="scalex"){
            addLineCode(childVar+".scaleX = "+element.value+";");
        }else if(element.name=="scaley"){
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="scale"){
            addLineCode(childVar+".scaleX = "+element.value+";");
            addLineCode(childVar+".scaleY = "+element.value+";");
        }else if(element.name=="runtime"){
            addLineCode("//"+childVar+".runtime = "+element.value+";");
        }else{
            addLineCode(childVar+"."+element.name+" = "+element.value+";");
        }
    }
    return childVar;
};

function genFrameCode(parent,childClassName,att){
    var childVar=genCommon(parent,childClassName,att);
    
    for (var i=0;i<att.length;i++){
        var element=att[i];
        if(element.name=="var"){
        }else if(element.name=="name"){
            addLineCode(childVar+".compName = \""+element.value+"\";");
        }
    }
    addLineCode(childVar+".width = "+l_w+";");
    addLineCode(childVar+".height = "+l_h+";");
    return childVar;
};



function genCommon(parent,childClassName,att){
    var field=att["var"];
    var childVar='';
    if(field){
        childVar=field.value;
         addLineCode(childVar+" = new "+childClassName+"();");
    }else{
        childVar="tmp"+tmpCount;
         addLineCode("var tmp"+tmpCount+":"+childClassName+" = new "+childClassName+"();");
         tmpCount++;
    }
    addLineCode(parent+".addChild("+childVar+");");
    return childVar;
}

function addLineCode(txt){
    result+=txt+"\n";
}

{% endhighlight %}


==EOF==


