function runit() {}
;runit.plusOne = function(e) {
    for (var t = e.slice(0), n = t.length - 1; n >= 0 && (++t[n],
    !(t[n] <= 255)); --n)
        t[n] = 0;
    return t
}
runit.minusOne = function(e) {
    for (var t = e.slice(0), n = t.length - 1; n >= 0; --n) {
        if (t[n] > 0) {
            --t[n];
            break
        }
        t[n] = 255
    }
    return t
}
runit.compare = function(e, t) {
    for (var n = this.validateSameSizeAndGetSize(e, t), a = 0; a < n; ++a) {
        if (e[a] > t[a])
            return 1;
        if (e[a] < t[a])
            return -1
    }
    return 0
}
runit.validateSameSizeAndGetSize = function(e, t) {
    if (t.length !== e.length)
        throw new Error("Byte arrays need to have the same size");
    return e.length
}
runit.validate = function(e, t) {
    if (!e || e.length !== t || !e.every(function(e) {
        return 0 == (4294967040 & e)
    }))
        throw new Error("Invalid byte array")
}
runit.bytePairToHex = function(e, t) {
    return ((255 & e) << 8 | 255 & t).toString(16)
}
runit.createMasks = function(e, t) {
    for (var n = new Array(e), a = t >> 3, i = 0; i < e; ++i)
        n[i] = i < a ? 255 : i === a ? 65280 >> (7 & t) & 255 : 0;
    return n
}
runit.findPrefixLengthOfMaxStartingCidr = function(e, t) {
    var n = 8 * this.validateSameSizeAndGetSize(e, t)
      , a = this.numberOfTrailingZeros(e)
      , i = n - this.numberOfLeadingEq(e, t);
    return this.numberOfTrailingOnes(t) < i && --i,
    n - Math.min(a, i)
}
runit.numberOfLeadingEq = function(e, t) {
    for (var n = this.validateSameSizeAndGetSize(e, t), a = 0, i = 0; i < n; ++i) {
        var r = this.numberOfLeadingZerosInByte(e[i] ^ t[i]);
        if (a += r,
        r < 8)
            break
    }
    return a
}
runit.numberOfTrailingZeros = function(e) {
    for (var t = 0, n = e.length - 1; n >= 0; --n) {
        var a = this.numberOfTrailingZerosInByte(e[n]);
        if (t += a,
        a < 8)
            break
    }
    return t
}
runit.numberOfTrailingOnes = function(e) {
    for (var t = 0, n = e.length - 1; n >= 0; --n) {
        var a = this.numberOfTrailingZerosInByte(255 & ~e[n]);
        if (t += a,
        a < 8)
            break
    }
    return t
}
runit.numberOfLeadingZerosInByte = function(e) {
    if (0 === e)
        return 8;
    var t = 1;
    return e >> 4 == 0 && (t += 4,
    e <<= 4),
    e >> 6 == 0 && (t += 2,
    e <<= 2),
    t - (e >> 7)
}
runit.numberOfTrailingZerosInByte = function(e) {
    if (0 === e)
        return 8;
    var t, n = 7;
    return 0 != (t = e << 4 & 255) && (n -= 4,
    e = t),
    0 != (t = e << 2 & 255) && (n -= 2,
    e = t),
    n - ((e << 1 & 255) >> 7)
}

runit.toIpRange = function(args) {
    for (var e = args.prefix.bytes, t = e.slice(0), n = this.createMasks(e.length, args.prefixLen), a = 0; a < e.length; ++a) {
        e[a] = e[a] & n[a],
        t[a] = t[a] | 255 & ~n[a];
    }
    return {
        "startIpAddr": {
            "bytes": e
        },
        "endIpAddr": {
            "bytes": t
        }
    };
}

function ipduan_2_cidr(start_ip, end_ip) {
    var zzz = new Array;
    for (t = start_ip.split(".").map(Number),
    n = end_ip.split(".").map(Number),
    a = t; ; ) {
        var i = runit.findPrefixLengthOfMaxStartingCidr(a, n)
          , o = {
            "prefix": {
                "bytes": a
            },
            "prefixLen": i
        };
        zzz.push(o);
        var s = runit.toIpRange(o)["endIpAddr"]["bytes"];
        if (runit.compare(s, n) >= 0)
            break;
        a = runit.plusOne(s)
    }
    return zzz;
}

