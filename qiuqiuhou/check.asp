<%@LANGUAGE="VBScript" codepage="936"%>
<!--#include file="conn.asp"--> 
<title>DeDeYun</title>
<% 
admin=request.form("admin") 
password=request.form("password")
if admin="" or password="" then 
response.Write("<script language=javascript>alert('����д����!');history.go(-1)</script>") 
end if
sql="select * from admin where admin='"&admin&"' and password='"&password&"'" 
set rs=conn.execute(sql)
if rs.eof or rs.bof then 
response.write "<script language=javascript>"
response.write "alert('�û������������!');"
response.write "javascript:history.go(-1);"
response.write "</script>"
else
if rs("login")="��ֹ��¼" then
response.write("<script>alert(""�˻������ã���¼ʧ��"");navigate(""login.asp"")</script>")
response.end
end if
session("admin")=admin
response.redirect "index.asp"
end if
%>