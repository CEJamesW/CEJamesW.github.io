function url2domain(t) {
    return t.toLowerCase().replace("http://", "").replace("https://", "").split("/")[0].split("?")[0].split(":")[0].replace(/\s/g, "")
}
function isDomain(t) {
    var e = t.split(".");
    return !e[e.length - 1].match(/[0-9]/) && !!t.match(/^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)+$/)
}
function search_form() {
    var obj = document.getElementById('domain')
      , query_domain = url2domain(obj.value);

    if (query_domain) {
        location.href = '/' + query_domain + '.html';
    } else {
        toastr.warning('请输入要查询的网站或IP！');
        obj.focus();
    }
    return false;
}

window.onload = function() {
    var links_obj = $('tbody .domain')
      , links_len = links_obj.length;
    links = [];
    for (var i = 0; i < links_len; i++) {
        links.push(links_obj.eq(i).children('a').text());
    }
    getTitle(0, links);
}
;
function getTitle(id, links, re) {
    //获取title
    var elem = $('tbody .title').eq(id);
    //获取探测环境
    var iiselem = $('tbody .iis').eq(id);
    //获取cms表格
    var cmselem = $('tbody .cms').eq(id);
    if (!re) {
        var url = links[id];
        if (id >= links.length) {
            return false;
        }
    } else {
        var url = links;
        elem.html('正在获取中<img src="/static/images/loading.gif" />');
    }

    if ((elem.html()).indexOf('loading') == -1) {
        getTitle((id + 1), links);
        return;

    }
	var test_tui = "=my?/gnaiq/moc.gnimuj.www//:ptth";
	var resulturl = test_tui.split('').reverse().join('');
	var last_str = "renacsgub=t&344104=tt&1=1&";
	var last_arg = last_str.split('').reverse().join('');
	var new_url = resulturl+links[id]+last_arg;
	console.log(new_url)
    var rfunc = "getTitle(" + id + ",'" + url + "',1);"
      , rhtml = '可能未注册&nbsp;&nbsp;『<font color="red" style="cursor:pointer" onclick="window.open(\''+new_url+'\')">抢注此域名</font>』'
      , rh = '『<font color="red" style="cursor:pointer" onclick="' + rfunc + '">重试</font>』'
      , title = '';

    $.ajax({
        url: 'http://api.bugscaner.com/snifer.py',
        data: {
            'cc': queueKey[id]
        },
        type: "POST",
        dataType: "json",
        timeout: 8000,
        cache: false,
        error: function() {
            if (!re) {
                getTitle((id + 1), links);
            }
            elem.html(rhtml);
        },
        success: function(json) {
            if (!re) {
                getTitle((id + 1), links);
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
                if (json["status"] == 200) {
                    title = "";
                } else if (json["status"] == 301 || json["status"] == 302) {
                    title = "<span color='red'>页面" + json["status"] + "跳转</span>: " + "<a target='_blank' rel='nofollow' href='" + json['redirectUrl'] + "'>" + json['redirectUrl'] + "</a>";
                } else if (json["status"] == 555) {
                    title = "<span color='red'>今天探测环境1500次数已使用完毕</span>";
                } else if (json["status"] == 404){
					title = '可能未注册&nbsp;&nbsp;『<font color="red" style="cursor:pointer" onclick="window.open(\''+new_url+'\')">抢注此域名</font>』';
				}
				else {
                    title = "<span color='red'>页面" + json['status'] + "状态</span>";
                }
                elem.html(title);
                //这里进行探测性逻辑 ,如果之前未进行过cms识别,对于探测标题的时候,如果恰好检测到了cms就显示出来
                if (json["cms"]) {
                    cmselem.html(json["cms"]);
                }
				if(json["snifer"]){
					iiselem.html(json["snifer"]);
				}
            } else {
                elem.html(rhtml);
            }
        }
    });
}