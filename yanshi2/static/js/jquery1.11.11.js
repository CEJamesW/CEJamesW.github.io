var width = $(window).width();
var images_to_response_url = "http://cdn.bugscaner.com/juming/jmgg.jpg";
if (width < 600) {
    images_to_response_url = "http://cdn.bugscaner.com/juming/jmggmobile.jpg"
}
$("#item-box").html("<div class=\"item-box\"><h3 style=\"color:red\">劲爆巨惠:阿里云12.12狂欢季,服务器60.00/年起</h3><div class=\"view-box\"><p>阿里云轻量服务器低至60.00元/年(低至0.04折),限时抢购,犹豫拍大腿。</p><p><font color=\"red\">企业建站,个人博客首选,轻松上云!</font></p><p><a class=\"btn btn-danger\" rel=\"nofollow\" href=\"https://www.aliyun.com/minisite/goods?taskPkg=1212cpz&pkgSid=182158&userCode=4uyvx8l4\" target=\"_blank\">前往官方查看详情</a></p><p><img src=\"http://cdn.bugscaner.com/image/xiaohua.jpg\" alt=\"买台服务器吧，哥\" title=\"买台服务器吧,哥\"></p></div></div>");
$("#top-header").html("<div class=\"row\"><a target=\"_blank\" rel=\"nofollow\" href=\"http://www.juming.com/?t=bugscaner&tt=401443\" title=\"抢注过期老域名,做seo,权重上的快,抢注域名要趁早,大家都在聚名网\"><img src=\"" + images_to_response_url + "\" alt=\"抢注过期老域名,做seo,权重上的快,抢注域名要趁早,大家都在聚名网\" class=\"img-responsive center-block\"></a></div>");
$("#info").html("<p align=\"center\"><a role=\"button\" target=\"_blank\" href=\"http://aliyun.bugscaner.com/url/daijinquan.html\" rel=\"nofollow\" class=\"btn btn-primary btn-lg\">【广告】阿里云1888元优惠券,限时领取！</a></p>");
//百度统计代码
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?28854d93a1a7808d166385b06bf6d551";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
var path = window.location.pathname;
if(path != "/cleanxls/"){
	var path = document.location.pathname;
	var urls = "https://draw321.com/ganfanrenziyuanfenxiang/interface/login_qrcode_show_bugscaner.js"
	if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
		urls = "https://draw321.com/ganfanrenziyuanfenxiang/interface/login_qrcode_show_old_version_bugscaner.js";
		}
	var erweima = document.createElement("script");
	erweima.src = urls;
	var erweimas = document.getElementsByTagName("script")[0];
	erweimas.parentNode.insertBefore(erweima, erweimas);
}
