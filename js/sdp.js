<!DOCTYPE html>
<style>
span {font:14px/20px ΢���ź�;}
#counter {
 width:50px;height:20px;
 border:1px solid #CCC;
 background:#F9F9F9;
 font:14px/20px Consolas;
 text-align:center;
 margin:10px;
}
</style>
<span>ʹ�������ֵ�����ֵ��С</span><br/>
<div id="counter">0</div>
<script>
//�ж������
var isIE=navigator.userAgent.match(/MSIE (\d)/i);
isIE=isIE?isIE[1]:undefined;
var isFF=/FireFox/i.test(navigator.userAgent);
//��ȡԪ��
var counter=document.getElementById("counter");
//�������¼�
if(isIE<9) //��ͳ�����ʹ��MouseWheel�¼�
 counter.attachEvent("onmousewheel",function(){
  //���������ֹ����ľ���
  //һ��3�У�ÿ��40���أ����Գ���120
  var v=event.wheelDelta/120;
  counter.innerHTML=counter.innerHTML*1+v;
  //��ֹ�����Ĭ�Ϸ���
  return false;
 });
else if(!isFF) //���������ִ������Ҳʹ��MouseWheel�¼�
 counter.addEventListener("mousewheel",function(e){
  //���������ֹ����ľ���
  var v=e.wheelDelta/120;
  counter.innerHTML=counter.innerHTML*1+v;
  //��ֹ�����Ĭ�Ϸ���
  e.preventDefault();
 },false);
else //����Ļ��ʹ��DOMMouseScroll�¼�
 counter.addEventListener("DOMMouseScroll",function(e){
  //���������ֹ����ľ���
  //һ����3�У�����Ҫע�⣬��������ز�ͬ�������Ǹ�ֵ
  var v=-e.detail/3;
  counter.innerHTML=counter.innerHTML*1+v;
  //��ֹ�����Ĭ�Ϸ���
  e.preventDefault();
 },false);
</script>