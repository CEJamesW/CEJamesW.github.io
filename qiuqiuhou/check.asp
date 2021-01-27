<%@LANGUAGE="VBScript" codepage="936"%>
<!--#include file="conn.asp"--> 
<title>DeDeYun</title>
<% 
admin=request.form("admin") 
password=request.form("password")
if admin="" or password="" then 
response.Write("<script language=javascript>alert('请填写完整!');history.go(-1)</script>") 
end if
sql="select * from admin where admin='"&admin&"' and password='"&password&"'" 
set rs=conn.execute(sql)
if rs.eof or rs.bof then 
response.write "<script language=javascript>"
response.write "alert('用户名或密码错误!');"
response.write "javascript:history.go(-1);"
response.write "</script>"
else
if rs("login")="禁止登录" then
response.write("<script>alert(""账户被禁用，登录失败"");navigate(""login.asp"")</script>")
response.end
end if
session("admin")=admin
response.redirect "index.asp"
end if
%>