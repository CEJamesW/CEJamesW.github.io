//判断是否为空字符串
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}
var daochu="";
$(function() {
	$(".btn").click(function(){
		//判断点击了哪个按钮
		var clickname = $(this).html();
		if(clickname == "示例1(提取所有a链接)"){
			$("#content").val("<div class=\"row\"><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #EE30A7;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线超级外链发布工具\" href=\"/chaojiwailian/\"><img width=\"35%\" alt=\"在线超级外链发布工具\" src=\"/static/images/chaojiwailian.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">超级外链发布工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">超级外链可以帮您快速的在各大查询或者搜索网站留下查询痕迹,以便能更好的吸引搜索引擎的到来!</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #a64d79;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"免费刷Alexa世界排名工具\" href=\"/alexa/\"><img width=\"35%\" alt=\"免费刷Alexa世界排名工具\" src=\"/static/images/alexa.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">刷Alexa排名工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">您可以用它来增加网站流量、提升帖子/空间/博客的点击率，灵活的使用可以起到很好的网络推广效果!</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #6d9eeb;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线url链接自动批量提交到百度蜘蛛\" href=\"/baidutuisong/\"><img width=\"35%\" alt=\"在线url链接自动批量提交到百度蜘蛛\" src=\"/static/images/baidu.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">url批量推送到百度蜘蛛</em></a></div><div class=\"caption tcenter\"><p class=\"\">本工具可加快百度爬虫抓取速度,从而增快百度收录！</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #666600;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线Robots文件检测工具！\" href=\"/robotstest/\"><img width=\"35%\" alt=\"在线Robots文件检测工具\" src=\"/static/images/robots.png\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">在线Robots文件检测工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">检测您网站的robots.txt文件是否生效,内容是否有效！</p></div></div></div></div>");
			$("#regex").val("name=\"a\"");
			$("#attrs").val("href");
			$("#shuchu").val("/chaojiwailian/\r\n/alexa/\r\n/baidutuisong/\r\n/robotstest/");
		}
		else if(clickname == "示例2(提取所有图片链接)"){
			$("#content").val("<div class=\"row\"><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #EE30A7;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线超级外链发布工具\" href=\"/chaojiwailian/\"><img width=\"35%\" alt=\"在线超级外链发布工具\" src=\"/static/images/chaojiwailian.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">超级外链发布工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">超级外链可以帮您快速的在各大查询或者搜索网站留下查询痕迹,以便能更好的吸引搜索引擎的到来!</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #a64d79;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"免费刷Alexa世界排名工具\" href=\"/alexa/\"><img width=\"35%\" alt=\"免费刷Alexa世界排名工具\" src=\"/static/images/alexa.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">刷Alexa排名工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">您可以用它来增加网站流量、提升帖子/空间/博客的点击率，灵活的使用可以起到很好的网络推广效果!</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #6d9eeb;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线url链接自动批量提交到百度蜘蛛\" href=\"/baidutuisong/\"><img width=\"35%\" alt=\"在线url链接自动批量提交到百度蜘蛛\" src=\"/static/images/baidu.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">url批量推送到百度蜘蛛</em></a></div><div class=\"caption tcenter\"><p class=\"\">本工具可加快百度爬虫抓取速度,从而增快百度收录！</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #666600;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线Robots文件检测工具！\" href=\"/robotstest/\"><img width=\"35%\" alt=\"在线Robots文件检测工具\" src=\"/static/images/robots.png\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">在线Robots文件检测工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">检测您网站的robots.txt文件是否生效,内容是否有效！</p></div></div></div></div>");
			$("#regex").val("name=\"img\"");
			$("#attrs").val("src");
			$("#shuchu").val("/static/images/chaojiwailian.jpg\r\n/static/images/alexa.jpg\r\n/static/images/baidu.jpg\r\n/static/images/robots.png");
		}
		else if(clickname == "示例3(提取a标签的文本值)"){
			$("#content").val("<div class=\"row\"><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #EE30A7;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线超级外链发布工具\" href=\"/chaojiwailian/\"><img width=\"35%\" alt=\"在线超级外链发布工具\" src=\"/static/images/chaojiwailian.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">超级外链发布工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">超级外链可以帮您快速的在各大查询或者搜索网站留下查询痕迹,以便能更好的吸引搜索引擎的到来!</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #a64d79;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"免费刷Alexa世界排名工具\" href=\"/alexa/\"><img width=\"35%\" alt=\"免费刷Alexa世界排名工具\" src=\"/static/images/alexa.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">刷Alexa排名工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">您可以用它来增加网站流量、提升帖子/空间/博客的点击率，灵活的使用可以起到很好的网络推广效果!</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #6d9eeb;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线url链接自动批量提交到百度蜘蛛\" href=\"/baidutuisong/\"><img width=\"35%\" alt=\"在线url链接自动批量提交到百度蜘蛛\" src=\"/static/images/baidu.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">url批量推送到百度蜘蛛</em></a></div><div class=\"caption tcenter\"><p class=\"\">本工具可加快百度爬虫抓取速度,从而增快百度收录！</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #666600;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线Robots文件检测工具！\" href=\"/robotstest/\"><img width=\"35%\" alt=\"在线Robots文件检测工具\" src=\"/static/images/robots.png\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">在线Robots文件检测工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">检测您网站的robots.txt文件是否生效,内容是否有效！</p></div></div></div></div>");
			$("#regex").val("name=\"a\"");
			$("#attrs").val("text");
			$("#shuchu").val("超级外链发布工具\r\n刷Alexa排名工具\r\nurl批量推送到百度蜘蛛\r\n在线Robots文件检测工具");
		}
		else if(clickname == "示例4(提取源码中的点赞88)"){
			$("#content").val("<div class=\"row\"><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #EE30A7;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线超级外链发布工具\" href=\"/chaojiwailian/\"><img width=\"35%\" alt=\"在线超级外链发布工具\" src=\"/static/images/chaojiwailian.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">超级外链发布工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">超级外链可以帮您快速的在各大查询或者搜索网站留下查询痕迹,以便能更好的吸引搜索引擎的到来!</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #a64d79;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"免费刷Alexa世界排名工具\" href=\"/alexa/\"><img width=\"35%\" alt=\"免费刷Alexa世界排名工具\" src=\"/static/images/alexa.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">刷Alexa排名工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">您可以用它来增加网站流量、提升帖子/空间/博客的点击率，灵活的使用可以起到很好的网络推广效果!</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #6d9eeb;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线url链接自动批量提交到百度蜘蛛\" href=\"/baidutuisong/\"><img width=\"35%\" alt=\"在线url链接自动批量提交到百度蜘蛛\" src=\"/static/images/baidu.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">url批量推送到百度蜘蛛</em></a></div><div class=\"caption tcenter\"><p class=\"\">本工具可加快百度爬虫抓取速度,从而增快百度收录！</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #666600;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线Robots文件检测工具！\" href=\"/robotstest/\"><img width=\"35%\" alt=\"在线Robots文件检测工具\" src=\"/static/images/robots.png\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">在线Robots文件检测工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">检测您网站的robots.txt文件是否生效,内容是否有效！</p></div></div></div></div>");
			$("#regex").val("name=\"div\",attrs={\"class\":\"abs\"}");
			$("#attrs").val("text");
			$("#shuchu").val("88\r\n\r\n88\r\n\r\n88\r\n\r\n88\r\n");
		}
		else if(clickname == "示例5(提取4个div的背景颜色值)"){
			$("#content").val("<div class=\"row\"><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #EE30A7;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线超级外链发布工具\" href=\"/chaojiwailian/\"><img width=\"35%\" alt=\"在线超级外链发布工具\" src=\"/static/images/chaojiwailian.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">超级外链发布工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">超级外链可以帮您快速的在各大查询或者搜索网站留下查询痕迹,以便能更好的吸引搜索引擎的到来!</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #a64d79;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"免费刷Alexa世界排名工具\" href=\"/alexa/\"><img width=\"35%\" alt=\"免费刷Alexa世界排名工具\" src=\"/static/images/alexa.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">刷Alexa排名工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">您可以用它来增加网站流量、提升帖子/空间/博客的点击率，灵活的使用可以起到很好的网络推广效果!</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #6d9eeb;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线url链接自动批量提交到百度蜘蛛\" href=\"/baidutuisong/\"><img width=\"35%\" alt=\"在线url链接自动批量提交到百度蜘蛛\" src=\"/static/images/baidu.jpg\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">url批量推送到百度蜘蛛</em></a></div><div class=\"caption tcenter\"><p class=\"\">本工具可加快百度爬虫抓取速度,从而增快百度收录！</p></div></div></div><div class=\"col-sm-3\"><div style=\"height: 220px;background-color: #fafafa;border:none;box-shadow: rgba(0,0,0,.3) 0 1px 3px 0\" class=\"thumbnail\"><div style=\"right:30px;top:10px\" class=\"abs\"><span class=\"glyphicon glyphicon-thumbs-up\"></span>88</div><div style=\"background-color: #666600;\" class=\"thumbnail-img  tcenter\"><a target=\"_blank\" title=\"在线Robots文件检测工具！\" href=\"/robotstest/\"><img width=\"35%\" alt=\"在线Robots文件检测工具\" src=\"/static/images/robots.png\" class=\"lazy\"><div class=\"clear5\"></div><em class=\"h3\">在线Robots文件检测工具</em></a></div><div class=\"caption tcenter\"><p class=\"\">检测您网站的robots.txt文件是否生效,内容是否有效！</p></div></div></div></div>");
			$("#regex").val("name=\"div\",attrs={\"class\":\"thumbnail-img\"}");
			$("#attrs").val("style");
			$("#shuchu").val("background-color: #EE30A7;\r\nbackground-color: #a64d79;\r\nbackground-color: #6d9eeb;\r\nbackground-color: #666600;");
		}
		else if(clickname == "示例6(正则表达式)"){
			$("#content").val("<span class=\"test\" id=\"abc123\">在线工具</span>\r\n<span class=\"test\" id=\"abc456\">html源码提取</span>\r\n<span class=\"test\" id=\"abcdef\">站长工具</span>\r\n<span class=\"test\" id=\"cde666\">SEO工具</span>");
			$("#regex").val("name=\"span\",attrs={\"id\":regex(\"abc\\d{3}\")}");
			$("#attrs").val("text");
			$("#shuchu").val("在线工具\r\nhtml源码提取");
		}
		else if(clickname == "点我自动填写测试"){
			$("#content").val("<table class=\"table table-bordered table-striped\"><colgroup><col class=\"col-xs-2\"><col class=\"col-xs-6\"></colgroup><thead><tr><th>Cms</th><th>描述</th></tr></thead><tbody><tr><th scope=\"row\"><code>Tncms</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>Discuz-6</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>phpvod</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>Website Creator</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>微信达微信数字投票管理系统</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>Stackla Social Hub</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>Banshee</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>mymps</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>Kolibri CMS</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>AnanyooCMS</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>ILAS网上图书馆</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>Destoon</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>Dokeos</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>RockRMS</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>Roxx-Auderis-CMS</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>BoyowCMS</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>ocPortal</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>1C-Bitrix</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>phpyun</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>Nucleus-CMS</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>cockpit</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>广州联雅CMS</code></th><td>暂未添加描述</td></tr><tr><th scope=\"row\"><code>onelan_cms</code></th><td>暂未添加描述</td></tr></tbody></table>");
			$("#regex").val("name=\"code\"");
			$("#attrs").val("text");
			$("#shuchu").val("Tncms\r\nDiscuz-6\r\nphpvod\r\nWebsite Creator\r\n微信达微信数字投票管理系统\r\nStackla Social Hub\r\nBanshee\r\nmymps\r\nKolibri CMS\r\nAnanyooCMS\r\nILAS网上图书馆\r\nDestoon\r\nDokeos\r\nRockRMS\r\nRoxx-Auderis-CMS\r\nBoyowCMS\r\nocPortal\r\n1C-Bitrix\r\nphpyun\r\nNucleus-CMS\r\ncockpit\r\n广州联雅CMS\r\nonelan_cms");
			$('html , body').animate({scrollTop: 0},'slow');
			return false;
		}
		else if(clickname == "预览代码"){
			var inputcontent = $("#content").val();
			if(isEmpty(inputcontent)){
				toastr.error("什么都没有输入,不能预览代码！","大表哥别闹啦");
				return false;
			}
			var winname = window.open('', "_blank", '');
			winname.document.open('text/html', 'replace');
            winname.opener = null // 防止代码对论谈页面修改
            winname.document.write(inputcontent);
            winname.document.close();
		}
		else if(clickname == "提取"){
			//起一个正则的字段名字,为后期的可以一次添加多个字段提取做准备
			//用户输入的源码
			var inputcontent = $("#content").val();
			//用户输入的过滤规则
			var regexcontent = $("#regex").val();
			//标签属性
			var attrscontent = $("#attrs").val();
			//文本替换
			var replacecontent = $("#replace").val();
			
			if(isEmpty(inputcontent)){
				toastr.warning("请输入html源码","你太懒了");
				return false;
			}
			if(isEmpty(regexcontent)){
				toastr.warning("请输入提取规则,不知道怎么填？可以点击示例","要学会看示例");
				return false;
			}
			if(isEmpty(attrscontent)){
				toastr.warning("请输入输出规则,不知道怎么填？常见的有text,src,alt,title等","要学会看示例");
				return false;
			}
			//对用户的输入进行判断,用来减少服务端的处理压力,哪怕是一次

			$.ajax({
				url: "/api/bs4.html",
				data: {
					html: inputcontent,
					regexcontent: regexcontent,
					attrscontent: attrscontent,
					replacecontent: replacecontent
				},
				type: "POST",
				dataType: "json",
				error: function() {
					toastr.info("网站出现了bug,已自动通知站长,请稍后再试！");
				},
				success: function(json) {
					//对解析结果或者错误,进行前端展示
					if(json["status"] == 0 ){
						toastr.error("缺少标签名name=标志,目前暂时不支持简写,请明确标签名字","大表哥,出错了");
						return false;
					}
					else if(json["status"] ==  1){
						toastr.error("您输入的正则表达式序列化过程中出现了错误,如果你没错,那么这个可能是bug,如果您感到困惑,请发邮件给我!谢谢","注意,注意,bug出现");
						return false;
					}
					else if(json["status"] ==  2){
						toastr.error("正则表达式compile过程中出错,如果你没错,那么这个可能是bug,如果您感到困惑,请发邮件给我!谢谢","注意,注意,bug出现");
						return false;
					}
					else if(json["status"] ==  3){
						toastr.error("标签属性反序列化出错,请格外注意您输入的\"和',而且保证他类似python的字典格式","大表哥,出错啦");
						return false;
					}
					else if(json["status"] ==  4){
						toastr.error("你终于还是绕过了前端js检测,直接进行post提交了,html源码不能为空","大表哥,出错啦");
						return false;
					}
					else if(json["status"] ==  5){
						toastr.error("请填写规则,如果不会可以点击示例,自动填写测试一下","大表哥,出错啦");
						return false;
					}
					else if(json["status"] ==  6){
						toastr.error("请填写输出规则,常见的填写有,text,src,a,alt,id,class,style等等","大表哥,出错啦");
						return false;
					}
					else if(json["status"] ==  200){
						toastr.error("输入的规则完全可用,内容提取成功","恭喜您");
						$("#shuchu").val(json["infos"]);
						return false;
					}
					else{
						toastr.error("修不完的bug,走不完的路","未知错误");
						return false;
					}
				}
			});
		}
		else{
			toastr.info("功能暂未实现","抱歉");
			return false;
		}
		//eval("encodeanddecodeaes('"+$(this).html()+"')");
	});
});