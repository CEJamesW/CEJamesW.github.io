var running = false;
var startBtn = '';
var endBtn = '';
var notice = '';
var urlInput = '';
var tableheader = "<table class=\"table table-bordered table-hover\"><thead><tr><th>序列</th><th>推广网址</th><th>推广状态</th></tr></thead><tbody>";
var time = 30;
var timer = '';
var counter = '';
var processTimer = '';
var countNum = time;
var totalLink = 0;
var countNumShow = '';
var totalLinkShow = '';
var currentPage = 1;
var pageSize = 30;
// var htmlQ = new Array();
$().ready(function() {
	startBtn = $('#startBtn');
	endBtn = $('#endBtn');
    jindutiao = $('#jindutiao');
	notice = $('#notice');
	urlInput = $('#url');
	countNumShow = $('#countNum');
	totalLinkShow = $('#totalLink');
	startBtn.click(function() {
		start()
	});
	endBtn.click(function() {
        info = "<div class=\"well well-sm text-center\">您已手动结束超级外链发布,欢迎下次使用!</div>";
        $('#overinfo').html(info);
		end();
	})
});

function promote() {
	clearInterval(counter);
	if (running) {
		request()
	}
}

function request() {

    $.ajax({
        url : "/api/chaojiwailian/?n=" + pageSize + "&p=" + currentPage + "&callback=?",
        type : 'get',
        dataType : "json"
    });
}

function jsonCallback(c) {
	var d = '';
    var htmls = '';
	var htmlQ = new Array();
	clearInterval(processTimer);
	if (c.l.length === 0) {
        /* 隐藏进度条 */
        jindutiao.hide();
        info = "<div class=\"well well-sm text-center\">自动外链推广结束，本站总共为您推广外链" + c.t + "条,想要达到效果,同志仍需经常性的打开本页面,反复操作!</div>";
        $('#overinfo').html(info);
		end()
		return;
	}
    else{
        $("#infos").html("<table id=\"trs\" class=\"table table-bordered table-hover\"><thead><tr><th>序列</th><th>超级外链发布成功</th><th>发布状态</th></tr></thead><tbody></tbody></table>");
    }
	$.each(c.l, function(a, b) {
		d = '<tr><td class="active">' + (totalLink + 1 + a) + '</td><td align="left" class="warning"><a target="_blank" href="' + b.replace(new RegExp("{domain2promote}", "g"), url) + '">' + shortStr(b.replace(new RegExp("{domain2promote}", "g"), url)) + '</a><script language="javascript" type="text/javascript" src="' + b.replace(new RegExp("{domain2promote}", "g"), url) + '"></script></td><td class="danger"><span class="glyphicon glyphicon-ok" aria-hidden="true"> 外链发布成功</span></td></tr>';
		htmlQ.push(d)
	});

    /*timer = setTimeout('promote()', time * 1000)
	 counter = setInterval('countDown()', 1000); */
	currentPage++;

	processTimer = setInterval(function() {
		var a = htmlQ.shift();
		if (a == null) {
			clearInterval(processTimer);
			htmlQ = new Array()
		} else {
            $("#trs").append(a);
			/* $("table tbody tr.empty:first").replaceWith(a) */
		}
		if (htmlQ.length == 0) {
            htmls = '';
			clearInterval(processTimer);
			totalLink = (currentPage - 1) * pageSize;
            promote();
		}
		else {
			totalLink += 1;
		}
        setrunpr(htmlQ.length);
		setTotalLink(totalLink + ' / ' + c.t);
        allsetrunpr(currentPage,c.t);

	}, 300 > (time - 1) / pageSize * 1000 ? (time - 1) / pageSize * 1000 - 1 : 300);
	
}

function checkDomain(a) {
	if (a.indexOf('http://') === 0) {
		a = a.substr('http://'.length)
	} else if (a.indexOf('https://') === 0) {
		a = a.substr('https://'.length)
	}
	if (a.indexOf('/') !== -1) {
		a = a.substring(0, a.indexOf('/'))
	}
	var b = /^(([a-zA-Z0-9]|[-_]){1,}\.){1,}[a-zA-Z]{2,4}$/;
	if (!b.exec(a)) {
		return false
	}
	return a
}

function start() {
	startBtn.hide();
    jindutiao.show();
	endBtn.show();
    /* 初始化数据 */
    info = "<div class=\"well well-sm text-center\">外链正在发布中,您可以最小化本页面,或者切换到其他页面干别的事情,完全不影响勤劳的我继续干活!</div>";
    $('#overinfo').html(info);
	window.onbeforeunload = close;
	url = checkDomain(urlInput.val());
	if (!url) {
		end();
		alert('输入的网址不符合要求！');
		urlInput.focus();
		urlInput.select();
		return
	}
	running = true;
	promote();
	
}

function end() {
	endBtn.hide();
    jindutiao.hide();
	startBtn.show();
	running = false;
	clearInterval(timer);
	clearInterval(counter);
	clearInterval(processTimer);
	setTotalLink(0);
    setrunpr(0);
	currentPage = 1;
	pageSize = 30;
	countNum = 0;
	totalLink = 0
	window.onbeforeunload = null;
}

/* 进度条函数 */
function increment(value,type) {
  if (value == 100){
      $("#"+type).css("width",value + "%").text("请等待程序最后的请求,发布外链成功后，程序会自动跳转!");
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
  else if(value >= 90 && value<100) {
      $("#"+type).removeClass("progress-bar-info");
      $("#"+type).addClass("progress-bar-success");    
  }
  else{
      return;
  }
}

function setrunpr(v) {
    var jinduint = parseInt(((29-v)*3.3));
    if (jinduint == 95){
        increment(100,"run");
    }
    else{
        increment(jinduint,"run");
    }
}

function allsetrunpr(v,totalnb) {
    /* 计算页面总数 */
    var ownpages = parseInt(totalnb/30)+1
    var jinduint = parseInt(v*(100/ownpages));
    increment(jinduint,"allrun");
}

function setTotalLink(v) {
	totalLinkShow.html(v)
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