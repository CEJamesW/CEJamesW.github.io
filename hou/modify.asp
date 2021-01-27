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
  if Request.Form.count>0 then
      sql="update admin set password='" & replace(Request.form("password"),"'","''") & " where id=" & id
	  conn.execute sql
	  Response.redirect("admin.asp")
  else
      sql="select * from admin where id=" & id
	  rs.open sql,conn,1,1
	  if rs.recordcount=0 then
	        rs.close
			Response.Write("<script>alert('用户不存在，修改失败！');history.back();</script>")
			Response.end
	  else
	       admin=rs("adminname")
	       password=rs("password")
	  end if
	  rs.close
	  
  end if


%>