function h_fillbitsfromleft(num) {
    if (num >= 8) {
        return (255);
    }
    bitpat = 0xff00;
    while (num > 0) {
        bitpat = bitpat >> 1;
        num--;
    }
    return (bitpat & 0xff);
}

//通过掩码 计算初始化ip
function zhujiyanma(yanma) {
    //获取bits 掩码值
    tmpvar = parseInt(yanma, 10);
    ip1 = 0;
    ip2 = 0;
    ip3 = 0;
    ip4 = 0;
    if (tmpvar >= 8) {
        ip1 = 255;
        tmpvar -= 8;
    } else {
        ip1 = h_fillbitsfromleft(tmpvar);
        return [255 - ip1, 255 - ip2, 255 - ip3, 255 - ip4];
    }
    if (tmpvar >= 8) {
        ip2 = 255;
        tmpvar -= 8;
    } else {
        ip2 = h_fillbitsfromleft(tmpvar);
        return [255 - ip1, 255 - ip2, 255 - ip3, 255 - ip4];
    }
    if (tmpvar >= 8) {
        ip3 = 255;
        tmpvar -= 8;
    } else {
        ip3 = h_fillbitsfromleft(tmpvar);
        return [255 - ip1, 255 - ip2, 255 - ip3, 255 - ip4];
    }
    ip4 = h_fillbitsfromleft(tmpvar);
    return [255 - ip1, 255 - ip2, 255 - ip3, 255 - ip4];
}

//通过掩码 计算初始化ip
function calcNWmask(yanma) {
    //获取bits 掩码值
    tmpvar = parseInt(yanma, 10);
    //验证
    ip1 = 0;
    ip2 = 0;
    ip3 = 0;
    ip4 = 0;
    if (tmpvar >= 8) {
        ip1 = 255;
        tmpvar -= 8;
    } else {
        ip1 = h_fillbitsfromleft(tmpvar);
        return [ip1, ip2, ip3, ip4];
    }
    if (tmpvar >= 8) {
        ip2 = 255;
        tmpvar -= 8;
    } else {
        ip2 = h_fillbitsfromleft(tmpvar);
        return [ip1, ip2, ip3, ip4];
    }
    if (tmpvar >= 8) {
        ip3 = 255;
        tmpvar -= 8;
    } else {
        ip3 = h_fillbitsfromleft(tmpvar);
        return [ip1, ip2, ip3, ip4];
    }
    ip4 = h_fillbitsfromleft(tmpvar);
    return [ip1, ip2, ip3, ip4];
}

