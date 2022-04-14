//设置全局变量
var maxprocess = 3;
//默认并发线程
var maxdelay = 0;
var maxtryit = 4;
//单次重试
var busyprocess = 0;
//当前多少条在忙
var ajaxpause = false;
//是否暂停
var ajaxpos = 0;
//当前扫描位置
var apiurl = "http://api.bugscaner.com/baiduurlsafe.py";
//api接口
var domainarr = {};
//存放数据的字典,这里为什么要用字典呢？是因为在多线程下,输出是无须的,为了能更好的输出排序,这里使用字典
var domaincount = 0;
var maxdomname = 1;
//单后缀模式下，每process发多少个域名
var jsondata = JSON.parse("{}");
var listbox_body = $("div.insert > .form-control");
var pubmaxtryit = 50000;
//全局重试
var titnumArr = [0, 0];

//存放展示的table表格数据
var htmlQ = new Array();
//前端序列号
var totalLink = 0;

var listbox_titnum = $("div.listbox > .title .titnum");
var jsondata = [];
//以域名为键  初始化所有域名的状态
jsondata["yuming"] = -1;
var returninfo = [];
var jindutiao = $('#jindutiao');
//用户控制选项全局变量设置
var duibi = false;
var more = false;
var losterror = false;
//查询次数限制
var limit = false;
//只提醒一次
var justone = false;

//计算程序从开始任务到结束任务 耗时
var starttime = +new Date();
//三个控制按钮的控制
var maintijiao = $('#tijiao');
var mainexport = $('#export');
var mainover = $('#over');
var mainpause = $('#pause');

//获取授权key
var token = "null";
//提醒标志
var vipflag = false;

var startid = 1;

/* 进度条函数 */
function increment(value,type) {
  if (value == 100){
      $("#"+type).css("width",value + "%").text("嗨,已查询完毕");
  }else{
      $("#"+type).css("width",value + "%").text(value + "%");
  }
  if (value>=0 && value<=30) {
      $("#"+type).addClass("progress-bar-danger");
  }
  else if (value>=30 && value <=60) {
      $("#"+type).removeClass("progress-bar-danger");
      $("#"+type).addClass("progress-bar-warning");
  }
  else if (value>=60 && value <=90) {
      $("#"+type).removeClass("progress-bar-warning");
      $("#"+type).addClass("progress-bar-info");
  }
  else if(value >= 90 && value<=100) {
      $("#"+type).removeClass("progress-bar-info");
      $("#"+type).addClass("progress-bar-success");    
  }
  else{
      return;
  }
}

function getdictlen(dict) {
    var arrLength = 0;
    for (var key in dict) {
        arrLength++;
    }
    return arrLength;
    //这里做了一下修改
}

function dopause(){
	mainpause.attr("disabled","true");
	maintijiao.removeAttr("disabled");
	if (busyprocess <= 0 && ajaxpause){
		console.log("嘿,哥们,程序已经结束了,无需再暂停了");
	}else{
		console.log("成功的暂停了程序的运行,如果需要继续,请点击开始");
	}
	if (ajaxpause) return false;
	//设置按钮禁用
	ajaxpause = true;
	return false;
}


function start(act) {
    if (act == "pause") {
        if (ajaxpause)
            return false;
        ajaxpause = true;
        return false;
    }
    for (var j = 0; j < maxprocess; j++) {
        runpool();
    }
}
//判断是否为空函数
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}
//去除前后空格
function Trims(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}

function init(){
	//程序二次运行进行初始化
	//清空表格
	$("#insert").empty();
	startid = 1;
	busyprocess = 0;
	//当前多少条在忙
	//清空进度条
	increment(0,"run");
	ajaxpause = false;
	//是否暂停
	ajaxpos = 0;
	//当前扫描位置
	domainarr = {};
	//存放数据的字典,这里为什么要用字典呢？是因为在多线程下,输出是无须的,为了能更好的输出排序,这里使用字典
	domaincount = 0;
	maxdomname = 1;
	jsondata = JSON.parse("{}");
	returninfo = [];
	starttime = +new Date();
}

