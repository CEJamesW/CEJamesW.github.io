var xmlHttp;
var jishu = 0;
//根据浏览器创建xmlHttpRequest对象
function getXmlHttpRequest() {
  //针对FireFox,Mozillar,Opera,Safari,IE7,IE8
  if (window.XMLHttpRequest)　　
  return new XMLHttpRequest();
  //针对IE5，IE5.5，IE6
  else if (window.ActiveXObject) {
    //两个可以用于创建XMLHTTPRequest对象的控件名称,保存在一个JS数组中。
    var activexName = ["MSXML2.XMLHTTP", "Microsoft.XMLHTTP"];
    for (var i = 0; i < activexName.length; i++) {
      //取出一个控件名进行创建，如果成功就终止循环
      try {
        return new ActiveXObject(activexName[i]);
        break;
      } catch(e) {
        return null;
      }
    }
  }
}
function jinduload(uuid) {

  xmlHttp = getXmlHttpRequest();
  var url = "/api/renwu/?uuid="+uuid;
  // 注册回调函数,只写函数名，不能写括号，写括号表示调用函数
  xmlHttp.onreadystatechange = getResult;
  // 确定发送请求的方式和URL以及是否同步执行下段代码
  xmlHttp.open("GET", url, true);
  //发送数据，开始和服务器进行交互
  xmlHttp.send(null);
}
//回调函数
function getResult() {
  if (xmlHttp.readyState == 4) { // 判断对象状态
    　　
    if (xmlHttp.status == 200) { // 信息已经成功返回，开始处理信息
      var rt = xmlHttp.responseText;
      var bToObj = JSON.parse(rt);
	  var order_id = bToObj["uuid"]
	  var rsync = bToObj["rsync"]
	  var file = bToObj["file"]
	  jishu += 1
	  if (jishu>10 && rsync == false){
		  $("#jieguo").html("<img src=\"/static/images/juewang.jpg\" alt=\"服务器通讯失败\" class=\"img-thumbnail\"><p>服务器通讯失败,请稍后再试!</p>");
		  jishu = 0;
		  return false;
		  }
		else{
			$("#jieguo").html("<img src=\"/static/images/timg.gif\" alt=\"加入队列成功\" class=\"img-circle\"><p>加入队列成功,请耐心等待!</p>");
			}
	  $("#jieguo").html("<img src=\"/static/images/timg.gif\" alt=\"请耐心等待\" class=\"img-circle\"><p>正在处理,请耐心等待!</p>");
	  if (file !== "")
	  {
		  $("#jieguo").html("<div><h3>转换完成</h3><p>^o^</p><p><a class=\"btn btn-primary btn-lg\" href=\""+file+"\" role=\"button\">点击下载</a></p></div>");
		  return false;
		  }
	else
	{
		setTimeout("jinduload('"+order_id+"')", 3500);
		}
	  
    } else {
      if (xmlHttp.status == "12031") {} else {
        setTimeout("jinduload('"+order_id+"')", 3500);
      }　　
    }

    　　
  }
}