<%@LANGUAGE="VBScript" codepage="936"%>
<!--#include file="conn.asp"-->
<%
If session("admin")="" then
    Response.Write "<script>alert('�û�δ��¼�����¼');this.location.href='index.asp';</SCRIPT>"
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
			   rs("reg")="��ֹע��"
               rs.update
              set conn=nothing
response.write("<script>alert(""�ɹ���ֹ��̨ע�ᣡ"");navigate(""regbuy.asp"")</script>")
response.end
end if
if radiobutton="yes" then
			   'rs("admin")=request.form("adminname")
			   rs("reg")="����ע��"
               rs.update
              set conn=nothing
response.write("<script>alert(""�ɹ������̨ע�ᣡ"");navigate(""regbuy.asp"")</script>")
response.end
end if
%><title>ע������</title>