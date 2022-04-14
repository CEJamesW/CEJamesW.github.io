$(function(){
	//初始化警告框位置
	toastr.options.positionClass = 'toast-center-center';
	$('#ym-input').focus();
	$('#ym-textarea').focus();

	$('#submit-btn').on('click', function(){
		search();
	});
	$('#ym-input').on('keyup', function(event){
		$(this).val(moveHttp($(this).val()));
		if(event.keyCode ==13){
			search();
		}
	});
	$('#yms-form').on('submit', function(){
		var yms = $('#ym-textarea').val();
		if(yms == ''){
			return;
		}
	});
});
//对于用户的搜索框选中的事件
$("#select").change(function(){
	var options = $(this).children('option:selected').val();
	switch(options)
	{
	case "beianhao":
	  $('#ym-input').attr('placeholder',"请输入需要查询的备案号");
	  break;
	case "host":
	  $('#ym-input').attr('placeholder',"请输入需要查询备案的域名");
	  break;
	case "websitename":
	  $('#ym-input').attr('placeholder',"请输入需要查询备案的网站名称");
	  break;
	case "danwei":
	  $('#ym-input').attr('placeholder',"请输入需要查询的主办单位或者个人名称");
	  break;
	default:
	  $('#ym-input').attr('placeholder',"请选择需要查询的种类");
	  break;
	}
})


function url2domain(t) {
	return t.toLowerCase().replace("http://", "").replace("https://", "").split("/")[0].split("?")[0].split(":")[0].replace(/\s/g, "")
}

function isDomain(t) {
	var e = t.split(".");
	return !e[e.length - 1].match(/[0-9]/) && !!t.match(/^[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)+$/)
}

//判断是否为空字符串
function isEmpty(obj){
	if(typeof obj == "undefined" || obj == null || obj == ""){
		return true;
	}else{
		return false;
	}
}
//在whois和备案查询中只需要提取顶级域名即可,无需三级四级等等,通过对连接的优化,可以更好的seo
//此脚本要和后端的lua脚本验证一致
function extract_domain(url) {
  var suffix = ['.政务.cn', '.公益.cn', '.gov.cn', '.org.cn', '.ac.cn', '.mil.cn', '.net.cn', '.edu.cn', '.com.cn', '.ah.cn', '.bj.cn', '.cq.cn', '.fj.cn', '.gd.cn', '.gs.cn', '.gx.cn', '.gz.cn', '.ha.cn', '.hb.cn', '.he.cn', '.hi.cn', '.hk.cn', '.hl.cn', '.hn.cn', '.jl.cn', '.js.cn', '.jx.cn', '.ln.cn', '.mo.cn', '.nm.cn', '.nx.cn', '.qh.cn', '.sc.cn', '.sd.cn', '.sh.cn', '.sn.cn', '.sx.cn', '.tj.cn', '.tw.cn', '.xj.cn', '.xz.cn', '.yn.cn', '.zj.cn', '.gov.cn', '.cn', '.co', '.cc', '.tv', '.art', '.bio', '.biz', '.cab', '.com', '.fan', '.fit', '.fun', '.fyi', '.ic', '.ink', '.kim', '.law', '.ltd', '.mba', '.net', '.pet', '.pro', '.pub', '.red', '.ren', '.run', '.ski', '.tax', '.top', '.vin', '.vip', '.xin', '.xyz', '.asia', '.auto', '.band', '.beer', '.blue', '.cafe', '.cash', '.chat', '.city', '.club', '.cool', '.fans', '.fund', '.gold', '.gur', '.host', '.info', '.life', '.link', '.live', '.love', '.luxe', '.mobi', '.news', '.pink', '.plus', '.sale', '.shop', '.show', '.site', '.soh', '.team', '.tech', '.vote', '.voto', '.wang', '.wiki', '.work', '.yoga', '.zone', '.archi', '.baid', '.black', '.chase', '.citic', '.cloud', '.email', '.games', '.green', '.group', '.lotto', '.media', '.poker', '.press', '.promo', '.space', '.store', '.today', '.video', '.world', '.center', '.design', '.market', '.online', '.social', '.studio', '.unicom', '.company', '.fashion', '.organic', '.website', '.jpmorgan', '.shopping', '.technology', '.政务', '.公益', '.公司', '.网络', '.网址', '.商城', '.网店', '.中信', '.中国', '.商标', '.广东', '.佛山', '.信息', '.手机', '.在线', '.中文网', '.集团', '.我爱你', '.商店', '.企业', '.娱乐', '.游戏', '.购物', '.餐厅', '.招聘', '.时尚', '.移动', '.网站', '.联通', '.政务', '.org', '.la', '.hk'];
  url = url.toLowerCase();
  url = url2domain(url);
  var ifdomain = false;
  for(var i=0;i<suffix.length;i++){
	  if(url.endsWith(suffix[i])){
		  ifdomain = true;
		  break;
	  }
	  
  }
  if(ifdomain == true){
	  return url;
  }
  else{
	  return false;
  }
}

