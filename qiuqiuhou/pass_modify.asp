<%@LANGUAGE="VBScript" codepage="936"%>
<!--#include file="conn.asp"-->
<%
If session("admin")="" then
    Response.Write "<script>alert('用户未登录，请登录');this.location.href='login.asp';</SCRIPT>"
	Response.End
End If
%>
<%
set rs=server.createobject("adodb.recordset")
sql="select id,admin,password from admin order by id desc"
rs.open sql,conn,1,3

              rs("password")=request.form("password")
              rs.update
              set conn=nothing
              response.write("<script>alert(""修改成功！"");navigate(""password.asp"")</script>")
%>