$.get("https://vv.video.qq.com/checktime?otype=json",function(res){
	$('#ip').text(res['ip']);
},"jsonp");
$("#str-post").submit(function(){$("#result").html('查询中...');$("#result").load('?'+$("#str-post").serialize(),function(){$("html,body").animate({scrollTop:$(".am-panel-bd").eq(1).offset().top},500);});return false;})