<!DOCTYPE html>
<style>
span {font:14px/20px 微软雅黑;}
#counter {
 width:50px;height:20px;
 border:1px solid #CCC;
 background:#F9F9F9;
 font:14px/20px Consolas;
 text-align:center;
 margin:10px;
}
</style>
<span>使用鼠标滚轮调整数值大小</span><br/>
<div id="counter">0</div>
<script>
//判断浏览器
var isIE=navigator.userAgent.match(/MSIE (\d)/i);
isIE=isIE?isIE[1]:undefined;
var isFF=/FireFox/i.test(navigator.userAgent);
//获取元素
var counter=document.getElementById("counter");
//鼠标滚轮事件
if(isIE<9) //传统浏览器使用MouseWheel事件
 counter.attachEvent("onmousewheel",function(){
  //计算鼠标滚轮滚动的距离
  //一格3行，每行40像素，所以除以120
  var v=event.wheelDelta/120;
  counter.innerHTML=counter.innerHTML*1+v;
  //阻止浏览器默认方法
  return false;
 });
else if(!isFF) //除火狐外的现代浏览器也使用MouseWheel事件
 counter.addEventListener("mousewheel",function(e){
  //计算鼠标滚轮滚动的距离
  var v=e.wheelDelta/120;
  counter.innerHTML=counter.innerHTML*1+v;
  //阻止浏览器默认方法
  e.preventDefault();
 },false);
else //奇葩的火狐使用DOMMouseScroll事件
 counter.addEventListener("DOMMouseScroll",function(e){
  //计算鼠标滚轮滚动的距离
  //一格是3行，但是要注意，这里和像素不同的是它是负值
  var v=-e.detail/3;
  counter.innerHTML=counter.innerHTML*1+v;
  //阻止浏览器默认方法
  e.preventDefault();
 },false);
</script>