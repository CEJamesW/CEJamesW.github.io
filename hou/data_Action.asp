<!--#include file="conn.asp"-->
<%
  if session("admin")="" then
    Response.Write("<script>alert('ÓÃ»§Î´µÇÂ¼£¬ÇëµÇÂ¼£¡');top.location='index.asp';</script>")
	Response.end
  end if
 if not isempty(request.Form("IDList")) then
	Set rs=server.createobject("adodb.recordset")
	id=trim(request("IDList"))
    sql="delete from main where id in ("&cstr(ID)&")"
    conn.execute sql
    Response.Redirect("data.asp")
 end if
 %><meta http-equiv="refresh" content="0;URL=data.asp">