//整理ip,对用户输入的ip进行处理
function zhengli_ip(ip) {
    var ip_reg = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var yanma_reg = /^([\d]+)$/;
    //去空格
    ip = ip.replace(/^\s+|\s+$/g, "");
    ip = ip.replace(/[^\.\d:]+/g, "-");
	//考虑端口号
	ip = ip.replace(/:\d+/g,"");
    var temp_ips = ip.split("-");
    if (temp_ips.length > 2) {
        return;
    } else if (temp_ips.length == 2) {
        //这里有两种情况,一个是掩码,一个是双ip
        var qian = temp_ips[0];
        var hou = temp_ips[1];
        if (ip_reg.test(qian) && ip_reg.test(hou)) {
            //这是个ip段
			//这里对ip前后顺序进行规范
			if(ip2int(qian)>ip2int(hou)){
				return hou + "-" + qian;
			}else{
				return qian + "-" + hou;
			}
        } else if (ip_reg.test(qian) && yanma_reg.test(hou)) {
            //这是掩码
            if (parseInt(hou) >= 0 && parseInt(hou) <= 32) {
                var temp_ip = qian.split(".");
                var snms = calcNWmask(hou);
                //temp_yanma = parseInt(temp_yanma,10);
                //可用数量
                //let keyongshuliang = Math.pow(2,32 - temp_yanma) - 2;
                //
                yanma_jisuan1 = parseInt(temp_ip[0]) | (~snms[0] & 0xff);
                yanma_jisuan2 = parseInt(temp_ip[1]) | (~snms[1] & 0xff);
                yanma_jisuan3 = parseInt(temp_ip[2]) | (~snms[2] & 0xff);
                yanma_jisuan4 = parseInt(temp_ip[3]) | (~snms[3] & 0xff);
                //
                kaishi1 = parseInt(temp_ip[0], 10) & snms[0];
                kaishi2 = parseInt(temp_ip[1], 10) & snms[1];
                kaishi3 = parseInt(temp_ip[2], 10) & snms[2];
                kaishi4 = parseInt(temp_ip[3], 10) & snms[3];
                kaishi_arr = [kaishi1, kaishi2, kaishi3, kaishi4];
                jieshu1 = yanma_jisuan1;
                jieshu2 = yanma_jisuan2;
                jieshu3 = yanma_jisuan3;
                jieshu4 = yanma_jisuan4;
                jieshu_arr = [jieshu1, jieshu2, jieshu3, jieshu4];
                return kaishi_arr.join(".") + "-" + jieshu_arr.join(".");
            } else {
                return;
            }
        } else {
            return;
        }
    } else {
        if (ip_reg.test(ip)) {
            return ip + "-" + ip;
        } else {
            return false;
        }
    }
}

//ip转数字
function ip2int(ip) {
    var REG = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    result = REG.exec(ip)
    if (!result) {
        return ip + "	" + "错误的ip地址";
    }
    num = Number(result[1]) * 256 * 256 * 256 + Number(result[2]) * 256 * 256 + Number(result[3]) * 256 + Number(result[4]);
    num = num >>> 0;
    return num;
}
//整型解析为IP地址
function int2ip(num) {
    var tt = new Array();
    tt[0] = (num >>> 24) >>> 0;
    tt[1] = ((num << 8) >>> 24) >>> 0;
    tt[2] = (num << 16) >>> 24;
    tt[3] = (num << 24) >>> 24;
    var str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
    return str;
}

//从数组中找出连续的数字范围,并返回数组
function lianxu_hebing(arr) {
    var result = []
      , temp = [];
    returnresult = [];
    arr.sort(function(source, dest) {
        return source - dest;
    }).concat(Infinity).reduce(function(source, dest) {
        temp.push(source);
        if (dest - source > 1) {
            result.push(temp);
            temp = [];
        }
        return dest;
    });
    //只要前后组合
    for (var i = 0; i < result.length; i++) {
        if (result[i].length == 1) {
            returnresult.push([result[i][0], result[i][0]]);
        } else {
            returnresult.push([result[i].slice(0, 1)[0], result[i].slice(-1)[0]]);
        }
    }
    return returnresult;
};

//判断连续或者重叠的范围,进行ip拼接
function chongdie(arr1, arr2) {
    //传递的样式为:arr1= [1,2]; arr2=[3,4]
    //这里必须把start和end进行排序,不然出错
    var AStart = arr1[0]
      , AEnd = arr1[1]
      , BStart = arr2[0]
      , BEnd = arr2[1];
    // 开始课时数组
    var maxStart = [AStart, BStart - 1];
    // 结束课时数组
    var minEnd = [AEnd, BEnd];
    if (Math.max(...maxStart) <= Math.min(...minEnd)) {
        //返回范围
        return [Math.min(...[AStart, BStart]), Math.max(...minEnd)];
    } else {
        return [];
    }
}

//计算重叠部分
function getchongdie(args) {
	//比如传入 [1,3]  [3,8]
	var return_arr = [];
    args.sort((a, b) => a[0] - b[0]);
	var acc = args[0];
	var cur = args[1];
	if(acc[1] >= cur[0] && acc[1] <= cur[1]){
		return_arr[0] = cur[0];
		return_arr[1] = acc[1];
	}
	else if(acc[1]>= cur[1] && acc[0] <= cur[0]){
		return_arr[0] = cur[0];
		return_arr[1] = cur[1];
	}
	else if(acc[0]<=cur[1] && acc[0]>=cur[0]){
		return_arr[0] = acc[0];
		return_arr[1] = cur[1];
	}
	return [return_arr];
};

