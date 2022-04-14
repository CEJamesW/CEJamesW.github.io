function getCookie(cookieName) {
	var strCookie = document.cookie;
	var arrCookie = strCookie.split("; ");
	for (var i = 0; i < arrCookie.length; i++) {
		var arr = arrCookie[i].split("=");
		if (cookieName == arr[0]) {
			return arr[1];
		}
	}
	return "";
}
(function (a) {
	if ("function" === typeof define && define.amd)
		define(a);
	else if ("object" === typeof exports)
		module.exports = a();
	else {
		var h = window.Cookies,
		c = window.Cookies = a();
		c.noConflict = function () {
			window.Cookies = h;
			return c
		}
	}
})(function () {
	function a() {
		for (var a = 0, b = {}; a < arguments.length; a++) {
			var d = arguments[a],
			e;
			for (e in d)
				b[e] = d[e]
		}
		return b
	}
	function h(c) {
		function b(d, e, g) {
			var l;
			if (1 < arguments.length) {
				g = a({
						path: "/"
					}, b.defaults, g);
				if ("number" === typeof g.expires) {
					var m = new Date;
					m.setMilliseconds(m.getMilliseconds() + 864E5 * g.expires);
					g.expires = m
				}
				try {
					l = JSON.stringify(e),
					/^[\{\[]/.test(l) && (e = l)
				} catch (q) {}
				e = c.write ? c.write(e, d) : encodeURIComponent(String(e)).replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);
				d = encodeURIComponent(String(d));
				d = d.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent);
				d = d.replace(/[\(\)]/g, escape);
				return document.cookie = [d, "=", e, g.expires && "; expires=" + g.expires.toUTCString(), g.path && "; path=" + g.path, g.domain && "; domain=" + g.domain, g.secure ? "; secure" : ""].join("")
			}
			d || (l = {});
			for (var m = document.cookie ? document.cookie.split("; ") : [], h = /(%[0-9A-Z]{2})+/g, k = 0; k < m.length; k++) {
				var f = m[k].split("="),
				n = f[0].replace(h, decodeURIComponent),
				f = f.slice(1).join("=");
				'"' === f.charAt(0) && (f = f.slice(1, -1));
				try {
					f = c.read ? c.read(f, n) : c(f, n) || f.replace(h, decodeURIComponent);
					if (this.json)
						try {
							f = JSON.parse(f)
						} catch (q) {}
					if (d === n) {
						l = f;
						break
					}
					d || (l[n] = f)
				} catch (q) {}
			}
			return l
		}
		b.get = b.set = b;
		b.getJSON = function () {
			return b.apply({
				json: !0
			}, [].slice.call(arguments))
		};
		b.defaults = {};
		b.remove = function (d, e) {
			b(d, "", a(e, {
					expires: -1
				}))
		};
		b.withConverter = h;
		return b
	}
	return h(function () {})
});
(function (a) {
	a.fn.extend({
		clicaptcha: function (c) {
			var b = a.extend({}, h, c),
			d = this;
			a("#clicaptcha-box").length || (a("body").append('<div id="clicaptcha-box"><img class="clicaptcha-img" src="" alt="请点击刷新按钮"><div class="clicaptcha-title"></div><div class="clicaptcha-refresh-box"><div class="clicaptcha-refresh-line clicaptcha-refresh-line-left"></div><a href="javascript:;" class="clicaptcha-refresh-btn" title="刷新"></a><div class="clicaptcha-refresh-line clicaptcha-refresh-line-right"></div></div></div>'), a("body").append('<div id="clicaptcha-mask"></div>'), a("#clicaptcha-mask").click(function () {
					a("#clicaptcha-box").hide();
					a(this).hide()
				}), a("#clicaptcha-box .clicaptcha-refresh-btn").click(function () {
					d.clicaptcha(b)
				}));
			a("#clicaptcha-box, #clicaptcha-mask").show();
			a("#clicaptcha-box .clicaptcha-img").attr("src", b.src + "?" + (new Date).getTime()).load(function () {
				for (var e = a(this), g = getCookie("clicaptcha_text").split("%2C"), c = "请按顺序依次点击", h = [], p = 0; p < g.length; p++)
					h.push("“<span>" + decodeURIComponent(g[p]) + "</span>”");
				c += h.join("、");
				a("#clicaptcha-box .clicaptcha-title").html(c);
				var k = [];
				e.off("mousedown").on("mousedown", function (c) {
					c.preventDefault();
					e.off("mouseup").on("mouseup", function (c) {
						a("#clicaptcha-box .clicaptcha-title span:eq(" + k.length + ")").addClass("clicaptcha-clicked");
						k.push((c.clientX - (a(this).offset().left - $(window).scrollLeft())) + "," + (c.clientY - (a(this).offset().top - $(window).scrollTop())));
						if (k.length == g.length) {
							var f = [k.join("_"), e.width(), e.height()].join(";");
							a.ajax({
								type: "POST",
								url: b.src,
								data: {
									capcha_check: f
								}
							}).done(function (c) {
								var captcha_error_info = "验证失败,请重试";
								if(c==10010){
									captcha_error_info = "验证失败,请重试";
								}
								else if(c==10011){
									captcha_error_info = "嗨,验证码参数丢失,请重试";
								}
								else if(c==10014){
									captcha_error_info = "session已失效,请重新点击";
								}
								else if(c==10012){
									captcha_error_info = "您手动构造的验证码参数无效";
								}
								else if(c==10013){
									captcha_error_info = "位置信息拆分错误,请重试";
								}
								else if(c==10015){
									captcha_error_info = "位置信息只能是数字哦哥,请重试";
								}
								else{
									captcha_error_info = "未知错误,请重试";
								};
								1 == c ? (d.val(f).data("ischeck", !0), a("#clicaptcha-box .clicaptcha-title").html(b.success_tip), setTimeout(function () {
										a("#clicaptcha-box, #clicaptcha-mask").hide();
										b.callback()
									}, 200)) : (a("#clicaptcha-box .clicaptcha-title").html(captcha_error_info), setTimeout(function () {
										d.clicaptcha(b)
									}, 200))
							})
						}
					})
				})
			});
			return this
		},
		clicaptchaCheck: function () {
			var a = !1;
			1 == this.data("ischeck") && (a = !0);
			return a
		},
		clicaptchaReset: function () {
			this.val("").removeData("ischeck");
			return this
		}
	});
	var h = {
		src: "/clicaptcha.py",
		success_tip: "验证成功",
		callback: function () {}
	}
})(window.jQuery);
