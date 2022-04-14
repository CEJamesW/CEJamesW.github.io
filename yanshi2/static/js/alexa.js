var running = false;
var nbs = 0;
var startBtn = '';
var endBtn = '';
var urlInput = '';
var time = 30;
var oldtime = time;
var url = 'http://tools.bugscaner.com/';

$().ready(function() {
	startBtn = $('#startBtn');
	endBtn = $('#endBtn');
    aleaxinfo = $('#aleaxinfo');
    overinfo = $('#overinfo');
	urlInput = $('#url');
    timeInput = $("#inputtime");
	startBtn.click(function() {
        start()
	});
	endBtn.click(function() {
        info = "<div class=\"well well-sm text-center\">您已手动结束,欢迎下次使用!</div>";
        $('#overinfo').html(info);
		end();
	})
});

function countDown() {
    info = "<div class=\"well well-sm text-center\">pv排名正在刷新中,已刷次数:"+nbs+"次,"+time+"秒后刷新,在此过程中您可以去做其他事情,最小化本页面即可，本工具可以快速帮您提升pv和Alexa排名!</div>";
    overinfo.html(info);
    if(time==0){
        time = oldtime;
    }
    else if (time == oldtime){
        promote();
        nbs++;
        time--;
    }
    else{
        time--;
    }
}
function promote() {
	if (running) {
        $("#aleaxinfo").html("<iframe id=\"aleaxurl\" height=\"300\" width=\"100%\" frameborder=\"0\"></iframe>");  
        $("#aleaxurl").attr("src", url);
	}
}

function checkDomain(a) {
	if (a.indexOf('http://') !== 0 && a.indexOf('https://') !== 0) {
		return "";
	}
    else{
        return a
    }
}

function start() {
	window.onbeforeunload = close;
	var temp_url = urlInput.val().toLowerCase();
	if(temp_url.indexOf("1024sj.com") > -1){
		alert("该域名已被永久禁止使用本功能.");
		return;
	}
	url = checkDomain(urlInput.val());
	if (url.length === 0) {
        alert('输入的网址不符合要求,请以http://或者https://开头！');
		urlInput.focus();
		urlInput.select();
		return
	}
    oldtime = time = parseInt(timeInput.val())
    if (isNaN(parseInt(time))){
		alert('输入的刷新时间参数错误,应该为整数,已自动帮您填写！');
        timeInput.val("30");
		timeInput.focus();
		timeInput.select();
		return
    }
	if (time < 5) {
		alert('自动刷新时间最小为5秒！');
        timeInput.val("5");
		timeInput.focus();
		timeInput.select();
		return
	}
	startBtn.hide();
    aleaxinfo.show();
	endBtn.show();
    overinfo.show();
    /* 初始化数据 */
    info = "<div class=\"well well-sm text-center\">程序初始化中.....</div>";
    overinfo.html(info);
    aleaxinfo.html("");
	running = true;
    counter = setInterval('countDown()', 1000);
	
}

function end() {
	endBtn.hide();
    aleaxinfo.hide();
	startBtn.show();
	running = false;
	clearInterval(counter);
	window.onbeforeunload = null;
}
function shortStr(a) {
	if (a.length > 70) {
		return a.substr(0, 70) + "..."
	}
	return a
}
function killErrors() {
	return true
}
window.onerror = killErrors;
function close(){
	event.returnValue = "确定退出推广吗？";
}