//计算不重叠部分
function getbuchongdie(args) {
	//比如传入 [1,3]  [3,8]
	var return_arr = [];
    args.sort((a, b) => a[0] - b[0]);
	var acc = args[0];
	var cur = args[1];
	var acc_cha = Math.max(...acc) - Math.min(...acc);
	var cur_cha = Math.max(...cur) - Math.min(...cur);
	var acc_one =acc[0];
	var acc_two = acc[1];
	
	var cur_one = cur[0];
	var cur_two = cur[1];
	if(acc_cha == 0 && cur == 0){
		//两个都是一点,比较大小即可
		if(acc[0] != cur[0]){
			return_arr.push([acc[0],acc[0]]);
			return_arr.push([cur[0],cur[0]]);
			return return_arr;
		}else{
			return [];
		}
	}
	else if(acc_cha == 0 && cur != 0){
		//有一个点
		
	}
	if(acc[1] > cur[0] && acc[1] < cur[1]){
		//要考虑边界了
		return_arr.push([acc[0],cur[0]])
		return_arr.push([acc[1],cur[1]])
	}
	else if(acc[1]> cur[1] && acc[0] < cur[0]){
		return_arr.push([acc[0],cur[0]])
		return_arr.push([cur[1],acc[1]])
	}
	else if(acc[0]<cur[1] && acc[0]>cur[0]){
		return_arr.push([cur[1],acc[1]])
		return_arr.push([cur[0],acc[0]])
	}
	else if(acc[1] == cur[0] && acc[1]<cur[0]){
		if(acc_cha == 0){
			
		}
		return_arr.push([cur[1],acc[1]])
	}
	//还要考虑等于的问题
	else{
		return_arr.push(acc)
		return_arr.push(cur)
	}
	return return_arr;
};


//计算重叠主要函数
function jisuan_chongdie_main(args1,args2){
	var wenben_one_arry = zhuyaohanshu(args1);
	var wenben_two_arry = zhuyaohanshu(args2);
	//开始进行重叠提取
	var return_chongdie_arr = [];
	for(var i=0;i<wenben_two_arry.length;i++){
		for(var z=0;z<wenben_one_arry.length;z++){
			var one_arr = wenben_one_arry[z];
			var two_arr = wenben_two_arry[i];
			var three_arr = getchongdie([one_arr,two_arr]);
			if(three_arr[0].length != 0){
				return_chongdie_arr = return_chongdie_arr.concat(getchongdie([one_arr,two_arr]));
			}
		}
	}
	return return_chongdie_arr;
}


//计算不重叠部分
function buchongdie(args1,args2){
	//传参 args1 文本框1  args2 文本框2
	//先合并 一个参数
	//计算重叠部分, 一个参数
	//遍历,消除重叠的
	//合并两个数组
	var all_args = args1.concat(args2);
	//合并为ip段
	var all_ip_duan = zhuyaohanshu(all_args);
	//计算重叠部分
	var buchongdie_chongdiebufen = jisuan_chongdie_main(args1,args2);
	//类似剪切就行了
	for (var i = 0; i < all_ip_duan.length; i++) {
		for (var z = 0; z < buchongdie_chongdiebufen.length; z++) {
			var temp_jieguo_s = getbuchongdie([all_ip_duan[i],buchongdie_chongdiebufen[z]]);
		}
	}
}


function chongdienew(intervals) {
    if(intervals.length == 0){
        return intervals;
    }
    intervals.sort((a, b) => a[0] - b[0]);
    let chongdienew_res = [];
    chongdienew_res.push(intervals.reduce((acc, cur) => {
        if(acc[1] >= (cur[0]-1)){
            if(acc[1] < cur[1]){
                acc[1] = cur[1];
            }
            return acc;
        }else{
            chongdienew_res.push(acc);
            return cur;
        }
    }));
    return chongdienew_res;
};



