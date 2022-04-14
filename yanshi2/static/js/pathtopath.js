//对用户输入的网址进行验证
//判断是否为空函数
function isEmpty(obj){
	if(typeof obj == "undefined" || obj == null || obj == ""){
		return true;
	}else{
		return false;
	}
}

$(function() {
	$("#apath").val("http://tools.bugscaner.com/pathtopath/pathtopath/pathtopath.html");
	$("#bpath").val("../11111111.png\r\ntest/./1.png\r\n/test/../1.png\r\n/../../../../hehe/../../../gaga.png\r\n./../../../../../fffffffff.html\r\nmm/dddd/./look.html");
	
	$("#clean").click(function() {
		$("#apath").val("");
		$("#bpath").val("");
		$("#shuchu").val("");
		return false;
	})
	$("#sumbit").click(function() {
		var apath = $("#apath").val();
		var bpath = $("#bpath").val();
		//验证用户输入
		if(isEmpty(apath)){
			toastr.error("请输入网址的原始路径");
			return false;
		}
		if(isEmpty(bpath)){
			toastr.error("请输入相对路径哦");
			return false;
		}
		$.ajax({
			url: "/api/pathtopath.html",
			data: {
				apath: apath,
				bpath: bpath
			},
			type: "POST",
			dataType: "json",
			error: function() {
				toastr.info("网站出现了bug,已自动通知站长,请稍后再试！");
			},
			success: function(json) {
				//对解析结果或者错误,进行前端展示
				if(json["status"] == 1 ){
					toastr.error("相对路径什么都没有输入","大表哥,出错了");
					return false;
				}
				else if(json["status"] ==  2){
					toastr.error("转换失败了????????????????还是你输入的全是回车?","结果为空");
					return false;
				}
				else if(json["status"] ==  200){
					toastr.error("成功转换","恭喜您");
					$("#shuchu").val(json["infos"]);
					return false;
				}
				else{
					toastr.error("修不完的bug,走不完的路","未知错误");
					return false;
				}
			}
		});
		
		
		
		
		
		
	});
});