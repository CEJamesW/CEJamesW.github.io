$("#str-post").submit(function(){$("#result").html('<input type="text" autocomplete="off" class="am-form-field md5-result" value="转换中...">');$("#result").load('?'+$("#str-post").serialize());return false;})