function zhuyaohanshu(arr_ips_arg){
    //类型1 <BLOCK1>:起始地址，<BLOCK2>:结束地址
    //这里根据掩码进行计算ip段
    //去重
    var set_arr = new Set(arr_ips_arg);
    set_arr = [...set_arr];
    //转掩码,连续的ip合并
    //对输入的ip进行格式化, startip-endip 这种格式
    //由于输入格式比较混乱,所以这里首先要将内容格式统一
    //第一步将常规的ip进行合并
    //从这里开始
    let temp_arr = [];
    let temp_xun_zhao_lian_xu = [];
    let new_ip_lists = [];
    //数据整理
    for (var i = 0; i < set_arr.length; i++) {
        if (!isEmpty(set_arr[i])) {
            var jieguo = zhengli_ip(set_arr[i]);
            if (!isEmpty(jieguo)) {
                temp_arr.push(jieguo);
            }
        }
    }
    //数据归类
    //新的历史数组
    if (temp_arr.length == 0) {
		toastr.error("没有识别到输入的ip内容,请检查输入是否正确");
        return;
    }
    var chun_ip_lists = [];
    var duan_ip_lists = [];
    for (var i = 0; i < temp_arr.length; i++) {
        var linshi_ips = temp_arr[i].split("-");
        if (linshi_ips[0] == linshi_ips[1]) {
            chun_ip_lists.push(ip2int(linshi_ips[0]));
        } else {
            duan_ip_lists.push([ip2int(linshi_ips[0]), ip2int(linshi_ips[1])]);
        }
    }
    //连续合并
    var chun_ip_lists_hebing = lianxu_hebing(chun_ip_lists);
    //数组合并
    var last_jieguo_gaga = chun_ip_lists_hebing.concat(duan_ip_lists);
	last_jieguo_gaga = chongdienew(last_jieguo_gaga);
	return last_jieguo_gaga;
}


//判断是否为空函数
function isEmpty(obj) {
    if (typeof obj == "undefined" || obj == null || obj == "") {
        return true;
    } else {
        return false;
    }
}

//select 监听事件
$('#types').change(function() {
	var options=$("#types option:selected").val();
	if(options > 5){
		$("#textarea1").attr("class","col-md-6");
		$("#shuru").attr("placeholder","请在这里输入需要计算重叠的ip段1\n支持ip格式混合输入,每次可处理无限ip和ip段\n\n比如:\n192.168.1.1\n192.168.1.0/24\n192.168.1.0\s24\n192.168.1.0，24\n192.168.1.1\s192.168.2.255\n192.168.1.1-------------192.168.2.255\n等等");
		$("#textarea2").show();
	}else{
		$("#textarea1").attr("class","col-md-12");
		$("#shuru").attr("placeholder","支持ip格式混合输入,每次可处理无限ip和ip段\n\n比如:\n192.168.1.1\n192.168.1.0/24\n192.168.1.0\s24\n192.168.1.0，24\n192.168.1.1\s192.168.2.255\n192.168.1.1-------------192.168.2.255\n等等");
		$("#textarea2").css("display","none");
	}
})

