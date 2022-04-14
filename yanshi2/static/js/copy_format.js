$(function() {
	ZeroClipboard.setDefaults({

		moviePath : "/static/js/ZeroClipboard.swf"

	});
	var clip = new ZeroClipboard($("#btn4"));

	clip.on("load", function(client) {
		debugstr("Flash movie loaded and ready.");

		client.on("complete", function(client, args) {
			if (args && args.text.length > 0)
				alert("复制成功！");
		});
	});

	clip.on("noFlash", function(client) {
		debugstr("Your browser has no Flash.");
	});

	clip.on("wrongFlash", function(client, args) {
		debugstr("Flash 10.0.0+ is required but you are running Flash " + args.flashVersion.replace(/,/g, "."));
	});

	function debugstr(text) {
		console.log(text);
	}
});