//判断是否是数字 一会还要用到这个检测用户输入,如果是纯数字,就不需要翻译了
function isnumeric(v) {
    return /^\d+$/.test(v);
}

//设置cookie
function setUCookie(u_name, value) {
    var exdate = new Date();
    exdate.setTime(exdate.getTime() + 365 * 24 * 60 * 60 * 1000);
    document.cookie = u_name + "=" + escape(value) + "; expires=" + exdate.toGMTString();
}
function getUCookie(u_name) {
    if (document.cookie.length > 0) {
        u_start = document.cookie.indexOf(u_name + "=")
        if (u_start != -1) {
            u_start = u_start + u_name.length + 1
            u_end = document.cookie.indexOf(";", u_start)
            if (u_end == -1) u_end = document.cookie.length
            return unescape(document.cookie.substring(u_start, u_end))
        }
    }
    return ""
}

function validateNum(value){
if(/^[A-Za-z0-9]{32}$/.test(value)){
	return true;
}else{
	return false;
}
}

//判断是否为空函数
function isEmpty(obj){
    if(typeof obj == "undefined" || obj == null || obj == ""){
        return true;
    }else{
        return false;
    }
}

function url2domain(t) {
	return t.toLowerCase().replace("http://", "").replace("https://", "").split("/")[0].split("?")[0].replace(/\s/g, "")
}
function isDomain(t) {
	var e = t.split(".");
	return !e[e.length - 1].match(/[0-9]/) && !!t.match(/^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)+$/)
}

function mainstart() {
	if (busyprocess <= 0 && ajaxpause){
		console.log(busyprocess);
		//说明程序已经结束
		init();
	}
	else if (busyprocess > 0 && ajaxpause){
		//说明是暂停 只需要设置一下启动参数
		console.log("从暂停开始启动");
		ajaxpause = false;
		return false;
	}
	else if(busyprocess > 0 && !ajaxpause){
		toastr.warning("程序正在运行中,不能再开,如果遇到了问题,可以刷新页面,也可以点击暂停按钮,再开始");
		return false;
	}
    //首先获取输入框内容按回车进行分割
    var inputcontent = document.getElementById('shuru').value;
    inputcontent = Trims(inputcontent);
    if (isEmpty(inputcontent)) {
        toastr.warning("哥,请输入需要查询的网址吧！");
        return;
    }
	//程序未开始前 隐藏按钮
	maintijiao.attr("disabled","true");
	mainexport.attr("disabled","true");
	mainpause.removeAttr("disabled");
	
    var arr = inputcontent.split('\n');
	var error_url_nbs = 0;
	var domain = "";
    for (j = 0; j < arr.length; j++) {
        console.log(arr[j]);
		//这里对用户输入的网址进行分割,搞成标准的网址
        //按数字键 写进字典
		domain = url2domain(arr[j]);
		if(isDomain(domain)){
			if((j-error_url_nbs)<50){
				//只截取前300条输入作为查询,因为每天最多查询300次
				domainarr[j] = domain;
			}
		}else{
			error_url_nbs++
		}
    }
    domaincount = getdictlen(domainarr);
	if (domaincount>50){
		toastr.warning("亲爱的用户,您最多只能查询50条网址,您输入的已经超过了50条,程序只查询前50条,后面的自动忽略")
	}else{
		toastr.info("您共提交了"+(domaincount+error_url_nbs)+"条网址,过滤掉了无效的网址"+error_url_nbs+"条")
	}
	jindutiao.show();
	$("#insert").show();
    start();
}