$("#start").bind("click", function() {
    var newjieguo = [];
	$("#shuchu").html("");
    var ips = $("#shuru").val();
	var wenben_two = $("#wenben2").val();
    var types = $("#types").val();
	var guize = $("#guize").val();
	var dayuwu_arry = [];
	
	if(isEmpty(guize)){
		guize = "<BLOCK1>/<BLOCK2>";
	}
	ips = ips.replace(/^\s+|\s+$/g, "");
	if(isEmpty(ips)){
		toastr.error("你还什么都没输入呢");
		return;
	}
	if(types >5){
		//验证文本2
		wenben_two = wenben_two.replace(/^\s+|\s+$/g, "");
		if(isEmpty(wenben_two)){
			toastr.error("文本2请输入相应的ip段或者掩码.");
			return;
		}
	}
	var arr_ips = ips.split('\n');
	//将掩码或者ip段转换成ip
	if(types == "5"){
		var last_jieguo = zhuyaohanshu(arr_ips);
		//开始计算总数量
		all_ips_will_make = 0;
		//计算总ip数量
		for (var n = 0; n < last_jieguo.length; n++) {
			all_ips_will_make = all_ips_will_make + (last_jieguo[n][1]-last_jieguo[n][0]+1);
		}
		if(all_ips_will_make>300000){
			toastr.error("非常抱歉,当前输入的ip或者ip段将要生成总ip数量为:"+all_ips_will_make+".由于数量太大,这将导致浏览器长时间卡顿,所以终止此次转换。为了保证用户体验每次最多仅允许生成30万ip。");
			return;
		}
		//开始生成ip段
		var all_ips_will_make_res = [];
		for (var n = 0; n < last_jieguo.length; n++) {
			var temp_last_jieguo_arr_one = last_jieguo[n];
			for (var m = temp_last_jieguo_arr_one[0]; m <= temp_last_jieguo_arr_one[1]; m++) { 
				all_ips_will_make_res.push(int2ip(m));
			}
		}
		$("#shuchu").html(all_ips_will_make_res.join("\n"));
		return;
		
	}
	else if(types == "6"){
		var wenben2_ips = wenben_two.split('\n');
		var will_return_jieguo_arr_return = [];
		//当前为起始地址,不便于观察,转换为掩码形式
		var will_return_jieguo_arr = jisuan_chongdie_main(arr_ips,wenben2_ips);
		for (var n = 0; n < will_return_jieguo_arr.length; n++) {
			will_return_jieguo_arr_return.push(int2ip(will_return_jieguo_arr[n][0])+"-"+int2ip(will_return_jieguo_arr[n][1]));
		}
		$("#shuchu").html(will_return_jieguo_arr_return.join("\n"));
		return;
	}
    //开始查询掩码
    //最终结果
	var last_jieguo = zhuyaohanshu(arr_ips);
    var zuizhongjieguo = [];
    for (var g = 0; g < last_jieguo.length; g++) {
        if (types == 4) {
			var my_temp_over = guize.replace(/<BLOCK1>/g,int2ip(last_jieguo[g][0]));
			my_temp_over = my_temp_over.replace(/<BLOCK2>/g,int2ip(last_jieguo[g][1]));
            zuizhongjieguo.push(my_temp_over)
        }
		else {
            var temp_zuizhongjieguo = ipduan_2_cidr(int2ip(last_jieguo[g][0]), int2ip(last_jieguo[g][1]))
            for (var n = 0; n < temp_zuizhongjieguo.length; n++) {
                if (types == 1) {
					var my_temp_over = guize.replace(/<BLOCK1>/g,temp_zuizhongjieguo[n]["prefix"]["bytes"].join("."));
					my_temp_over = my_temp_over.replace(/<BLOCK2>/g,temp_zuizhongjieguo[n]["prefixLen"]);
                    zuizhongjieguo.push(my_temp_over);
                } else if (types == 2) {
                    //子网掩码
					var my_temp_over = guize.replace(/<BLOCK1>/g,temp_zuizhongjieguo[n]["prefix"]["bytes"].join("."));
					my_temp_over = my_temp_over.replace(/<BLOCK2>/g,calcNWmask(temp_zuizhongjieguo[n]["prefixLen"]).join("."));
                    zuizhongjieguo.push(my_temp_over);
                } else if (types == 3) {
                    //主机掩码
					var my_temp_over = guize.replace(/<BLOCK1>/g,temp_zuizhongjieguo[n]["prefix"]["bytes"].join("."));
					my_temp_over = my_temp_over.replace(/<BLOCK2>/g,zhujiyanma(temp_zuizhongjieguo[n]["prefixLen"]).join("."));
                    zuizhongjieguo.push(my_temp_over);
                }
            }
        }
    }
	toastr.info("处理完毕,源输入数量:"+arr_ips.length+"个,处理结果数量:"+zuizhongjieguo.length+"个");
    $("#shuchu").html(zuizhongjieguo.join("\n"));
});