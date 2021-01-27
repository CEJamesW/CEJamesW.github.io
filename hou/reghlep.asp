<%@LANGUAGE="VBScript" codepage="936"%>
<!--#include file="conn.asp"-->
<%
If session("admin")="" then
    Response.Write "<script>alert('用户未登录，请登录');this.location.href='index.asp';</SCRIPT>"
	Response.End
End If
%>
<%
set rs=server.createobject("adodb.recordset")
sql="select id,reg from reg order by id desc"
rs.open sql,conn,1,3

radiobutton=request.form("radiobutton")
if radiobutton="no" then
			   'rs("admin")=request.form("adminname")
			   rs("reg")="禁止注册"
               rs.update
              set conn=nothing
response.write("<script>alert(""成功禁止后台注册！"");navigate(""regbuy.asp"")</script>")
response.end
end if
if radiobutton="yes" then
			   'rs("admin")=request.form("adminname")
			   rs("reg")="允许注册"
               rs.update
              set conn=nothing
response.write("<script>alert(""成功允许后台注册！"");navigate(""regbuy.asp"")</script>")
response.end
end if
%><title>注册设置</title>