function appendlistbox(oldinfo,result) {
    //得到状态再写入相应div中去
    var pos = 0;
    var msg = "";
	var code = result.status
    //这里的st是从json返回的成功标志
	if(code == 3){
		totalLink ++
		var d = '<tr class="info"><td>'+startid+'</td><td class="domain">'+oldinfo+'</td><td class="status">危险提示</td></tr>';
		returninfo.push(startid+"\t"+oldinfo+"\t"+"危险提示");
		$("#insert").append(d);
	}
	else if(code == 4 ){
		totalLink ++
		var d = '<tr class="warning"><td>'+startid+'</td><td class="domain">'+oldinfo+'</td><td class="status">正常</td></tr>';
		returninfo.push(startid+"\t"+oldinfo+"\t"+"正常");
		$("#insert").append(d);
	}
	else if(code == 555){
		if (!justone){
		toastr.error("非常抱歉,您今天的300次查询已使用完毕,您可以点击导出按钮,把结果导出到电脑里,感谢使用请明天再来！");
		justone = true;
		}
		//停止线程 结束程序
		limit = true;
		ajaxpause = true;
		ajaxpos = 100000;
		busyprocess = 0;
		return false;
	}
	startid ++;
}
function urlencode(sStr) {
    return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g, '%22').replace(/\'/g, '%27').replace(/\//g, '%2F');
}

function runpool() {
    //ajaxpos  当前拼音扫描位置
    //maxdomname 单后缀模式下，每process发多少个域名
    //ajaxpause  是否暂停
    if (busyprocess >= maxprocess)
        return false;
    if (ajaxpause)
        return false;
    if (ajaxpos >= domaincount)
        return false;

    /* 		var end = ajaxpos + maxdomname;
		if (end > domaincount)
			end = domaincount; */

    var domain = domainarr[ajaxpos];
	//进度条控制器
	increment(parseInt(((ajaxpos) / domaincount * 100)),"run");
    if (busyprocess < 0)
        busyprocess = 0;
    busyprocess++;
    ajaxpos = ajaxpos + maxdomname;
    tryconnect(domain, maxtryit);
}
function tryconnect(arrdomain, intTry) {
    $.ajax({
        url: apiurl,
        type: "POST",
        //dataType: 'json',
		//headers:{"Token":token},
        data: {
            url: arrdomain,
        },
        timeout: 20000,
        complete: function(XHR) {
            var isok = false;
            var responsetxt = XHR.responseText;
            if (XHR.status == 200) {
				//用户提醒
				responsetxt = unescape(responsetxt);
				var obj = JSON.parse(responsetxt);
				endconnect(arrdomain, obj);
				return;
            }
            intTry--;
            if (intTry >= 0) {
                tryconnect(arrdomain, intTry);
                //正在重试
            } else {
                endconnect(arrdomain, {
                    "code": "10000",
                    "text": "网络错误，查询失败，请重试！"
                });
            }
        }
    });
}

function runpoolover() {
    if (ajaxpos < domaincount) {
        //clearTimeout(delaytimer);
        //setTimeout("runpool()",maxdelay);
        runpool();
    } else if (busyprocess <= 0) {
        ajaxpause = true;
		//结束进度条
		increment(100,"run");
		//解除对按钮的禁止
		if (!limit){
		maintijiao.removeAttr("disabled");
		mainexport.removeAttr("disabled");
		mainpause.attr("disabled","true");
		toastr.success("恭喜您百度安全域名批量检测查询完毕 - 共耗时："+(+new Date()-starttime)+"ms,你现在可以点击导出按钮,导出到文本了！");
		}
		else{
			mainpause.attr("disabled","true");
			mainexport.removeAttr("disabled");
		}
    }
}

function endconnect(oldinfo, result) {
    busyprocess--;
	appendlistbox(oldinfo,result);
    runpoolover();
}

//文本导出函数
function txtexport(){
	if (returninfo.length == 0 ) {
		toastr.warning("什么都没有, 无需导出");
		return false
	}
	var isIE = (navigator.userAgent.indexOf('MSIE') >= 0);
	if (isIE) {
		var strHTML = returninfo.join("\r\n");
		var winSave = window.open();
		winSave.document.open("text", "utf-8");
		winSave.document.write(strHTML);
		winSave.document.execCommand("SaveAs", true, "百度安全域名批量检测查询.txt");
		winSave.close();
	} else {
		var elHtml = returninfo.join("\r\n");
		var mimeType = 'text/plain';
		$('#createInvote').attr('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
		document.getElementById('createInvote').click();
	}
}