/* 
author: bugscaner
email: bugscaner@qq.com
采用单线程机制
目前为了保证用户的正常使用,防止爬虫,只能采用验证码机制了,提交验证码,为每个url生成标志flag,携带flag进行提交 
*/
function url2domain(t) {
    return t.toLowerCase().replace("http://", "").replace("https://", "").split("/")[0].split("?")[0].split(":")[0].replace(/\s/g, "")
}

function isDomain(t) {
    var e = t.split(".");
    return !e[e.length - 1].match(/[0-9]/) && !!t.match(/^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)+$/)
}

//判断是否为空字符串
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}

function getQueryString(name) { 
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
        var r = window.location.search.substr(1).match(reg); 
        if (r != null) return unescape(r[2]); 
        return null; 
    } 



//在whois和备案查询中只需要提取顶级域名即可,无需三级四级等等,通过对连接的优化,可以更好的seo
//此脚本要和后端的lua脚本验证一致
function extract_domain(url) {
    var suffix = ['.com', '.la', '.io', '.vc', '.co', '.cn', '.info', '.net', '.org', '.me', '.mobi', '.us', '.biz', '.xxx', '.ca', '.co.jp', 'work', '.com.cn', '.net.cn', '.org.cn', '.mx', '.tv', '.ws', '.ag', '.com.ag', '.net.ag', '.org.ag', '.am', '.asia', '.at', '.be', '.com.br', '.net.br', '.name', '.live', '.news', '.bz', '.tech', '.pub', '.wang', '.space', '.top', '.xin', '.social', '.date', '.site', '.red', '.studio', '.link', '.online', '.help', '.kr', '.club', '.com.bz', '.net.bz', '.cc', '.band', '.market', '.com.co', '.net.co', '.nom.co', '.lawyer', '.de', '.es', 'xyz', '.com.es', '.nom.es', '.org.es', '.eu', '.wiki', '.design', '.software', '.fm', '.fr', '.gs', '.in', '.co.in', '.firm.in', '.gen.in', '.ind.in', '.net.in', '.org.in', '.it', '.jobs', '.jp', '.ms', '.com.mx', '.nl', '.nu', '.co.nz', '.net.nz', '.org.nz', '.se', '.tc', '.tk', '.tw', '.com.tw', '.idv.tw', '.org.tw', '.hk', '.co.uk', '.me.uk', '.org.uk', '.vg'];
    url = url.toLowerCase();
    url = url2domain(url);
    if (!isDomain(url)) {
        return false;
    }
    var lengthurl = spliturl.length;
    if (lengthurl >= 3) {
        if (suffix.indexOf('.' + spliturl.slice(-2).join('.')) != -1) {
            //说明符合规则
            return spliturl.slice(-3).join('.');
        } else if (suffix.indexOf('.' + spliturl.slice(-1)) != -1) {
            return spliturl.slice(-2).join('.');
        } else {
            return false;
        }
    } else if (lengthurl == 2) {
        if (suffix.indexOf('.' + spliturl.slice(-1)) != -1) {
            return url;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function htmloutput(json) {
    if (json["status"] == 98) {
        $("#cms").html("<h3><span class='label label-success'>没有输入网址，我该怎么检测呢?亲</span></h3>");
    } else if (json["status"] == 97) {
        $("#cms").html("<h3><span class='label label-info'>你确定你输入的域名是正确的？</span></h3>");
    } else if (json["status"] == 100) {
        $("#cms").html("<h3><span class='label label-warning'>访问超时,可能是网站服务器太差劲了,重新试试看!</span></h3>");
    } else if (json["status"] == 101) {
        $("#cms").html("<h3><span class='label label-danger'>链接读取超时,重试一下!</span></h3>");
    } else if (json["status"] == 102) {
        $("#cms").html("<h3><span class='label label-primary'>请求异常,请重新试试！</span></h3>");
    } else if (json["status"] == 103) {
        $("#cms").html("<h3><span class='label label-warning'>代理服务器错误,稍后再试</span></h3>");
    } else if (json["status"] == 104) {
        $("#cms").html("<h3><span class='label label-warning'>出现了未知错误！</span></h3>");
    } else if (json["status"] == 555) {
        $("#cms").html("<h3><span class='label label-warning'>您今天的查询次数已使用完毕,请明天再试！</span></h3>");
    } else if (json["status"] == 666) {
        $("#cms").html("<h3><span class='label label-warning'>访问频率太快了,进行人机验证！(这里植入验证码)</span></h3>");
    } else if (json["status"] == 667) {
        $("#cms").html("<h3><span class='label label-warning'>您的ip已被永久关进小黑屋,不能再使用本工具</span></h3>");
    } else if (json["status"] == 99) {
        var arr = ["alert-info", "alert-warning", "alert-danger", "alert-success"];
        var index = Math.floor((Math.random() * arr.length));
        var output = "<div class=\"alert alert-success\" role=\"alert\">CMS：<strong>" + json["CMS"] + "</strong></div>";
		output += "<div class=\"alert alert-success\" role=\"alert\">请求状态码：<strong>" + json["status_code"] + "</strong></div>";
		if(json["ip"] == "未知"){
			output += "<div class=\"alert alert-success\" role=\"alert\">同ip网站cms查询:<a href=\"http://dns.bugscaner.com/" + json["url"] + ".html\" title=\"同ip网站查询\" target=\"_blank\">" + json["url"] + "</a></div>";
		}else{
			output += "<div class=\"alert alert-success\" role=\"alert\">同ip网站cms查询:<a href=\"http://dns.bugscaner.com/" + json["ip"] + ".html\" title=\"同ip网站查询\" target=\"_blank\">" + json["ip"] + "</a></div>";
		}
        output += "<div class=\"alert alert-success\" role=\"alert\">icp备案查询:<a href=\"http://icp.bugscaner.com/host_" + json["url"] + ".html\" title=\"icp备案查询\" target=\"_blank\">" + json["url"] + "</a></div>";
		output += "<div class=\"alert alert-success\" role=\"alert\">whois查询:<a href=\"http://whois.bugscaner.com/" + json["url"] + "\" title=\"whois查询\" target=\"_blank\">" + json["url"] + "</a></div>";
        for (var p in json) {
            if (["CMS", "status_code", "status", "ip", "url"].indexOf(p) == -1) {
                output += "<div class=\"alert " + arr[index] + "\" role=\"alert\">" + p + ":" + "<strong>" + json[p] + "</strong></div>"
            }
        }
		output += "<div class=\"alert alert-success\" role=\"alert\">子域名查询:<a href=\"http://tools.bugscaner.com/subdomain/?domain=" + json["url"] + "\" title=\"子域名查询\" target=\"_blank\">" + json["url"] + "</a></div>";
		output += "<div class=\"alert alert-success\" role=\"alert\">网站cdn服务商查询:<a href=\"http://tools.bugscaner.com/whichcdn/?domain=" + json["url"] + "\" title=\"网站cdn服务商查询\" target=\"_blank\">" + json["url"] + "</a></div>";
		output += "<div class=\"alert alert-success\" role=\"alert\">cdn缓存命中诊断:<a href=\"http://tools.bugscaner.com/cdn_check.html?domain=" + json["url"] + "\" title=\"cdn缓存命中诊断\" target=\"_blank\">" + json["url"] + "</a></div>";
        $("#cms").html(output);
    } else if (json["status"] == 10010) {
        $("#cms").html("<h3><span class='label label-info'>验证码不正确,请重试</span></h3>");
    } else if (json["status"] == 10011) {
        $("#cms").html("<h3><span class='label label-info'>请输入验证码再查询！</span></h3>");
    } else if (json["status"] == 10014) {
        $("#cms").html("<h3><span class='label label-info'>验证码已失效,请刷新</span></h3>");
    } else if (json["status"] == 10012) {
        $("#cms").html("<h3><span class='label label-info'>点击的验证码次数不足,请重试</span></h3>");
    } else if (json["status"] == 10013) {
        $("#cms").html("<h3><span class='label label-info'>在机器学习？</span></h3>");
    } else if (json["status"] == 10015) {
        $("#cms").html("<h3><span class='label label-info'>验证码异常,请重试</span></h3>");
    }
}

function tryajax(url) {
    var verify = $('#captcha').val();
    if (!verify) {
        verify = "no";
    }
    $.ajax({
        url: "/what.go",
        data: {
            url: url,
            location_capcha: verify
        },
        type: "POST",
        dataType: "json",
        error: function() {
            toastr.info("网站出现了bug,已自动通知站长,请稍后再试！");
        },
        success: function(json) {
			//一定查询次数后,弹出验证码
            if (json["status"] == 10086) {
                $('#captcha').clicaptcha({
                    src: '/clicaptcha.py',
                    callback: function() {
                        //这里进行一个回调
                        tryajax(url);
                    }
                })
            }else if(json["status"] == 556){
				$("#cms").html("<h3><span class='label label-info'>您今天验证码输错次数太多,有机器学习的可能,请明天再来</span></h3>");
			} 
			else {
                htmloutput(json);
            }
        }
    });
}

$("#start").bind("click", function() {
    //批量查询逻辑开始
    //获取用户输入
    var url = $("#inputurls").val();
    //获取用户输入的网址
    if (isEmpty(url)) {
        toastr.error("您还什么都没有输入呢！", "大表哥,别闹啦");
        return false;
    }
    url = url2domain(url);
    if (!isDomain(url)) {
        toastr.error("输入的好像不是网址哦!", "大表哥,别闹啦");
        return false;
    }
    var verify = $('#captcha').val();
    //这里是一个回调函数
    //以后所有的对内部计算资源消耗比较大的工具,都采用人机验证策略,首先用js验证输入的参数完整,然后进行回调函数的触发
    //批量api查询
    $("#cms").html("<img src='/static/image/1.gif' align='absmiddle' />");
    tryajax(url);
})

$(function() {
    $("#piliangsumbit").click(function() {
        //一些初始化
        var newurls = [];
        var inputurls = $("#urls").val().trim();
        if (isEmpty(inputurls)) {
            toastr.warning("你得输入需要识别的网址", "大表哥,别闹啦");
            return false;
        }
        var arr = inputurls.split('\n');
        for (j = 0; j < arr.length; j++) {
            //为了减少不必要的请求,对用户输入的网址进行过滤
            domain = url2domain(arr[j]);
            if (isDomain(domain)) {
				//去重
                if (newurls.indexOf(domain) == -1) {
                    newurls.push(domain);
                }
            }
        }
        //开始进行计算干掉了多少老弱残兵,抱着负责的态度,给用户以提醒
        var lasternb = newurls.length;
        var allnbs = arr.length;
        var killnb = allnbs - lasternb;
        if (lasternb == 0) {
            toastr.warning("网址没有一个符合规则的,请检查", "OH,gaga");
            return false;
        }
        if (lasternb > 100) {
            //每次最多提交50个网址
            toastr.warning("老兄,每次最多提交100个网址,您提交了" + lasternb + "个网址,多出的自动忽略")
            lasternb = 100;
        }
        $("#urls").val(newurls.join("\n"));
        //进行提交获取hash
        //点选验证码回调
        $('#captcha').clicaptcha({
            src: '/clicaptcha.py',
            callback: function() {
                //验证码正确的话,进行表格初始化
                $("#allhide").show();
                $('#insert_tables tbody').empty();
                var verify = $('#captcha').val();
                $.ajax({
                    url: "/gethash.lua",
                    data: {
                        urls: newurls.join("\n"),
                        location_capcha: verify
                    },
                    type: "POST",
                    dataType: "json",
                    error: function() {
                        toastr.error("服务器出现了错误,请重试");
                    },
                    success: function(json) {
                        //生成表单
                        for (j = 0; j < lasternb; j++) {
                            $("#insert_tables").append('<tr><td class="hidden-xs">' + (j + 1) + '</td><td class="domain title-so-long-hidden"><a href="http://' + newurls[j] + '" target="_blank" rel="nofollow" title="' + newurls[j] + '">' + newurls[j] + '</a></td><td class="status hidden-xs"><span>-</span></td><td class="title title-so-long-hidden">-</td><td class="cms"><span>队列等待中 <img src="/static/image/loading.gif"></span></td><td class="iis title-so-long-hidden hidden-xs">-</td><td class="myhash" style="display:none">' + json[j]["hash"]+'$'+ json[j]["localtime"] + '</td></tr>')
                        }
                        //表格生成完毕,开始进行轮换识别
                        var links_obj = $('tbody .domain');
                        var links_len = links_obj.length;
                        var links = [];
                        for (var i = 0; i < links_len; i++) {
                            links.push(links_obj.eq(i).children('a').text());
                        }
                        snifer_cms(0, links);
                    }
                });

            }
        });
    });
});

function snifer_cms(id, links, re) {
    //获取title
    var elem = $('tbody .cms').eq(id);
    //状态码
    var table_status = $('tbody .status').eq(id);
    //获取探测环境
    var iiselem = $('tbody .iis').eq(id);
    //获取cms表格
    var cmselem = $('tbody .title').eq(id);
    if (!re) {
        var url = links[id];
        if (id >= links.length) {
            console.log(links.length);
            return false;
        }
    } else {
        var url = links;
        elem.html('正在获取中<img src="/static/image/loading.gif" />');
    }
    //如果没有发现loading.gif图标,往下进行递增
    if ((elem.html()).indexOf('loading') == -1) {
        snifer_cms((id + 1), links);
        return;

    }
    var rfunc = "snifer_cms(" + id + ",'" + url + "',1);"
      , rhtml = '页面获取失败&nbsp;&nbsp;『<font color="red" style="cursor:pointer" onclick="' + rfunc + '">重试</font>』'
      , rh = '『<font color="red" style="cursor:pointer" onclick="' + rfunc + '">重试</font>』'
      , title = '';
	  
    //获取hash,妈的  走到这里真是混乱的逻辑
    var posthashandtime = $('tbody .myhash').eq(id).html();
	var dodos = posthashandtime.split("$");
	if (dodos.length == 2){
		urlhash = dodos[0];
		localtime = dodos[1];
	}else
	{
		//我自己给自己限制？有点多余这一步
		return false;
	}
    $.ajax({
        url: '/batch_api.go',
        data: {
            'url': url,
            "token": urlhash,
			"localtime":localtime
        },
        type: "POST",
        dataType: "json",
        timeout: 8000,
        cache: false,
        error: function() {
            if (!re) {
                snifer_cms((id + 1), links);
            }
            elem.html(rhtml);
        },
        success: function(json) {
            if (!re) {
                snifer_cms((id + 1), links);
            }
            if (Object.prototype.toString.call(json) !== '[object Object]' || json == "") {
                elem.html(rhtml);
                return;
            }
            if (!!json['error']) {
                elem.html('<span color="red">' + json['error']['message'] + '</span>' + rh);
                return;
            }
            if (!!json["status"]) {
                if (json["status"] == 99) {
                    //走到这里,无论怎么讲我都觉得虚伪
                    title = !!json['title'] ? json['title'] : "无标题";
                } else if (json["status"] == 555) {
                    title = "<span color='red'>今天探测环境1000次数已使用完毕</span>";
                } else if (json["status"] == 100) {
                    title = "<span color='red'>连接超时</span>";
                } else if (json["status"] == 101) {
                    title = "<span color='red'>连接超时</span>";
                } else if (json["status"] == 102) {
                    title = "<span color='red'>访问失败</span>";
                } else if (json["status"] == 103) {
                    title = "<span color='red'>代理连接失败</span>";
                } else if (json["status"] == 104) {
                    title = "<span color='red'>出现了未知错误</span>";
                } else {
                    title = "<span color='red'>页面" + json['status_code'] + "状态</span>";
                }
                cmselem.html(title);
                //这里进行探测性逻辑 ,如果之前未进行过cms识别,对于探测标题的时候,如果恰好检测到了cms就显示出来
                if (json["CMS"]) {
                    elem.html(json["CMS"]);
                } else {
                    elem.html("-");
                }
                if (json["infos"]) {
                    iiselem.html(json["infos"]);
                }
                if (json["status_code"]) {
                    table_status.html(json["status_code"]);
                } else {
                    table_status.html("未探测");
                }
            } else {
                elem.html(rhtml);
            }
        }
    })
}

//百度统计代码
var _hmt = _hmt || [];
(function() {
    var hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?6809c4d9953f5afcfe906ac76fa71351";
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(hm, s);
}
)();