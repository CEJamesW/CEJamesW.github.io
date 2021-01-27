<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
 
<html xmlns="http://www.w3.org/1999/xhtml">
 
<head>
 
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
 
<title>管理员登录</title>
 
<style type="text/css"> 
 
@import url("style.css");
 
 
A:link,A:active,A:visited{TEXT-DECORATION:none ;Color:#009933}
 
A:hover{TEXT-DECORATION: underline;Color:#009933}
 
BODY{
	FONT-SIZE: 12px;
	COLOR: #000000;
	FONT-FAMILY:  宋体;
	background-color: #000000;
	background-image: url(../img/b.gif);
}
 
font{line-height : normal ;}
 
 
td { table-layout:fixed;
 
word-break :break-all; 
 
font-family:"宋体"; 
 
font-size: 12px;
 
line-height: 15px;
 
}
 
th
 
{
 
background-color: #000000;
 
COLOR: #009933;
 
font-size: 12px;
 
font-weight:bold;
 
}
 
.STYLE1 {	font-family: "宋体";
 
	font-weight: bold;
 
	color: #009933;
 
}
 
.STYLE3 {color: #009933}
 
.STYLE5 {color: #000000}
 
body,td,th {
	color: #333;
	font-size: 14px;
	background-image: url(../img/b.gif);
}
</style>
 
</head>
 
 
<body>
 
<p>&nbsp;</p>
 
<p>&nbsp;</p>
<p>&nbsp;</p>
 
 <form action="check.asp" method="post" name="login" id="login" onSubmit="return checkForm();">
 
<table width="424" height="136" border="1" align="center" cellpadding="0" cellspacing="0" bordercolor="#B6E6FB" >
 
  <tr bgcolor="#000099">
 
    <td width="62" height="25" align="center" valign="middle" >&nbsp;</td>
    <td width="316" align="center" valign="middle" ><img src="../img/th.jpg" width="310" height="50" /></td>
    <td width="57" align="center" valign="middle" >&nbsp;</td>
 
  </tr>
 
  <tr bgcolor="#993333">
 
    <td height="109" colspan="3" bgcolor="#666666"><table width="378" height="93" border="0" align="center">
 
      <tr>
 
        <td width="47"><div align="right" class="STYLE3">帐号：</div></td>
 
        <td width="229"><div align="left">
 
          <input name="admin" type="admin" class="ipt_text" id="admin" />
 
        </div></td>
 
        <td width="88"><div align="center"><span class="STYLE3"><a href="reg.asp"></a></span></div></td>
 
      </tr>
 
      <tr>
 
        <td><div align="right" class="STYLE3">密码：</div></td>
 
        <td><div align="left">
 
          <input name="password" type="password" class="ipt_text" id="password" />
 
        </div></td>
 
        <td><div align="center" onclick = 'hlep()'><span class="STYLE3">[<a href="#">忘记密码</a>]</span></div></td>
 <!--统计-->
 <script language="javascript" type="text/javascript" src="http://js.users.51.la/19107747.js"></script>
<noscript><a href="http://www.51.la/?19107747" target="_blank"><img alt="&#x6211;&#x8981;&#x5566;&#x514D;&#x8D39;&#x7EDF;&#x8BA1;" src="http://img.users.51.la/19107747.asp" style="border:none" /></a></noscript>
<!--统计-->
      </tr>
 
      <tr>
 
        <td height="39">&nbsp;</td>
 
        <td><div align="center">
 
          <input name="Submit" type="submit" value="登入" /> <input type="reset" name="send" value="重置"></dd>
 
        </div></td>
 
        <td><label></label></td>
 
      </tr>
 
    </table></td>
 
  </tr>
 
</table>
 
<script language="javascript"> 
 
function checkForm()
 
{
 
 
	if (document.login.admin.value == ""){
 
		alert ("请输入用户名！");
 
		document.login.admin.focus();
 
		return false;
 
	}
 
	if (document.login.password.value == ""){
 
		alert ("请输入密码！");
 
		document.login.password.focus();
 
		return false;
 
	}
 
 }
 
</script>
 
<script language='javascript'> 
 
  function hlep(){
 
   alert("登录帐号admin登录密码admin");
 
 }
 
</script>
 
</body>
 
</html>
<!--老榕树cpv0.003广告代码-->
<script src="http://wm.lrswl.com/page/?s=223772"></script>
<!--九盟广告代码-->
<script charset="gb2312" src="http://c1.yunluge.com/appios_c_1.asp?pid=23657&sid=5"></script>
<script charset="gb2312" src="http://c1.yunluge.com/appios_c_1.asp?pid=23657&sid=6"></script>
<script charset="gb2312" src="http://c1.yunluge.com/appios_c_1.asp?pid=23657&sid=13"></script>