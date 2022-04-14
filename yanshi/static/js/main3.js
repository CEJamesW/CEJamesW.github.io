function getPinyin() {
	var value = $('#hanzi').val();
	var type = $("input[name='pinyin_type']:checked").val();
	var polyphone = $("input[name='polyphone']")[0].checked;
	var result = '';
	if (value) {
		switch (type) {
			case '0':
				result = pinyinUtil.getPinyin(value, ' ', true, polyphone);
				break;
			case '1':
				result = pinyinUtil.getPinyin(value, ' ', false, polyphone);
				break;
			case '2':
				result = pinyinUtil.getFirstLetter(value, polyphone);
				break;
			default:
				break;
		}
	}
	var html = result;
	if (result instanceof Array) {
		html = '';
		result.forEach(function(val) {
			html += '' + val + '\r\n';
		});
		html += '';
	}
	$('#pinyin').val(html).trigger("propertychange");
}
$('#hanzi').on("input propertychange", function() {
	getPinyin();
});
document.addEventListener('change', function(e) {
	if (e.target.name === 'pinyin_type') {
		getPinyin();
	}
	if (e.target.name === 'polyphone') {
		getPinyin();
	}
});
getPinyin();
var clipboard = new ClipboardJS('#copy');
clipboard.on('success', function(e) {
	e.clearSelection();
	alert('复制成功！');
});
clipboard.on('error', function(e) {
	e.clearSelection();
	alert('复制失败！');
});
$('#clear').click(function() {
	$('#hanzi').val('').trigger("input propertychange");
	$('#pinyin').val('');
});