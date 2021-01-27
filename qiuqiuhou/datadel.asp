<!--#include file="conn.asp"-->
<%
set rs=server.createobject("adodb.recordset")
id=Request.QueryString("id")
sql="select * from main where id="&id
rs.open sql,conn,2,3
rs.delete
rs.update
  Url = "list.asp" & TypeArea
  Response.redirect(Url)
%>