function moveHttp(str){
	str = str.replace(/http(s)?:\/\/www\./i, "");
	str = str.replace(/http(s)?:\/\//i, "");
	var temp = str.split(':')[0].split('/');
	return moveSubName(temp[0]);
}
function moveSubName(str){
	var temp = str.split('.');
	if(temp.length == 2){
		return str;
	}
	return str;
}
function search(){
	var ym = $('#ym-input').val();
	ym = ym.replace('。', '.');
	ym = moveSubName(ym);
	if(ym == ''){
		$('#ym-input').val('');
		toastr.error("您还什么都没有输入呢！","Error");
		$('#ym-input').focus();
		return;
	}
	var options = $("#select").children('option:selected').val();
	switch(options)
	{
	case "beianhao":
	  location.href = '/icp_'+ym+'.html';
	  break;
	case "host":
	  //这里对用户输入的域名进行验证和过滤
	  ym = extract_domain(ym);
	  if(!ym){
		  toastr.error("非常抱歉,您输入的貌似不是域名,无法进行域名备案查询,请核对一下域名！","出错啦!");
		  return false;
	  }
	  location.href = '/host_'+ym+'.html';
	  break;
	case "websitename":
	  location.href = '/websitename_'+ym+'.html';
	  break;
	case "danwei":
	  location.href = '/danwei_'+ym+'.html';
	  break;
	default:
	  toastr.warning("抱歉,您选择的查询方式暂不支持!");
	  break;
	}
}
function bulkQuery(){
	if(ymi >= yml){
		return;
	}
	$.post(queryUrl,{token:ymt,ym:yms[ymi],i:ymi},function(res){
		showSite(res);
		ymi += 1;
		bulkQuery();
	},'json');
}
function showSite(result){
	console.log(result);
	var html = '<li class="box site-one oe'+(result.i%2)+'">';
	if(result.site && result.unit){
		html += '<div class="line"><div class="line-name">主办单位</div><div class="line-value">'+result.unit.name+'</div></div>';
		html += '<div class="line"><div class="line-name">网站名称</div><div class="line-value">'+result.site.name+'</div></div>';
		html += '<div class="line"><div class="line-name">网站备案号</div><div class="line-value"><a href="/beian/icp/'+result.site.icp+'-'+result.site.number+'">'+result.site.icp+'-'+result.site.number+'</a></div></div>';
		html += '<div class="line"><div class="line-name">首页网址</div><div class="line-value"><a href="http://'+result.site.index_url+'" target="_blank" rel="nofollow">'+result.site.index_url+'</a></div></div>';
		html += '<div class="line"><div class="line-name">审核时间</div><div class="line-value">'+result.site.icp_date+'</div></div>';
	}else{
		html += '<div class="line"><div class="line-name">主办单位</div><div class="line-value">~</div></div>';
		html += '<div class="line"><div class="line-name">网站名称</div><div class="line-value">~</div></div>';
		html += '<div class="line"><div class="line-name">网站备案号</div><div class="line-value">未备案</div></div>';
		html += '<div class="line"><div class="line-name">域名</div><div class="line-value">'+result.ym+'</div></div>';
		html += '<div class="line"><div class="line-name">审核时间</div><div class="line-value">~</div></div>';
	}
	html += '</li>';
	$siteList.append(html);
}

$("#piliang").bind("click",function(){
	//批量查询逻辑开始
	//获取用户输入
	var urls = $("#ym-textarea").val();
	//对用户输入进行网址验证,由于只需要顶级域名来匹配数据库,为了减少不必要的查询
	//这里对www.baidu.com tieba.baidu.com 等输入统一按一个baidu.com 来查询
	//为了效率,用户最多可以提交100个域名进行查询
	if(isEmpty(urls)){
		toastr.error("您还什么都没有输入呢！","大表哥,别闹啦");
		return false;
	}
	var arryurls = urls.split("\n");
	var newurls = [];
	for (var i=0;i<arryurls.length;i++){
		//对域名进行三次验证,过五关,斩六将,干掉不规范的域名,或者是假域名,我的地盘我做主,只保留我指定的域名后缀查询
		var tempurl = url2domain(arryurls[i]);
		if(isDomain(tempurl)){
			tempurl = extract_domain(tempurl);
			if(tempurl){
				//进行去重
				if(newurls.indexOf(tempurl) == -1){
					newurls.push(tempurl);
				}
			}
		}
	}
	//开始进行计算干掉了多少老弱残兵,抱着负责的态度,给用户以提醒
	var lasternb = newurls.length;
	var allnbs = arryurls.length;
	var killnb = allnbs - lasternb;
	//如果超过100个域名,停止检测,提醒用户,唉 总有不安分的人,后端也要验证提交数量,麻烦啊
	if(lasternb>100){
		toastr.warning("您提交了"+lasternb+"个有效域名,数量超出了100个,请去掉一些");
		return false;
	}
	else if(lasternb == 0){
		toastr.warning("真的很抱歉,您共输入了"+allnbs+"个域名,但是却没有一个是有效的域名","捣蛋鬼,别捣蛋");
		return false;
	}
	else{
		$("#ym-textarea").val(newurls.join("\n"));
		//toastr.warning("您提交了"+lasternb+"个有效域名,程序已自动帮您去重,开始检测....");
	}

	
	
	//点选验证码回调
	$('#captcha').clicaptcha({
		src: '/clicaptcha.lua',
		callback: function() {
			var verify = $('#captcha').val();
			//这里是一个回调函数
			//以后所有的对内部计算资源消耗比较大的工具,都采用人机验证策略,首先用js验证输入的参数完整,然后进行回调函数的触发
			//批量api查询
			$.ajax({
				url: "/api/piliang.lua",
				data: {
					urls: urls,
					location_capcha:verify
				},
				type: "POST",
				dataType: "json",
				error: function() {
					toastr.info("网站出现了bug,已自动通知站长,请稍后再试！");
				},
				success: function(json) {
					if(json["status"] == 500 ){
						toastr.error("非常抱歉,接口正在加急调试中,请稍后再试","调试中...");
					}
					else if (json["status"] == 10010){
						toastr.warning("验证码错误,请重新点击验证码,来证明您不是机器人!","验证码错误");
					}
					else{
						toastr.info("程序调试中","稍等");
					}
				}
			});
		}
	});
})


/* 百度统计 */
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?ba0bce93018eb567f31aa720c8fe4a5e";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
